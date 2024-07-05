const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const query = `
        SELECT 
          session_id,
          COUNT(*) as total_messages,
          COUNT(CASE WHEN read_time IS NOT NULL THEN 1 END) as read_messages,
          MIN(sent_time) as session_start,
          MAX(COALESCE(read_time, sent_time)) as session_end
        FROM messages
        GROUP BY session_id
        ORDER BY session_start DESC
      `;
      const result = await client.query(query);
      client.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}