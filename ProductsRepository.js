class ProductsRepository {
	constructor(db) {
		this.db = db
	}

	createTables() {
		const sql = `
			CREATE TABLE IF NOT EXISTS products (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				product_id INTEGER NOT NULL,
				title TEXT NOT NULL,
				price TEXT NOT NULL,
				link TEXT NOT NULL,
				fullImage TEXT NOT NULL,
				short_description TEXT NOT NULL,
				properties JSON NOT NULL
			)
		`;
		return this.db.run(sql)
	}

	create(product) {
		return this.db.run(`
				INSERT INTO products
				(product_id,title,price,link,fullImage,short_description,properties)
				VALUES (?,?,?,?,?,?,?)
			`,
			[
				product.product_id,
				product.title,
				product.price,
				product.link,
				product.fullImage,
				product.short_description,
				JSON.stringify(product.properties)
			]
		);
	}
}

module.exports = ProductsRepository;