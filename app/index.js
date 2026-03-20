const express = require('express');
const pool = require('./db');

const app = express();
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

app.listen(process.env.APP_PORT, () => {
  console.log('Servidor listo');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error DB' });
  }
});