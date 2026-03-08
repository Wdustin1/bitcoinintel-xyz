export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const r = await fetch('http://46.202.177.190:3001/api/market/mining-cost');
    const data = await r.json();
    res.setHeader('Cache-Control', 'public, s-maxage=1800');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
