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
  if (req.method === 'GET') {
    console.log('Received GET request:', req.query);
    const { message_id, username } = req.query;

    if (!message_id || !username) {
      console.error('Missing message_id or username in GET request');
      // Still send the pixel, but log the error
      console.error('Invalid tracking attempt:', req.query);
    } else {
      try {
        const client = await pool.connect();
        const updateQuery = `
          UPDATE messages
          SET read_time = COALESCE(read_time, NOW()), read_count = read_count + 1
          WHERE message_id = $1 AND username = $2
        `;
        const result = await client.query(updateQuery, [message_id, username]);
        console.log(`Updated read status for message_id: ${message_id}, username: ${username}. Rows affected: ${result.rowCount}`);
        client.release();
      } catch (error) {
        console.error('Error updating read status:', error);
        // Don't send error response, still send the pixel
      }
    }

    // Always send the pixel, regardless of errors
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(transparentPixel);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}