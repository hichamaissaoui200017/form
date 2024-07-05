// get_stats.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      console.log('Connected to database');

      // Test query
      const testQuery = 'SELECT NOW()';
      const testResult = await client.query(testQuery);
      console.log('Test query result:', testResult.rows);

      // Check if table exists
      const tableCheckQuery = "SELECT to_regclass('public.messages')";
      const tableCheckResult = await client.query(tableCheckQuery);
      console.log('Table check result:', tableCheckResult.rows);

      // Check if there's data in the table
      const dataCheckQuery = 'SELECT COUNT(*) FROM messages';
      const dataCheckResult = await client.query(dataCheckQuery);
      console.log('Data check result:', dataCheckResult.rows);

      const query = `
        SELECT 
          session_id,
          COUNT(*) as total_messages,
          COUNT(CASE WHEN read_time IS NOT NULL THEN 1 END) as read_messages,
          MIN(sent_time) as session_start,
          MAX(COALESCE(read_time, sent_time)) as session_end,
          ARRAY_AGG(DISTINCT username) as users,
          ARRAY_AGG(DISTINCT CASE WHEN read_time IS NOT NULL THEN username END) as users_who_read
        FROM messages
        GROUP BY session_id
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