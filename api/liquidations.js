export const config = { regions: ['fra1'] };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const now   = Date.now();
    const since = now - 24 * 60 * 60 * 1000;
    const url   = `https://fapi.binance.com/fapi/v1/allForceOrders?symbol=BTCUSDT&startTime=${since}&limit=1000`;
    const response = await fetch(url);
    const data     = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(`Binance error: ${JSON.stringify(data)}`);
    }

    res.json({ orders: data, source: 'binance' });
  } catch (e) {
    res.status(500).json({ orders: [], source: 'error', error: e.message });
  }
}
