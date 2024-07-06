// pages/api/shorten.js

const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const client = await pool.connect();

      // Generate a short code
      const shortCode = crypto.randomBytes(4).toString('hex');

      const query = `
        INSERT INTO short_urls (short_code, long_url)
        VALUES ($1, $2)
        ON CONFLICT (long_url) DO UPDATE SET long_url = EXCLUDED.long_url
        RETURNING short_code
      `;
      const result = await client.query(query, [shortCode, url]);
      
      client.release();

      const shortUrl = `https://chess.eliteofferz.store/r/${result.rows[0].short_code}`;
      res.status(200).json({ shortUrl });
    } catch (error) {
      console.error('Error in URL shortening:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
console.log('Received URL to shorten:', url);
console.log('Generated short code:', shortCode);
console.log('Inserted/Updated short URL:', result.rows[0]);