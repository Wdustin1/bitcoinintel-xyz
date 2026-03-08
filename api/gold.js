export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const [goldRes, priceRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1mo&range=max', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }),
      fetch('https://api.blockchain.info/charts/market-price?timespan=all&format=json&cors=true')
    ]);
    const goldData = await goldRes.json();
    const price    = await priceRes.json();

    const result = goldData?.chart?.result?.[0];
    const goldTs  = result?.timestamp || [];
    const goldPx  = result?.indicators?.quote?.[0]?.close || [];

    // Monthly gold prices
    const goldMonthly = {};
    goldTs.forEach((ts, i) => {
      if (goldPx[i]) {
        const ym = new Date(ts * 1000).toISOString().substring(0, 7);
        goldMonthly[ym] = goldPx[i];
      }
    });

    // Monthly BTC prices
    const btcMonthly = {};
    (price.values || []).forEach(p => {
      const ym = new Date(p.x * 1000).toISOString().substring(0, 7);
      if (!btcMonthly[ym]) btcMonthly[ym] = p.y;
    });

    // Build ratio series
    const points = Object.keys(goldMonthly)
      .filter(ym => btcMonthly[ym])
      .sort()
      .map(ym => ({
        t:     ym + '-01',
        ratio: btcMonthly[ym] / goldMonthly[ym],
        btc:   btcMonthly[ym],
        gold:  goldMonthly[ym]
      }));

    res.json({ points });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
