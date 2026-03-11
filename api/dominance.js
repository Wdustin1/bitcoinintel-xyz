export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=60');

  try {
    // CoinMarketCap public data API — same source as TradingView BTC.D
    const [cmcRes, cgRes] = await Promise.all([
      fetch('https://api.coinmarketcap.com/data-api/v3/global-metrics/quotes/latest', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }),
      fetch('https://api.coingecko.com/api/v3/global')
    ]);

    const cmcData = await cmcRes.json();
    const cgData  = await cgRes.json();

    const dominance     = cmcData.data.btcDominance;
    const totalMarketCap = cgData.data.total_market_cap.usd;
    const usdtDominance  = cgData.data.market_cap_percentage.usdt || 0;

    res.json({ dominance, usdtDominance, totalMarketCap });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
