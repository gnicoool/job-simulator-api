const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const connectWithRetry = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Conectado a PostgreSQL');
  } catch (err) {
    console.log('Esperando DB...');
    setTimeout(connectWithRetry, 2000);
  }
};

connectWithRetry();

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error DB' });
  }
});


// 🟢 GET ALL
app.get('/songs', async (req, res) => {
  const result = await pool.query(`
    SELECT 
      id,
      song AS campo1,
      artist AS campo2,
      album AS campo3,
      year_release AS campo4,
      duration_sec AS campo5,
      grammy AS campo6
    FROM songs
  `);

  res.json(result.rows);
});


// 🟢 GET ONE
app.get('/songs/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(`
    SELECT 
      id,
      song AS campo1,
      artist AS campo2,
      album AS campo3,
      year_release AS campo4,
      duration_sec AS campo5,
      grammy AS campo6
    FROM songs
    WHERE id = $1
  `, [id]);

  res.json(result.rows[0]);
});


app.post('/songs', async (req, res) => {
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;

  const result = await pool.query(`
    INSERT INTO songs (song, artist, album, year_release, duration_sec, grammy)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING 
      id,
      song AS campo1,
      artist AS campo2,
      album AS campo3,
      year_release AS campo4,
      duration_sec AS campo5,
      grammy AS campo6
  `, [campo1, campo2, campo3, campo4, campo5, campo6]);

  res.json(result.rows[0]);
});


app.put('/songs/:id', async (req, res) => {
  const { id } = req.params;
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;

  const result = await pool.query(`
    UPDATE songs
    SET 
      song = $1,
      artist = $2,
      album = $3,
      year_release = $4,
      duration_sec = $5,
      grammy = $6
    WHERE id = $7
    RETURNING 
      id,
      song AS campo1,
      artist AS campo2,
      album AS campo3,
      year_release AS campo4,
      duration_sec AS campo5,
      grammy AS campo6
  `, [campo1, campo2, campo3, campo4, campo5, campo6, id]);

  res.json(result.rows[0]);
});


// 🟢 DELETE
app.delete('/songs/:id', async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM songs WHERE id = $1', [id]);

  res.json({ message: 'Eliminado correctamente' });
});


app.listen(process.env.APP_PORT, () => {
  console.log('Servidor listo');
});