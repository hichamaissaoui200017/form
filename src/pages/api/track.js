// track.js

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
    console.log('Received tracking data:', req.body);

    try {
      const client = await pool.connect();
      const query = `
        INSERT INTO messages (session_id, message_id, username, sent_time, read_time, read_count)
        VALUES ($1, $2, $3, $4, NULL, 0)
        ON CONFLICT (message_id) DO NOTHING
      `;
      const values = [session_id, message_id, username, sent_time];
      await client.query(query, values);
      console.log('Data inserted successfully:', values);
      client.release();
      res.status(200).json({ message: 'Message tracked successfully' });
    } catch (error) {
      console.error('Error tracking message:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else if (req.method === 'GET') {
    const { message_id, username } = req.query;

    if (!message_id || !username) {
      return res.status(400).json({ error: 'Missing message_id or username' });
    }

    try {
      const client = await pool.connect();
      const updateQuery = `
        UPDATE messages
        SET read_time = COALESCE(read_time, NOW()), read_count = read_count + 1
        WHERE message_id = $1 AND username = $2
      `;
      await client.query(updateQuery, [message_id, username]);
      console.log(`Updated read status for message_id: ${message_id}, username: ${username}`);
      client.release();

      // Generate a unique filename for each request
      const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}.gif`;

      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Content-Disposition', `inline; filename="${uniqueFilename}"`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(transparentPixel);
    } catch (error) {
      console.error('Error updating read status:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}