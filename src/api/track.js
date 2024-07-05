const fs = require('fs').promises;
const path = require('path');

const STATS_FILE = '/tmp/read_stats.json';

async function updateStats(username, messageId, sessionId) {
  const timestamp = new Date().toISOString();
  let stats = {};

  try {
    const data = await fs.readFile(STATS_FILE, 'utf8');
    stats = JSON.parse(data);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error reading stats file:', error);
    }
  }

  if (!stats[sessionId]) {
    stats[sessionId] = { totalSent: 0, totalRead: 0, messages: {} };
  }

  if (!stats[sessionId].messages[messageId]) {
    stats[sessionId].messages[messageId] = {
      username,
      sentTime: timestamp,
      readTime: timestamp,
      readCount: 1
    };
    stats[sessionId].totalRead++;
  } else {
    stats[sessionId].messages[messageId].readCount++;
    stats[sessionId].messages[messageId].readTime = timestamp;
  }

  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

module.exports = async (req, res) => {
  const { username, messageId, sessionId } = req.query;

  if (!username || !messageId || !sessionId) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    await updateStats(username, messageId, sessionId);
  } catch (error) {
    console.error('Error updating stats:', error);
  }

  // Send a 1x1 transparent GIF
  const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(img);
};