# M‑Pesa SDK for Kenyan SMEs

A lightweight, developer‑friendly Node.js/Express SDK that helps Kenyan small and medium enterprises (SMEs) accept mobile‑money payments via Safaricom’s Daraja API—featuring competitive, volume‑based fees, premium add‑ons, real‑time reconciliation, and easy integration with local systems.

---

[![npm version](https://img.shields.io/npm/v/mpesa-sdk-kenya)](https://www.npmjs.com/package/mpesa-sdk-kenya)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

- **Competitive Transaction Fees**  
  - Starting at **0.45%** per txn (cap **KSh 200**), undercutting standard M‑Pesa.
- **Volume‑Based Pricing**  
  - Automatic rate reductions as monthly sales grow.
- **Free Tier**  
  - Up to **100** STK Pushes per month at no cost.
- **Daraja STK Push Integration**  
  - Securely initiate payment prompts to customer phones.
- **Webhook Support**  
  - Real‑time callback endpoint for payment confirmations.
- **Premium Add‑Ons**  
  - Analytics dashboard, fraud alerts, automated reconciliation, inventory integration.
- **POS‑Ready**  
  - Embed in Android POS via WebView or native HTTP calls.
- **Odoo Plug‑In**  
  - One‑click manifest for Open Source ERP integration.

---

## 💰 Pricing

| Monthly Volume (KES) | Your Fee | M‑Pesa Standard |
|----------------------|----------|-----------------|
| 0 – 500 K            | **0.45%**| 0.50%           |
| 500 K – 1 M          | **0.40%**| 0.50%           |
| 1 M – 5 M            | **0.35%**| 0.50%           |
| > 5 M                | **0.30%**| 0.50%           |

_All transactions are capped at KSh 200 per transaction._

### Premium Add‑On Pricing

| Feature                      | Monthly Price (KES) |
|------------------------------|--------------------:|
| Analytics Dashboard          |               500   |
| Fraud Detection & Alerts     |               600   |
| Automated Reconciliation     |               800   |
| Inventory Integration        |             1,200   |

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

2. Edit `.env` with your credentials:

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
   ANALYTICS_PACKAGE_PRICE=500
   FRAUD_ALERTS_PACKAGE_PRICE=600
   RECONCILIATION_PACKAGE_PRICE=800
   INVENTORY_INTEGRATION_PRICE=1200
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
   // your-client.js
   const res = await fetch('https://yourdomain.com/checkout', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'x-api-key': 'merchant_paid_key'
     },
     body: JSON.stringify({
       phone: '254712345678',
       amount: 1500,
       reference: 'Order-1001',
       description: 'Product purchase'
     })
   });
   const data = await res.json();
   console.log(data);
   ```

3. **Handle the Daraja webhook**  
   - M‑Pesa will POST to your `/webhook` URL with `merchantKey` and `txnId` query params.
   - The SDK updates status, sales totals, fees collected, and triggers any premium hooks.

4. **View merchant dashboard**  
   ```bash
   GET https://yourdomain.com/merchant/dashboard
   Headers: x-api-key: merchant_paid_key
   ```

---

## 📖 API Reference

### POST `/checkout`

Initiate an STK Push.

- **Headers**: `x-api-key: <your_api_key>`
- **Body**:
  ```json
  {
    "phone": "2547XXXXXXXX",
    "amount": 1000,
    "reference": "Order #123",
    "description": "Payment for goods"
  }
  ```
- **Response**:
  ```json
  {
    "MerchantRequestID": "...",
    "CheckoutRequestID": "...",
    "ResponseCode": "0",
    "ResponseDescription": "Success",
    "transactionId": "TXN-...",
    "estimatedFee": 4.5
  }
  ```

### POST `/webhook`

Receive M‑Pesa callbacks (configure in Daraja portal).

- **Query**: `?merchantKey=<key>&txnId=<txnId>`
- **Body**: Daraja’s callback JSON.
- **Response**:
  ```json
  { "ResultCode": 0, "ResultDesc": "Accepted" }
  ```

### GET `/merchant/dashboard`

Retrieve merchant stats.

- **Headers**: `x-api-key: <your_api_key>`
- **Response**: JSON with tier, usage, monthly sales, fees collected, features, and next tier milestone.

### POST `/merchant/upgrade`

Upgrade free → paid.

- **Headers**: `x-api-key: free_key`
- **Response**:
  ```json
  { "success": true, "newTier": "paid", "features": { "analytics": true, ... } }
  ```

### POST `/merchant/add-feature`

Enable a premium feature.

- **Headers**: `x-api-key: <paid_key>`
- **Body**:
  ```json
  { "feature": "inventoryIntegration" }
  ```
- **Response**:
  ```json
  { "success": true, "features": { ... } }
  ```

---

## 🛠️ Development

- **Linting & formatting**: ESLint + Prettier  
- **Tests**: Jest (add your test suite under `/tests`)  
- **Local webhook debugging**: use [ngrok](https://ngrok.com/)  
- **Cron jobs**: via `node-cron` for monthly resets

---

## 🔒 Production Hardening

1. **Persist data** with PostgreSQL or MongoDB.  
2. **Secure auth**: replace in‑memory API keys with JWT/OAuth2.  
3. **Validate inputs**: use Joi or Zod schemas.  
4. **Verify webhook signatures** per Safaricom docs.  
5. **Structured logging**: integrate Winston/Pino and monitoring.  
6. **HTTPS & CORS**: enforce TLS and restrict origins.

---

## 🤝 Contributing

1. Fork this repo  
2. Create a feature branch (`git checkout -b feature/foo`)  
3. Commit your changes (`git commit -m 'Add foo'`)  
4. Push (`git push origin feature/foo`)  
5. Open a PR

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ by Simeon Ngalamou for Kenyan SMEs*  
