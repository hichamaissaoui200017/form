const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

const transparentPixel = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { session_id, message_id, username, sent_time } = req.body;

    try {
      const client = await pool.connect();
      const query = `
        INSERT INTO messages (session_id, message_id, username, sent_time, read_time, read_count)
        VALUES ($1, $2, $3, $4, NULL, 0)
      `;
      const values = [session_id, message_id, username, sent_time];
      await client.query(query, values);
      client.release();
      res.status(200).json({ message: 'Message tracked successfully' });
    } catch (error) {
      console.error('Error tracking message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    const { message_id } = req.query;

    if (!message_id) {
      return res.status(400).json({ error: 'Missing message_id' });
    }

    try {
      const client = await pool.connect();
      const updateQuery = `
        UPDATE messages
        SET read_time = COALESCE(read_time, NOW()), read_count = read_count + 1
        WHERE message_id = $1
      `;
      await client.query(updateQuery, [message_id]);
      client.release();

      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(transparentPixel);
    } catch (error) {
      console.error('Error updating read status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}