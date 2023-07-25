const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const { Pool } = require('pg');
const cors = require('cors');
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
// app.use(cors())
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

app.listen(PORT, () => console.log(`SERVER IS UP ON ${PORT}`));
