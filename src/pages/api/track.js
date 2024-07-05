import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure you have this environment variable set in Vercel
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateStats(username, messageId, sessionId) {
  const timestamp = new Date().toISOString();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const res = await client.query(
      'SELECT * FROM stats WHERE session_id = $1 AND message_id = $2',
      [sessionId, messageId]
    );

    if (res.rows.length === 0) {
      await client.query(
        'INSERT INTO stats (session_id, message_id, username, sent_time, read_time, read_count) VALUES ($1, $2, $3, $4, $4, 1)',
        [sessionId, messageId, username, timestamp]
      );
    } else {
      await client.query(
        'UPDATE stats SET read_time = $1, read_count = read_count + 1 WHERE session_id = $2 AND message_id = $3',
        [timestamp, sessionId, messageId]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

const track = async (req, res) => {
  console.log('Track endpoint called');
  console.log('Query parameters:', req.query);
  console.log('Headers:', req.headers);

  // Extract the real query parameters from the URL
  const url = new URL(req.url, `https://${req.headers.host}`);
  const realPath = url.pathname.split('/').pop();
  const realParams = new URLSearchParams(realPath);

  const username = realParams.get('username');
  const messageId = realParams.get('messageId');
  const sessionId = realParams.get('sessionId');

  console.log('Extracted parameters:', { username, messageId, sessionId });

  if (!username || !messageId || !sessionId) {
    console.log('Missing required parameters');
    return res.status(400).send('Missing required parameters');
  }

  try {
    console.log('Updating stats...');
    await updateStats(username, messageId, sessionId);
    console.log('Stats updated successfully');
  } catch (error) {
    console.error('Error updating stats:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }

  // Send a 1x1 transparent GIF with a randomized name
  const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  const randomImageName = `${crypto.randomBytes(16).toString('hex')}.gif`;

  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Disposition', `inline; filename="${randomImageName}"`);
  res.send(img);
};

export default track;