// pages/api/track/[id].js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

function generateColoredSquare(size = 10, color = 'FF0000') {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${color}"/>
    </svg>
  `;
  return Buffer.from(svg);
}

export default async function handler(req, res) {
  const { username } = req.query;
  console.log('Received tracking request:', req.query);

  if (!username) {
    console.error('Missing username');
    return res.status(400).json({ error: 'Missing username' });
  }

  try {
    const client = await pool.connect();
    console.log('Connected to database');
    
    const upsertQuery = `
      INSERT INTO message_opens (username, open_time, open_count)
      VALUES ($1, NOW(), 1)
      ON CONFLICT (username)
      DO UPDATE SET 
        open_time = NOW(), 
        open_count = message_opens.open_count + 1
    `;
    console.log('Executing upsert query:', upsertQuery, [username]);
    const upsertResult = await client.query(upsertQuery, [username]);
    console.log('Upsert query result:', upsertResult);
    
    client.release();

    const image = generateColoredSquare(10, 'FF0000');

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(image);
  } catch (error) {
    console.error('Error in tracking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}