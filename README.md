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
