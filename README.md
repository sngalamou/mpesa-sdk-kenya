# M-Pesa SDK for Kenyan SMEs

A lightweight, developer-friendly payment SDK that enables Kenyan small and medium enterprises to easily integrate M-Pesa payments into their systems with competitive pricing and value-added services.

![M-Pesa SDK Banner](https://via.placeholder.com/800x200?text=M-Pesa+SDK+for+Kenyan+SMEs)

## Features

- **Competitive Transaction Fees**: Starting at just 0.45% with KSh 200 cap (lower than standard M-Pesa rates)
- **Volume-Based Pricing**: Automatic fee reductions as your business grows
- **Free Tier**: Process up to 100 transactions monthly at no cost
- **STK Push Integration**: Easy integration with Safaricom's Daraja API
- **Webhook Support**: Receive real-time payment confirmations
- **Premium Features**: Analytics, fraud alerts, automated reconciliation
- **POS Ready**: Seamlessly integrates with our Android POS solution

## Pricing

Our transparent, volume-based pricing rewards your growth:

| Monthly Volume (KES) | Your Fee (%) | M-Pesa Standard |
|----------------------|--------------|----------------|
| 0 - 500K             | 0.45%        | 0.5%           |
| 500K - 1M            | 0.40%        | 0.5%           |
| 1M - 5M              | 0.35%        | 0.5%           |
| > 5M                 | 0.30%        | 0.5%           |

*All transactions are capped at KSh 200 maximum fee.*

## Premium Add-ons

Enhance your payment processing with optional premium features:

- **Analytics Dashboard**: KSh 500/month
- **Fraud Detection & Alerts**: KSh 600/month
- **Automated Reconciliation**: KSh 800/month
- **Inventory Integration**: KSh 1,200/month

## Installation

```bash
npm install mpesa-sdk-kenya
```

Or clone this repository:

```bash
git clone https://github.com/yourusername/mpesa-sdk-kenya.git
cd mpesa-sdk-kenya
npm install
```

## Quick Start

1. **Configure your environment**:

```bash
cp .env.example .env
```

Edit the `.env` file with your Safaricom Daraja API credentials and other settings.

2. **Start the server**:

```bash
npm start
```

3. **Make your first payment request**:

```javascript
// Client-side example
const response = await fetch('https://your-server.com/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your_api_key'
  },
  body: JSON.stringify({
    phone: '254712345678',
    amount: 1000, // KES 1,000
    reference: 'Order #12345',
    description: 'Payment for groceries'
  })
});

const data = await response.json();
console.log('STK Push initiated:', data);
```

## API Reference

### Payment Endpoints

#### POST /checkout
Initiates an STK Push request to the customer's phone.

**Request:**
```json
{
  "phone": "254712345678",
  "amount": 1000,
  "reference": "Order #12345",
  "description": "Payment for groceries"
}
```

**Response:**
```json
{
  "CheckoutRequestID": "ws_CO_DMZ_12345678_09012023034917561",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted for processing",
  "CustomerMessage": "Success. Request accepted for processing",
  "transactionId": "TXN-1650890234-1234",
  "estimatedFee": 4.5
}
```

#### POST /webhook
Receives payment confirmations from M-Pesa (configured in your Daraja dashboard).

### Merchant Dashboard Endpoints

#### GET /merchant/dashboard
Retrieves merchant usage statistics and tier information.

**Response:**
```json
{
  "merchantName": "Example Store",
  "tier": "paid",
  "currentVolumeTier": "Business",
  "currentRate": "0.40%",
  "used": 45,
  "limit": "unlimited",
  "monthlySales": 780000,
  "monthlyFeesCollected": 3120,
  "features": {
    "analytics": true,
    "fraudAlerts": true,
    "reconciliation": true,
    "inventoryIntegration": false
  },
  "nextTierMilestone": {
    "threshold": 1000000,
    "remaining": 220000,
    "newRate": "0.35%"
  }
}
```

#### POST /merchant/upgrade
Upgrades from free to paid tier.

#### POST /merchant/add-feature
Adds a premium feature to the merchant account.

**Request:**
```json
{
  "feature": "inventoryIntegration"
}
```

## Hardware Integration

Our SDK seamlessly integrates with Android POS devices. Simply install our Android app or embed the SDK in your own application using our WebView integration guide.

## Development

### Prerequisites

- Node.js 14+
- npm or yarn
- Public HTTPS endpoint for webhook testing (or use ngrok for development)

### Running Tests

```bash
npm test
```

### Local Development with ngrok

For webhook testing during development:

```bash
# Install ngrok
npm install -g ngrok

# Start your local server
npm start

# In another terminal, start ngrok
ngrok http 3000

# Update your .env file with the ngrok URL
CALLBACK_URL=https://your-ngrok-url.ngrok.io/webhook
```

## Production Deployment

For production use:

1. Replace the in-memory merchant storage with a proper database (MongoDB/PostgreSQL)
2. Implement proper API key management and authentication
3. Set up proper logging and monitoring
4. Deploy to a secure HTTPS-enabled server
5. Register your production callback URL in the Safaricom Daraja portal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@ngalamou.com or open an issue on this repository.

---

Built with ❤️ for Kenyan SMEs
