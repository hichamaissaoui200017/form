import { kv } from '@vercel/kv';

const getStats = async (req, res) => {
  try {
    const stats = await kv.get('stats') || {};
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error reading stats:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export default getStats;