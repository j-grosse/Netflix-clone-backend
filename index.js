const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const { Pool } = require('pg');
const cors = require('cors');
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
app.use(cors());
app.use(express.json());
app.get('/api/movies', (req, res) => {
  pool
    .query('SELECT * FROM movies;')
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.get('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id]; //this need to be array!!
  pool
    .query('SELECT * FROM movies WHERE id=$1;', safeValues)
    .then(({ rowCount, rows }) => {
      // rowCount from the database response
      if (rowCount === 0) {
        res.status(404).json({ message: `Movie with id ${id} Not Found` });
      } else {
        console.log(rows);
        res.json(rows[0]); // rows is array of 1 item
      }
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.get('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id]; //this need to be array!!
  pool
    .query('SELECT * FROM movies WHERE id=$1;', safeValues)
    .then(({ rowCount, rows }) => {
      // rowCount from the database response
      if (rowCount === 0) {
        res.status(404).json({ message: `Movie with id ${id} Not Found` });
      } else {
        console.log(rows);
        res.json(rows[0]); // rows is array of 1 item
      }
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.post('/api/movies', (req, res) => {
  const { title, director, year, genre } = req.body;
  const safeValues = [title, director, year, genre]; //this needs to be array!!
  pool
    .query(
      'INSERT INTO movies (title,director,year,genre) VALUES ($1,$2,$3,$4) RETURNING *;',
      safeValues
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(201).json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  const safeValues = [title, author, year, id]; //this need to be array!!
  pool
    .query(
      'UPDATE movies SET title = $1,author=$2,year=$3 WHERE id=$4 RETURNING *;',
      safeValues
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(202).json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id]; //this need to be array!!
  pool
    .query('DELETE FROM movies WHERE id=$1 RETURNING *;', safeValues)
    .then(({ rows }) => {
      console.log(rows);
      res.json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.listen(PORT, () => console.log(`SERVER IS UP ON ${PORT}`));
