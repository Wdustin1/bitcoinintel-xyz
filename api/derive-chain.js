// Vercel serverless proxy — fetches live options chain from Derive (api.lyra.finance)
// Usage: GET /api/derive-chain?currency=BTC&expiry=20260314
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  const { currency = 'BTC', expiry } = req.query;
  if (!expiry) return res.status(400).json({ error: 'Missing expiry param (YYYYMMDD)' });

  try {
    // 1. Fetch all instruments for currency
    const instrResp = await fetch('https://api.lyra.finance/public/get_instruments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency, instrument_type: 'option', expired: false })
    });
    const instrData = await instrResp.json();
    const instruments = (instrData.result || [])
      .filter(i => i.instrument_name.includes(`-${expiry}-`) && i.is_active);

    if (!instruments.length) return res.status(404).json({ error: 'No instruments found for this expiry' });

    // 2. Fetch tickers in parallel (max 20 calls)
    const limited = instruments.slice(0, 60);
    const tickers = await Promise.all(
      limited.map(i =>
        fetch('https://api.lyra.finance/public/get_ticker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instrument_name: i.instrument_name })
        }).then(r => r.json()).then(r => r.result).catch(() => null)
      )
    );

    // 3. Organize by strike
    const byStrike = {};
    for (const t of tickers) {
      if (!t) continue;
      const parts = t.instrument_name.split('-');
      const strike = parseInt(parts[2]);
      const type = parts[3]; // C or P
      const pricing = t.option_pricing || {};
      if (!byStrike[strike]) byStrike[strike] = {};
      byStrike[strike][type] = {
        bid: parseFloat(t.best_bid_price) || 0,
        ask: parseFloat(t.best_ask_price) || 0,
        mark: parseFloat(t.mark_price) || 0,
        delta: parseFloat(pricing.delta) || 0,
        theta: parseFloat(pricing.theta) || 0,
        iv: parseFloat(pricing.iv) || 0,
        instrument: t.instrument_name
      };
    }

    // 4. Get index price from first ticker
    const firstTicker = tickers.find(t => t);
    const indexPrice = firstTicker ? parseFloat(firstTicker.index_price) : null;

    res.json({ currency, expiry, indexPrice, strikes: byStrike });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
