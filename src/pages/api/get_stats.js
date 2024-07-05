import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure you have this environment variable set in Vercel
  ssl: {
    rejectUnauthorized: false
  }
});

const getStats = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM stats');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error reading stats:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  } finally {
    client.release();
  }
};

export default getStats;