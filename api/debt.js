export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // cache 1hr
  try {
    // US Treasury Fiscal Data API — total public debt outstanding (most recent day)
    const r = await fetch(
      'https://api.fiscaldata.treasury.gov/services/api/v1/accounting/od/debt_to_penny?fields=record_date,tot_pub_debt_out_amt&sort=-record_date&limit=2',
      { headers: { 'Accept': 'application/json' } }
    );
    const d = await r.json();
    const rows = d.data || [];
    if (!rows.length) throw new Error('No data');

    const latest  = rows[0];
    const prev    = rows[1];

    const debtNow  = parseFloat(latest.tot_pub_debt_out_amt);
    const debtPrev = parseFloat(prev.tot_pub_debt_out_amt);
    const daysDiff = (new Date(latest.record_date) - new Date(prev.record_date)) / 86400000;
    const dailyIncrease = (debtNow - debtPrev) / daysDiff;
    const perSecond = dailyIncrease / 86400;

    res.json({
      debt: debtNow,
      recordDate: latest.record_date,
      dailyIncrease,
      perSecond,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
