export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const [cmcRes, usdtRes] = await Promise.all([
      fetch('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
        headers: { 'X-CMC_PRO_API_KEY': 'abd407dfba0a4897a40589cd8fd93c4b' }
      }),
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&include_market_cap=true')
    ]);

    const cmcData  = await cmcRes.json();
    const usdtData = await usdtRes.json();

    const totalMarketCap = cmcData.data.quote.USD.total_market_cap;
    const usdtMarketCap  = usdtData?.tether?.usd_market_cap || 0;
    const usdtDominance  = totalMarketCap > 0 ? (usdtMarketCap / totalMarketCap) * 100 : 0;

    res.json({
      dominance:      cmcData.data.btc_dominance,
      usdtDominance,
      totalMarketCap,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
