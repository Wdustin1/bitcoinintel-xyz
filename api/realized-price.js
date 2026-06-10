// api/realized-price.js
// Returns BTC Realized Price (from MVRV) and Balanced Price (365-day avg)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=300');

  try {
    // ── Realized Price = Current Price / MVRV (CoinMetrics community, free) ──
    const cmRes = await fetch(
      'https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=CapMVRVCur,PriceUSD&frequency=1d&limit_per_asset=1',
      { headers: { Accept: 'application/json' } }
    );
    const cmData = await cmRes.json();
    const row = (cmData.data || [])[0] || {};
    const priceUSD  = parseFloat(row.PriceUSD  || 0);
    const mvrv      = parseFloat(row.CapMVRVCur || 1);
    const realizedPrice = priceUSD / mvrv;

    // ── Balanced Price = 365-day Volume-Weighted Mean Price (CoinGecko free) ──
    // Approximation: average of daily closes over past 365 days
    const cgRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily',
      { headers: { Accept: 'application/json' } }
    );
    const cgData = await cgRes.json();
    const prices = (cgData.prices || []).map(p => p[1]);
    const balancedPrice = prices.length
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : null;

    res.json({
      realizedPrice: Math.round(realizedPrice),
      balancedPrice: balancedPrice !== null ? Math.round(balancedPrice) : null,
      mvrv: parseFloat(mvrv.toFixed(3)),
      updatedAt: row.time || new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
