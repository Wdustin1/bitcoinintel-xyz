export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const r = await fetch('http://46.202.177.190:3001/api/charts/btc-liquidation-map');
    if (!r.ok) throw new Error(`Upstream ${r.status}`);
    const buf = await r.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    res.setHeader('X-Fetched-At', new Date().toISOString());
    res.send(Buffer.from(buf));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
