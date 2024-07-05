import { kv } from '@vercel/kv';

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

  // Send a 1x1 transparent GIF
  const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(img);
};

export default track;