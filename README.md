# 📈 BullStock — Stock Trading Platform

**BullStock** is a secure, full-featured stock trading platform designed for both novice investors and seasoned traders. With real-time market data, intuitive interfaces, and modern financial tools, it simplifies investment decisions, fund management, and portfolio tracking in one seamless experience.

---

## ✨ Key Features

- **🔐 Secure Authentication**
  - JWT-based auth with Google OAuth integration
  - OTP-based password reset
  - Role-based access control

- **📊 Real-Time Market & Portfolio Management**
  - Search stocks by ticker or name
  - Live price updates via WebSockets
  - Interactive charts of historical performance
  - Buy/sell execution with gain/loss analytics

- **📰 Live Market Feeds**
  - Integrated Finnhub API for real-time news
  - Streaming stock prices and indicators

- **📁 Transaction Ledger**
  - Downloadable trading history (PDF)
  - Transparent record of buys, sells, deposits, and withdrawals

- **💳 Fund Management with Stripe**
  - Secure deposits/withdrawals with Stripe integration
  - KYC verification
  - Real-time balance updates and email notifications

- **🖥️ Cross-Device Friendly UI**
  - Responsive React frontend with smooth UX across desktop and mobile

---

## 🛠️ Technology Stack

### Frontend

- **React.js + Redux** — Dynamic SPA and global state management  
- **Tailwind CSS** — Utility-first responsive UI  
- **Apollo Client** — GraphQL queries and cache  
- **TypeScript** — Type-safe, maintainable code

### Backend

- **Node.js + Express** — REST + GraphQL API  
- **GraphQL** — Flexible data access for frontend  
- **MongoDB Atlas** — NoSQL database for user, trading, and market data  
- **WebSockets** — Real-time market updates  
- **Redis** — High-speed caching for quotes and portfolios  
- **JWT + bcrypt** — Secure user authentication  
- **Nodemailer** — OTP and alert notifications

### Integrations

- **Stripe API** — Payment handling, transfers, and webhook support  
- **Finnhub API** — Real-time stock market data and financial news  
- **Google OAuth** — Simplified third-party authentication  
- **ngrok** — Webhook testing in local environments

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm

### Installation

```bash
git clone git@github.com:yubraj-rai/bullstock.git
cd BullStock
