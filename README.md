# M‑Pesa SDK for Kenyan SMEs

A lightweight, developer‑friendly Node.js/Express SDK that helps Kenyan small and medium enterprises (SMEs) accept mobile‑money payments via Safaricom’s Daraja API—featuring graduated, bracket‑based fees, premium add‑ons, real‑time reconciliation, and easy integration with local systems.

---

[![npm version](https://img.shields.io/npm/v/mpesa-sdk-kenya)](https://www.npmjs.com/package/mpesa-sdk-kenya)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

- **Graduated Bracket‑Based Fees**  
  - Fees are calculated using Safaricom’s actual tariff brackets + our fixed‑plus‑percent markup.  
  - Transparent breakdown: Safaricom fee vs. our markup vs. total fee.

- **Tiered Subscription Cushion**  
  - Modest monthly subscription tiers to cover fixed costs and stabilize revenue.  
  - Starter merchants pay KSh 800/mo + transaction fees; higher‑volume tiers pay less or zero subscription.

- **Daraja STK Push Integration**  
  - Securely initiate payment prompts to customer phones with built‑in `/checkout` endpoint.

- **Webhook Support**  
  - Real‑time `/webhook` endpoint for payment confirmations, fees recorded per txn.

- **Premium Add‑Ons**  
  - Analytics dashboard, fraud alerts, automated reconciliation, inventory integration, multi‑currency support.

- **POS‑Ready & ERP‑Ready**  
  - Embed in Android POS via WebView or native HTTP calls.  
  - One‑click Odoo manifesto endpoint for Open Source ERP integration.

---

## 💰 Pricing

### Fee Calculation by Transaction Bracket

| Transaction Range (KES) | Safaricom Fee | Our Markup                          | Total Fee to Merchant           |
|-------------------------|--------------:|-------------------------------------|--------------------------------:|
| 1 – 100                 | 0             | Flat KSh 10                         | KSh 10                          |
| 101 – 500               | 7             | 1.5 % of amt (capped at KSh 5)      | 7 + min(1.5%·amt, 5)             |
| 501 – 1 000             | 13            | 1.5 % of amt (capped at KSh 10)     | 13 + min(1.5%·amt, 10)           |
| 1 001 – 2 500           | 33            | 1.25 % of amt (capped at KSh 20)    | 33 + min(1.25%·amt, 20)          |
| 2 501 – 5 000           | 57            | 1.00 % of amt (capped at KSh 30)    | 57 + min(1.00%·amt, 30)          |
| 5 001 – 15 000          | 100           | 0.75 % of amt (capped at KSh 50)    | 100 + min(0.75%·amt, 50)         |
| 15 001 – 50 000         | 108           | 0.50 % of amt (capped at KSh 75)    | 108 + min(0.50%·amt, 75)         |
| > 50 000                | 108           | 0.25 % of amt (capped at KSh 100)   | 108 + min(0.25%·amt, 100)        |

> _All totals are automatically rounded and appear in the merchant dashboard. See `utils/fees.js` for exact logic._

### Subscription Tiers

| Tier         | Monthly Volume (KES) | Subscription Fee (KES/mo) |  
|--------------|---------------------:|--------------------------:|  
| **Starter**    | 0 – 500 K            | 800                       |  
| **Growing**    | 500 K – 1 M          | 600                       |  
| **Business**   | 1 M – 5 M            | 400                       |  
| **Enterprise** | > 5 M                | 0                         |  

---

### Premium Add‑On Pricing

| Feature                      | Price (KES/mo) |
|------------------------------|---------------:|
| Analytics Dashboard          |          500   |
| Fraud Detection & Alerts     |          600   |
| Automated Reconciliation     |          800   |
| Inventory Integration        |        1,200   |
| Multi‑Currency Support       |        1,000   |

---

## 🔧 Installation

```bash
# From npm
npm install mpesa-sdk-kenya

# Or clone & install manually
git clone https://github.com/yourusername/mpesa-sdk-kenya.git
cd mpesa-sdk-kenya
npm install
```

---

## ⚙️ Configuration

1. Copy environment example:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials and pricing defaults:

   ```env
   MPESA_BASE_URL=https://sandbox.safaricom.co.ke
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your_passkey
   APP_URL=https://yourdomain.com
   CALLBACK_URL=https://yourdomain.com/webhook
   FREE_TIER_LIMIT=100
   FRAUD_ALERT_THRESHOLD=50000
   MONTHLY_RESET_CRON="0 0 1 * *"

   # Subscription fees
   STARTER_SUB_FEE=800
   GROWING_SUB_FEE=600
   BUSINESS_SUB_FEE=400

   # Premium add‑ons
   ANALYTICS_PACKAGE_PRICE=500
   FRAUD_ALERTS_PACKAGE_PRICE=600
   RECONCILIATION_PACKAGE_PRICE=800
   INVENTORY_INTEGRATION_PRICE=1200
   MULTICURRENCY_PACKAGE_PRICE=1000

   # (Optional) Production DB connection
   # DATABASE_URL=mongodb://user:pass@host:port/mpesa-sdk
   ```

---

## ▶️ Quick Start

1. **Run the server**  
   ```bash
   npm start
   ```

2. **Initiate a payment**  
   ```js
   // client.js
   const res = await fetch('https://yourdomain.com/checkout', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'x-api-key': 'merchant_api_key'
     },
     body: JSON.stringify({
       phone: '254712345678',
       amount: 1500,
       reference: 'Order-1001',
       description: 'Product purchase'
     })
   });
   console.log(await res.json());
   ```

3. **Handle the Daraja webhook**  
   M‑Pesa POSTs to `/webhook?merchantKey=<>&txnId=<>`. The SDK updates status, fees, and triggers any premium hooks.

4. **View merchant dashboard**  
   ```bash
   GET https://yourdomain.com/merchant/dashboard
   Headers: x-api-key: merchant_api_key
   ```

---

## 📖 API Reference

### POST `/checkout`

Initiate an STK Push and calculate fees.

- **Headers**: `x-api-key: <your_api_key>`
- **Body**:
  ```json
  {
    "phone": "2547XXXXXXXX",
    "amount": 1000
  }
  ```
- **Response**:
  ```json
  {
    "message": "STK Push initiated",
    "feeBreakdown": {
      "safaricomFee": 13,
      "ourMarkup": 10,
      "totalFee": 23
    }
  }
  ```

### POST `/webhook`

Receive M‑Pesa callbacks.

- **Query**: `?merchantKey=<key>&txnId=<txnId>`
- **Response**:
  ```json
  { "ResultCode": 0, "ResultDesc": "Accepted" }
  ```

### GET `/merchant/dashboard`

Retrieve merchant stats, subscription tier, monthly volume, and fee totals.

- **Headers**: `x-api-key: <your_api_key>`

### POST `/merchant/upgrade`

Upgrade from free → paid subscription tier.

### POST `/merchant/add-feature`

Enable a premium feature.

---

## 🛠️ Development

- **Linting**: ESLint + Prettier  
- **Tests**: Jest  
- **Cron jobs**: via `node-cron` for monthly resets  
- **Local webhook debugging**: ngrok  

---

## 🔒 Production Hardening

1. Persist data with PostgreSQL or MongoDB.  
2. Secure auth with JWT/OAuth2.  
3. Validate inputs using Joi or Zod.  
4. Verify webhook signatures per Safaricom docs.  
5. Use structured logging (Winston/Pino) and monitoring.  
6. Enforce HTTPS & CORS policies.

---

## 🤝 Contributing

1. Fork this repo  
2. Create a feature branch (`git checkout -b feature/foo`)  
3. Commit your changes (`git commit -m 'Add foo'`)  
4. Push (`git push origin feature/foo`)  
5. Open a PR

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

---

*Built with ❤️ by Simeon Ngalamou for Kenyan SMEs*  
