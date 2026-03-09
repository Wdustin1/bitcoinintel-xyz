import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const [cmRes, priceRes] = await Promise.all([
      fetch('https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=SplyExNtv&start_time=2021-01-01&page_size=10000'),
      fetch('https://api.blockchain.info/charts/market-price?timespan=5years&format=json&cors=true')
    ]);
    const cm    = await cmRes.json();
    const price = await priceRes.json();

    const priceMap = {};
    (price.values || []).forEach(p => { priceMap[new Date(p.x * 1000).toISOString().substring(0,10)] = p.y; });

    const points = (cm.data || [])
      .filter(p => p.SplyExNtv && parseFloat(p.SplyExNtv) > 0)
      .map(p => ({
        t:    p.time.substring(0, 10),
        btc:  parseFloat(p.SplyExNtv),
        price: priceMap[p.time.substring(0, 10)] || null
      }));

    // Load CoinGlass current total (committed weekly)
    let cgCurrent = null;
    try {
      const cgPath = path.join(process.cwd(), 'data', 'exchange-reserves-cg.json');
      const cgData = JSON.parse(fs.readFileSync(cgPath, 'utf8'));
      cgCurrent = cgData;
    } catch {}

    res.json({ points, cgCurrent });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
