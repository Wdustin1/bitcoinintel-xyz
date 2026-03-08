export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const r = await fetch(
      'https://community-api.coinmetrics.io/v4/timeseries/asset-metrics?assets=btc&metrics=CapMVRVCur&start_time=2012-01-01&page_size=10000',
      { headers: { 'Accept': 'application/json' } }
    );
    const d = await r.json();
    const rows = (d.data || []).filter(p => p.CapMVRVCur && p.SplyExNtv !== undefined);

    // Compute Z-score from MVRV series
    const vals = rows.map(p => parseFloat(p.CapMVRVCur));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const std  = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);

    const points = rows.map((p, i) => ({
      t: p.time.substring(0, 10),
      mvrv: vals[i],
      z: (vals[i] - mean) / std
    }));

    res.json({ points, mean, std });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
