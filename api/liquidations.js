export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const now     = Date.now();
    const cutoff  = now - 24 * 60 * 60 * 1000;
    const orders  = [];
    let   before  = null;
    let   done    = false;

    // Paginate OKX liquidations (max 100 per call)
    for (let i = 0; i < 20 && !done; i++) {
      let url = 'https://www.okx.com/api/v5/public/liquidation-orders?instType=SWAP&instFamily=BTC-USDT&state=filled&limit=100';
      if (before) url += `&before=${before}`;

      const resp = await fetch(url);
      const data = await resp.json();

      if (data.code !== '0' || !data.data?.length) break;

      for (const bucket of data.data) {
        for (const d of (bucket.details || [])) {
          const ts = parseInt(d.time || d.ts);
          if (ts < cutoff) { done = true; break; }
          orders.push({
            time:         ts,
            side:         d.posSide === 'long' ? 'SELL' : 'BUY', // match Binance convention
            averagePrice: parseFloat(d.bkPx),
            executedQty:  parseFloat(d.sz),
          });
        }
        if (done) break;
        // Use earliest timestamp in this batch for pagination
        const lastDetail = bucket.details?.[bucket.details.length - 1];
        if (lastDetail) before = parseInt(lastDetail.time || lastDetail.ts);
      }

      if (data.data.length < 100) break;
    }

    res.json({ orders, source: 'okx', count: orders.length });
  } catch (e) {
    res.status(500).json({ orders: [], source: 'error', error: e.message });
  }
}
