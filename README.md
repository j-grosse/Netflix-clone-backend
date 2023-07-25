# How to create the Netflix clone backend


mkdir movies-backend
cd movies-backend

npm init -y
update package.json:
“start”: “node index.js”,
“dev”: “node —watch index.js”

npm i express dotenv pg cors
git init
git-ignore: .env


VSCode plugin: Thunder Client

via browser on elephantSQL website:
drop table books;
create table movies (id serial PRIMARY KEY, title varchar(255), director varchar(255), year int);
ON DELETE CASCADE;

INSERT INTO movies (title, director, year, genre) VALUES ('Die Wiese – Ein Paradies nebenan', 'Jan Haft', 2019, 'nature documentary');



create Github repo without README.md

deploy on render
enter env. variables

write code for node express server

Node Express.js code:

const express = require(‘express’)
const app = express();
require(‘dotenv/config’);
const PORT = process.env.PORT || 8000;
const {Pool } = require(‘pg’);
const cars = require(‘cors’)
const pool = new Pool({ connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING });

// app.use(cors());
app.use(express).json()); // body parser needs to be before the route definitions

// type in ElephantSQL first to debug and if it works then copy paste to this to this file here
//  RESTful API routes (monolithic approach)


app.get(‘/api/movies/:id’, (req, res) => {
const { id } = req.params;
const safeValues=[id]; // to prevent SQL injection
// id needs to be an array for ElephantSQL pool function
	pool
		.query(‘SELECT * FROM movies WHERE id=$1;’, safeValues)
		.then(({rowCount, rows}) => {
			// rowCount from the Database response
			if (data.rowCount === 0) {
res.status(404).json({message: `Movie with id ${id} Not Found`}));
			} else {
				console.log(rows);
				res.json(rows[0]); // rows is always array of 1 item

			console.log(data);
			res.json(data.rows);
			}
			})
		.catch(e => res.status(500).json({ message: e.message }));
});

app.post(‘/api/movies’, (req, res) => {

});

app.put(‘/api/movies/:id’, (req, res) => {

});

app.delete(‘/api/movies/:id’, (req, res) => {

});

app.listen(PORT, () => console.log(`SERVER IS UP ON ${PORT}`));
