# Bitcoin Intel XYZ — Live Bitcoin Price Charts & Data Dashboard

> **[bitcoinintel.xyz](https://www.bitcoinintel.xyz)** — Free, real-time Bitcoin intelligence. No signup required.

[![Live Site](https://img.shields.io/badge/Live%20Site-bitcoinintel.xyz-F7931A?style=for-the-badge&logo=bitcoin)](https://www.bitcoinintel.xyz)
[![Twitter](https://img.shields.io/badge/Twitter-@BitcoinIntelXYZ-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/BitcoinIntelXYZ)

---

## What Is Bitcoin Intel XYZ?

Bitcoin Intel XYZ is a free, open-source Bitcoin analytics dashboard featuring **20+ live charts and data feeds** — all in one place. No accounts, no paywalls, no noise.

Built for Bitcoin investors, traders, and analysts who want clean, reliable data without the bloat.

**→ [View the live dashboard at bitcoinintel.xyz](https://www.bitcoinintel.xyz)**

---

## 📊 Charts & Data Features

### Price & Market
- **Live Bitcoin Price Chart** — Real-time BTC/USD with 7-day performance
- **Bitcoin Fear & Greed Index** — Smooth gradient gauge, live sentiment
- **BTC Dominance** — CoinMarketCap-sourced (~58–59%) + USDT dominance
- **Crypto Market Overview** — Top 10 coins by market cap

### Derivatives
- **Open Interest** — Total BTC futures OI across all major exchanges (CoinGlass)
- **Funding Rate** — Aggregated perpetual funding rate with directional signal
- **Liquidations Rekt** — 24h long/short liquidation volumes (OKX data)
- **Bitcoin Liquidation Map** — Price-level liquidation clusters (CoinGlass)
- **Bitcoin Liquidation Heatmap** — Historical liquidation heatmap

### On-Chain & Models
- **MVRV Z-Score** — Market Value to Realized Value Z-Score since 2012
- **BTC vs M2 Money Supply** — Bitcoin price overlaid on US M2 money supply
- **Stock-to-Flow (S2F)** — Historical S2F scatter plot with model price line
- **Hash Rate** — 1-year Bitcoin network hash rate trend
- **Mining Cost** — Electricity, production, and miner break-even price tiers
- **Halving Countdown** — Live countdown to the next Bitcoin halving
- **Rainbow Chart** — Log regression price bands from 2010 to 2029

### Macro
- **US National Debt Clock** — Live ticking US debt counter with per-second rate

### Advanced
- **Crypto Market Heatmap** — TradingView weekly market cap heatmap
- **Halving Spiral** — Year-over-year BTC price change visualized as a spiral

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JS, Chart.js 4.4 |
| Backend | Vercel Serverless Functions (Node.js) |
| Hosting | Vercel + Custom domain (Cloudflare DNS) |
| Charts | Chart.js, Canvas 2D API, TradingView Widget |

## 📡 Data Sources

| Data | Source |
|------|--------|
| BTC Price / Fear & Greed | CoinGecko |
| BTC Dominance | CoinMarketCap |
| Open Interest / Funding Rate | CoinGlass |
| Liquidations | OKX Public API |
| Liquidation Map / Heatmap | CoinGlass (via proxy) |
| Hash Rate / Rainbow / S2F | Blockchain.com |
| MVRV Z-Score | CoinMetrics Community API |
| M2 Money Supply | US Federal Reserve (FRED) |
| US National Debt | US Treasury |
| Mining Cost | Capriole methodology |

---

## 🚀 Run Locally

```bash
git clone https://github.com/Wdustin1/bitcoinintel-xyz.git
cd bitcoinintel-xyz

# Install Vercel CLI
npm i -g vercel

# Run dev server (handles API routes)
vercel dev
```

Open `http://localhost:3000`

---

## 📁 Project Structure

```
/
├── index.html          # Main dashboard (single-page)
├── api/                # Vercel serverless API routes
│   ├── price.js        # BTC price proxy
│   ├── dominance.js    # CoinMarketCap dominance
│   ├── funding.js      # CoinGlass funding rate
│   ├── openinterest.js # CoinGlass open interest
│   ├── liquidations.js # OKX liquidations
│   ├── liq-heatmap.js  # Liquidation heatmap proxy
│   ├── liq-map-img.js  # Liquidation map proxy
│   ├── mining-cost.js  # Mining cost proxy
│   ├── mvrv.js         # MVRV Z-Score (CoinMetrics)
│   ├── m2.js           # M2 money supply (FRED)
│   ├── debt.js         # US national debt
│   └── gold.js         # Gold price proxy
├── data/               # Static pre-generated data files
│   ├── m2-data.json
│   ├── us-debt.json
│   └── exchange-reserves-cg.json
└── vercel.json         # Vercel config
```

---

## 🔗 Links

- **Live Dashboard:** [bitcoinintel.xyz](https://www.bitcoinintel.xyz)
- **Twitter/X:** [@BitcoinIntelXYZ](https://x.com/BitcoinIntelXYZ)

---

## ⚠️ Disclaimer

All data is for informational purposes only. Not financial advice. Always do your own research (DYOR).

---

*Built with 🍊 and Bitcoin conviction.*
