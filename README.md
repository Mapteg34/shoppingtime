# README #

Проект представляет собой прохождения тестового задания для компании (впрочем они просили их не называть, будем считать xetle)

### Постановка задачи ###

Task "Time for shopping!"

Sometimes we all need to choose and buy something online,
but we all know how time consuming it is - let’s try to automate it in some way.
Your task is to implement a little helper using any language that does the following:
* Parse an online shop’s catalog (any shop you like)
* Identify products you need based on any criteria you can come up with (e.g. size, price, color, type, etc.)
* Store results in an SQLite database (e.g. id, title, price, link to the product’s page)
* Optionally save product images

Requirements:
* You can use any publicly available API or library
* Parsing should be performed on HTML page and not on machine-readable format

### How do I get set up? ###

Для разворачивания теста необходимо:

1. git clone

2. nvm use 9

3. npm install

4. npm run

3. see database in db.sqlite

### Готовые ссылки ###

а нету их ;)

### Трудозатраты ###

Суммарно около 3 часов

### Используется ###

Нода и модули по задаче.

Нелегкое дело разбора страницы поручено (внезапно) jquery.
Во-первых в рамках задачи конкретики нет. Во вторых можно было и на php (или на любом другом языке),
но: многопоточность. Плюс у php нет friendly парсера. А те что есть требовательны к корректности DOM'а,
что часто на сайтах-донорах не выполнятеся...

Jquery на ноде конечно выглядит костылем, но задачу решает быстро, просто и в общепринятом формате.
Плюс парсинг приятней и вкусней когда мы спокойно селектим нужные нам элементы и минимально чувствительны
к изменениям на доноре.