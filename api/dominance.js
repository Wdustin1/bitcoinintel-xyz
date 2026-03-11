export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=60');

  try {
    const r = await fetch('https://api.coingecko.com/api/v3/global');
    const d = await r.json();
    const pct = d.data.market_cap_percentage;
    const totalMarketCap = d.data.total_market_cap.usd;

    res.json({
      dominance:     pct.btc || 0,
      usdtDominance: pct.usdt || 0,
      totalMarketCap,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
