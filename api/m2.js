export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    // Fetch M2 and BTC monthly price in parallel
    // Use CoinGecko market_chart for BTC — returns daily data, lightweight JSON
    const [m2Res, priceRes] = await Promise.all([
      fetch('https://fred.stlouisfed.org/graph/fredgraph.csv?id=M2SL'),
      fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=3650&interval=monthly')
    ]);

    const m2Text   = await m2Res.text();
    const priceJson = await priceRes.json();

    // Parse FRED CSV → { YYYY-MM: value }
    const m2Map = {};
    m2Text.split('\n').slice(1).forEach(line => {
      const [date, val] = line.trim().split(',');
      if (date && val && !isNaN(val)) m2Map[date.substring(0, 7)] = parseFloat(val);
    });

    // CoinGecko monthly prices → { YYYY-MM: price }
    const btcMap = {};
    (priceJson.prices || []).forEach(([ts, price]) => {
      const ym = new Date(ts).toISOString().substring(0, 7);
      if (!btcMap[ym]) btcMap[ym] = price;
    });

    // Join on YYYY-MM
    const points = Object.keys(m2Map)
      .filter(ym => btcMap[ym])
      .sort()
      .map(ym => ({ t: ym + '-01', m2: m2Map[ym], price: btcMap[ym] }));

    res.json({ points });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
