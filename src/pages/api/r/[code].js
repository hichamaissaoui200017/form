// pages/api/r/[code].js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const client = await pool.connect();
    const query = 'SELECT long_url FROM short_urls WHERE short_code = $1';
    const result = await client.query(query, [code]);
    client.release();

    if (result.rows.length > 0) {
      res.redirect(result.rows[0].long_url);
    } else {
      res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error in URL redirect:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
console.log('Received short code:', code);
console.log('Query result:', result.rows);