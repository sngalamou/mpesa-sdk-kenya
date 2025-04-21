/**
 * Pan-African Payment SDK Main Entry Point
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./core/utils/errors');
const { getConfig } = require('./core/utils/config');
const { apiKeyAuth } = require('./core/auth/middleware');
const { scheduleMonthlyReset } = require('./scripts/monthlyReset');
const { info } = require('./core/transaction/logger');

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Parse JSON request body
app.use(express.json());

// Enable CORS
app.use(cors());

// Simple request logging middleware
app.use((req, res, next) => {
  info('system', 'http_request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// API Routes
// M-Pesa routes
app.post('/checkout', apiKeyAuth, require('./routes/mpesa/checkout'));
app.post('/webhook', require('./routes/mpesa/webhook'));

// Card payment routes
app.post('/card/checkout', apiKeyAuth, require('./routes/card/checkout'));
app.get('/card/form/:transactionId', require('./routes/card/form'));

// Bank transfer routes
app.post('/bank/checkout', apiKeyAuth, require('./routes/bank/checkout'));
app.post('/bank/verify', apiKeyAuth, require('./routes/bank/verify'));

// Transaction routes
app.get('/transaction/:transactionId', apiKeyAuth, require('./routes/transaction/get'));
app.get('/transactions', apiKeyAuth, require('./routes/transaction/list'));

// Merchant routes
app.post('/merchant/register', require('./routes/merchant/register'));
app.get('/merchant/profile', apiKeyAuth, require('./routes/merchant/profile'));
app.post('/merchant/addons', apiKeyAuth, require('./routes/merchant/addons'));

// Dashboard routes (placeholder for MVP)
app.get('/merchant/dashboard', apiKeyAuth, (req, res) => {
  res.send('Merchant dashboard - coming soon');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = getConfig('PORT', 3000);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Schedule monthly reset cron job
  scheduleMonthlyReset();
});

// Export app for testing
module.exports = app;