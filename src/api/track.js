const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STATS_FILE = '/tmp/read_stats.json';

function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

function updateStats(username, messageId, sessionId) {
  const timestamp = new Date().toISOString();
  let stats = {};

  if (fs.existsSync(STATS_FILE)) {
    stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
  }

  if (!stats[sessionId]) {
    stats[sessionId] = { totalSent: 0, totalRead: 0, messages: {} };
  }

  if (!stats[sessionId].messages[messageId]) {
    stats[sessionId].messages[messageId] = {
      username,
      readTime: timestamp,
      readCount: 1
    };
    stats[sessionId].totalRead++;
  } else {
    stats[sessionId].messages[messageId].readCount++;
  }

  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

module.exports = (req, res) => {
  const { username, messageId, sessionId } = req.query;

  if (!username || !messageId || !sessionId) {
    return res.status(400).send('Missing required parameters');
  }

  updateStats(username, messageId, sessionId);

  // Send a 1x1 transparent GIF
  const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(img);
};