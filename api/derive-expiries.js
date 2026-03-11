// Returns available weekly expiry dates for a currency
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const { currency = 'BTC' } = req.query;
  try {
    const resp = await fetch('https://api.lyra.finance/public/get_instruments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency, instrument_type: 'option', expired: false })
    });
    const data = await resp.json();
    const expiries = [...new Set(
      (data.result || [])
        .filter(i => i.is_active)
        .map(i => i.instrument_name.split('-')[1])
    )].sort().slice(0, 16);

    res.json({ currency, expiries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
