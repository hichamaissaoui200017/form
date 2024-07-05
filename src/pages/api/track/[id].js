// pages/api/track/[id].js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

const transparentPixel = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

export default async function handler(req, res) {
  const { message_id, username, session_id } = req.query;
  console.log('Received tracking request:', req.query);

  if (!message_id || !username) {
    console.error('Missing message_id or username');
  } else {
    try {
      const client = await pool.connect();
      console.log('Connected to database');
      
      const upsertQuery = `
        INSERT INTO messages (session_id, message_id, username, sent_time, read_time, read_count)
        VALUES ($1, $2, $3, NOW(), NOW(), 1)
        ON CONFLICT (message_id)
        DO UPDATE SET 
          read_time = NOW(), 
          read_count = messages.read_count + 1,
          username = EXCLUDED.username,
          session_id = EXCLUDED.session_id
      `;
      console.log('Executing upsert query:', upsertQuery, [session_id || 'unknown_session', message_id, username]);
      const upsertResult = await client.query(upsertQuery, [session_id || 'unknown_session', message_id, username]);
      console.log('Upsert query result:', upsertResult);
      
      client.release();
    } catch (error) {
      console.error('Error in tracking:', error);
    }
  }

  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(transparentPixel);
}