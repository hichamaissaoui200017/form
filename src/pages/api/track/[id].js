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
      
      // First, check if the message exists
      const checkQuery = `
        SELECT * FROM messages 
        WHERE message_id = $1 AND username = $2
      `;
      console.log('Executing check query:', checkQuery, [message_id, username]);
      const checkResult = await client.query(checkQuery, [message_id, username]);
      console.log('Check query result:', checkResult.rows);
      
      if (checkResult.rows.length === 0) {
        // If the message doesn't exist, insert a new record
        const insertQuery = `
          INSERT INTO messages (session_id, message_id, username, sent_time, read_time, read_count)
          VALUES ($1, $2, $3, NOW(), NOW(), 1)
        `;
        console.log('Executing insert query:', insertQuery, [session_id || 'unknown_session', message_id, username]);
        const insertResult = await client.query(insertQuery, [session_id || 'unknown_session', message_id, username]);
        console.log('Insert query result:', insertResult);
      } else {
        // If the message exists, update it
        const updateQuery = `
          UPDATE messages
          SET read_time = COALESCE(read_time, NOW()), read_count = read_count + 1
          WHERE message_id = $1 AND username = $2
        `;
        console.log('Executing update query:', updateQuery, [message_id, username]);
        const updateResult = await client.query(updateQuery, [message_id, username]);
        console.log('Update query result:', updateResult);
      }
      
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