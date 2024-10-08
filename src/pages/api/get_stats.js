// pages/api/get_stats.js

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
        SELECT 
          COALESCE(session_id, 'unknown_session') as session_id,
          COUNT(*) as total_messages,
          COUNT(CASE WHEN read_time IS NOT NULL THEN 1 END) as read_messages,
          MIN(sent_time) as session_start,
          MAX(COALESCE(read_time, sent_time)) as session_end,
          ARRAY_AGG(DISTINCT username) as users,
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT CASE WHEN read_time IS NOT NULL THEN username END), NULL) as users_who_read,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'username', username,
              'message_id', message_id,
              'read_time', read_time,
              'read_count', read_count
            )
          ) FILTER (WHERE read_time IS NOT NULL) as read_details
        FROM messages
        GROUP BY COALESCE(session_id, 'unknown_session')
        ORDER BY session_start DESC
      `;
      
      console.log('Executing query:', query);
      const result = await client.query(query);
      console.log('Query result:', result.rows);
      
      client.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error in get_stats:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}