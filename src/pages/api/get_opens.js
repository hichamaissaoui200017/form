// pages/api/get_opens.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      console.log('Connected to database');

      const query = `
        SELECT username, open_time, open_count
        FROM message_opens
        ORDER BY open_time DESC
      `;
      
      console.log('Executing query:', query);
      const result = await client.query(query);
      console.log('Query result:', result.rows);
      
      client.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error in get_opens:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}