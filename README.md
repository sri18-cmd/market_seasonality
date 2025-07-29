# 📊 Market Seasonality

Explore historical **volatility**, **liquidity**, and **performance** with our beautifully interactive market calendar.

---
## Deployement

https://market-seasonality.vercel.app

---

## 🚀 Overview

**Market Seasonality** is a visual web application that provides traders and investors with an intuitive way to analyze historical performance and volatility of assets like **BTC/USD** on a calendar interface.

Users can:
- View daily/weekly/monthly performance trends.
- Analyze price movements and volatility metrics for specific dates.
- Identify bullish or bearish trends based on historical seasonality data.

---

## 📌 Features

- 📆 **Interactive Calendar View**  
  Visual representation of market movement over the month, color-coded by performance.

- 📈 **Day-by-Day Performance Metrics**  
  See detailed insights like:
  - 📈 Performance %
  - 🌊 Volatility %
  - 💵 Current Price
  - 📊 OHLC (Open, High, Low, Close) chart

- 📉 **Historical Volatility Graph**  
  Visualize 12-month volatility trends for the selected asset.

- 📁 **Multi-asset Support** *(extensible)*  
  Easily switch assets (e.g., BTC/USD) using dropdown (can be scaled to more assets).

---

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Charts:** Recharts / Chart.js *(depending on implementation)*
- **State Management:** React Hooks


## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/market_seasonality.git
cd market_seasonality

# Install dependencies
npm install

# Run the development server
npm run dev
