const axios = require('axios');
const sqlite3 = require('sqlite3');
const Db = require('./Db');
const ProductsRepository = require('./ProductsRepository');

let db = new Db('db.sqlite');
let repo = new ProductsRepository(db);

repo.createTables();

var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;

const pagesDemoLimit = 3; // 0 for disable
const productsDemoLimit =3; // 0 for disable

var $ = jQuery = require('jquery')(window);

console.log("Start parser");

const baseShopUrl = 'https://www.citilink.ru/catalog/audio_and_digits/tv/';

let loadShopPages = function () {
	return new Promise(function(resolve, reject) {
		let pages = {};
		let pagesCounter = 0;

		let result = function(){
			console.log('pages loaded: '+pagesCounter+(pagesDemoLimit ? ' (demo limit: '+pagesDemoLimit+')' : ''));
			resolve(pages);
		}

		axios.get(baseShopUrl).then(response => {
			pages[1] = response.data;
			pagesCounter++;

			let totalPages = $(response.data).find('.page_listing li.last a').eq(0).data('page');
			if (totalPages <= 1) return result();
			if (pagesDemoLimit!==0 && totalPages>pagesDemoLimit) {
				totalPages = pagesDemoLimit; // срезаем сверху, ибо демо
			}
			let queries = [];
			for (let i = 2; i <= totalPages; i++) {
				queries.push(axios.get(`${baseShopUrl}?p=${i}`));
			}
			axios.all(queries)
				.then(axios.spread((...args) => {
					for (let i = 2; i <= totalPages; i++) {
						pages[i] = args[i - 2].data;
						pagesCounter++;
					}
					return result();
				})).catch(error => {
				reject(error);
			});
		}).catch(error => {
			reject(error);
		});
	});
};

let getProductsLinks = function(pages){
	return new Promise(function(resolve, reject) {
		let productsLinks = [];
		for (let pageNumber in pages) {
			if (!pages.hasOwnProperty(pageNumber)) {
				continue;
			}
			$(pages[pageNumber]).find('.h3 a.ddl_product_link').each(function () {
				productsLinks.push($(this).attr('href'));
			});
		}
		console.log('Products links parsed: '+productsLinks.length);
		resolve(productsLinks);
	});
};

let loadProducts = function(links) {
	return new Promise(function(resolve, reject) {
		let productsData = {};
		let productsDataCounter = 0;

		let queries = [];
		for (let i=0; i<links.length && (productsDemoLimit===0 || i<productsDemoLimit); i++) {
			queries.push(axios.get(links[i]));
		}
		axios.all(queries)
			.then(axios.spread((...args) => {
				for (let i = 0; i < links.length && (productsDemoLimit===0 || i<productsDemoLimit); i++) {
					productsData[links[i]] = args[i].data;
					productsDataCounter++;
				}
				console.log('Products loaded: '+productsDataCounter+(productsDemoLimit ? ' (demo limit: '+productsDemoLimit+')' : ''));
				resolve(productsData);
			})).catch(error => {
			reject(error);
		});
	});
};

let getProductsData = function(productsData) {
	let products = [];
	for (let productLink in productsData) {
		if (!productsData.hasOwnProperty(productLink)) {
			continue;
		}
		let doc = $(productsData[productLink]);
		let product = {
			product_id: doc.find('.product_id').text().trim(),
			title: doc.find('h1').text(),
			price: doc.find('.price.price_break .num').text(),
			link: productLink,
			fullImage: doc.find('.full_content img').attr('src'),
			short_description: doc.find('.short_description').text(),
			properties:{},
		};
		doc.find('.product_features .property_name').each(function(){
			product.properties[$(this).text()] = $(this).closest('tr').find('td').last().text();
		});
		repo.create(product);
		products.push(product);
	}
	console.log('Products parsed: '+products.length);
};

loadShopPages()
	.then(getProductsLinks)
	.then(loadProducts)
	.then(getProductsData);