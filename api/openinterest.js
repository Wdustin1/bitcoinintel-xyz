const CG_KEY = '2880d014de714442baf6258c0cb4f786';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const r = await fetch('https://open-api.coinglass.com/public/v2/open_interest?symbol=BTC', {
      headers: { coinglassSecret: CG_KEY }
    });
    const d = await r.json();
    res.json(d);
  } catch (e) {
    res.status(500).json({ code: 'error', msg: e.message });
  }
}
