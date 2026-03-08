export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const [m2Res, priceRes] = await Promise.all([
      fetch('https://fred.stlouisfed.org/graph/fredgraph.csv?id=M2SL'),
      fetch('https://api.blockchain.info/charts/market-price?timespan=all&format=json&cors=true')
    ]);
    const m2Text = await m2Res.text();
    const price  = await priceRes.json();

    // Parse FRED CSV
    const m2Points = [];
    m2Text.split('\n').slice(1).forEach(line => {
      const [date, val] = line.trim().split(',');
      if (date && val && !isNaN(val)) m2Points.push({ t: date, m2: parseFloat(val) });
    });

    // Monthly BTC prices (first point of each month)
    const btcMonthly = {};
    (price.values || []).forEach(p => {
      const ym = new Date(p.x * 1000).toISOString().substring(0, 7);
      if (!btcMonthly[ym]) btcMonthly[ym] = p.y;
    });

    const points = m2Points.map(p => ({
      t:     p.t,
      m2:    p.m2,
      price: btcMonthly[p.t.substring(0, 7)] || null
    })).filter(p => p.price);

    res.json({ points });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
