const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { session_id, message_id, username, sent_time, read_time, read_count } = req.body;

    try {
      const client = await pool.connect();
      const query = `
        INSERT INTO stats (session_id, message_id, username, sent_time, read_time, read_count)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const values = [session_id, message_id, username, sent_time, read_time, read_count];
      await client.query(query, values);
      client.release();
      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const randomImageName = crypto.randomBytes(16).toString('hex') + '.png';
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'images', randomImageName));
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}