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

///// RESTful API /////

// READ
app.get('/api/movies', (req, res) => {
  pool
    .query('SELECT * FROM movies;')
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// READ by ID
app.get('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id]; // safe against SQL injection. This need to be array
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

// SEARCH
app.get('/api/search', (req, res) => {
  const { title, director, year, rating, genre } = req.query;
  const conditions = [];
  const searchValues = [];

  if (title) {
    conditions.push('title ILIKE $' + (searchValues.length + 1));
    searchValues.push('%' + title + '%');
  }
  if (director) {
    conditions.push('director ILIKE $' + (searchValues.length + 1));
    searchValues.push('%' + director + '%');
  }
  if (year) {
    conditions.push('year = $' + (searchValues.length + 1));
    searchValues.push(year);
  }
  if (rating) {
    conditions.push('rating = $' + (searchValues.length + 1));
    searchValues.push(rating);
  }
  if (genre) {
    conditions.push('genre ILIKE $' + (searchValues.length + 1));
    searchValues.push('%' + genre + '%');
  }

  const query = 'SELECT * FROM movies WHERE ' + conditions.join(' AND ');
  console.log(query);
  pool
    .query(query, searchValues)
    .then(({ rowCount, rows }) => {
      if (rowCount === 0) {
        res.status(404).json({ message: 'No movies found with the given criteria' });
      } else {
        res.status(200).json(rows);
      }
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});


// CREATE
app.post('/api/movies', (req, res) => {
  const { title, director, year, rating, poster, genre } = req.body;
  const safeValues = [title, director, year, rating, poster, genre];
  pool
    .query(
      'INSERT INTO movies (title, director, year, rating, poster, genre) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;',
      safeValues
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(201).json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// UPDATE
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, director, year, rating, poster, genre } = req.body;
  const safeValues = [title, director, year, rating, poster, genre, id];
  pool
    .query(
      'UPDATE movies SET title = $1, director=$2, year=$3, rating=$4, poster=$5, genre=$6 WHERE id=$7 RETURNING *;',
      safeValues
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(202).json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// DELETE
app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id];
  pool
    .query('DELETE FROM movies WHERE id=$1 RETURNING *;', safeValues)
    .then(({ rows }) => {
      console.log(rows);
      res.json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// APP.LISTEN
app.listen(PORT, () => console.log(`SERVER IS UP ON ${PORT}`));
