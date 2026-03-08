export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
      headers: { 'X-CMC_PRO_API_KEY': 'abd407dfba0a4897a40589cd8fd93c4b' }
    });
    const data = await response.json();
    res.json({
      dominance:    data.data.btc_dominance,
      totalMarketCap: data.data.quote.USD.total_market_cap
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
