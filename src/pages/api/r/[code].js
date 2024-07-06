// pages/api/r/[code].js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  const { code } = req.query;
  console.log('Received short code:', code);

  try {
    const client = await pool.connect();
    const query = 'SELECT long_url FROM short_urls WHERE short_code = $1';
    console.log('Executing query:', query, [code]);
    const result = await client.query(query, [code]);
    console.log('Query result:', result.rows);
    client.release();

    if (result.rows.length > 0) {
      const longUrl = result.rows[0].long_url;
      console.log('Redirecting to:', longUrl);
      res.redirect(301, longUrl);
    } else {
      console.log('Short URL not found');
      res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error in URL redirect:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}