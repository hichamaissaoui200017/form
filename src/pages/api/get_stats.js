const fs = require('fs').promises;

const STATS_FILE = '/tmp/read_stats.json';

const getStats = async (req, res) => {
  try {
    const data = await fs.readFile(STATS_FILE, 'utf8');
    const stats = JSON.parse(data);
    res.status(200).json(stats);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(200).json({}); // Return empty object if file doesn't exist yet
    } else {
      console.error('Error reading stats file:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
};

export default getStats;