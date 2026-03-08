export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const now   = Date.now();
    const since = now - 24 * 60 * 60 * 1000;
    const url   = `https://fapi.binance.com/fapi/v1/allForceOrders?symbol=BTCUSDT&startTime=${since}&limit=1000`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!Array.isArray(data)) {
      // Binance geo-blocked — try Bybit as fallback
      throw new Error('Binance unavailable');
    }

    res.json({ orders: data, source: 'binance' });
  } catch (e) {
    // Fallback: Bybit liquidations
    try {
      const bybitUrl = 'https://api.bybit.com/v5/market/recent-trade?category=linear&symbol=BTCUSDT&limit=1000';
      res.json({ orders: [], source: 'unavailable', error: e.message });
    } catch (e2) {
      res.json({ orders: [], source: 'unavailable', error: e2.message });
    }
  }
}
