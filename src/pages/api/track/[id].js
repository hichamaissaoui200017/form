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
  const { username } = req.query;
  console.log('Received tracking request:', req.query);

  if (!username) {
    console.error('Missing username');
  } else {
    try {
      const client = await pool.connect();
      console.log('Connected to database');
      
      const upsertQuery = `
        INSERT INTO message_opens (username, open_time)
        VALUES ($1, NOW())
        ON CONFLICT (username)
        DO UPDATE SET 
          open_time = NOW(), 
          open_count = message_opens.open_count + 1
      `;
      console.log('Executing upsert query:', upsertQuery, [username]);
      const upsertResult = await client.query(upsertQuery, [username]);
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