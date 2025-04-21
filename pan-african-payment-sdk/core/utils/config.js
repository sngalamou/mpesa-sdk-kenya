/**
 * Configuration loader and schema
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Default configuration values
const defaultConfig = {
  // Server config
  PORT: 3000,
  NODE_ENV: 'development',
  APP_URL: 'http://localhost:3000',
  
  // M-Pesa config
  MPESA_BASE_URL: 'https://sandbox.safaricom.co.ke',
  MPESA_CONSUMER_KEY: '',
  MPESA_CONSUMER_SECRET: '',
  MPESA_SHORTCODE: '',
  MPESA_PASSKEY: '',
  CALLBACK_URL: 'http://localhost:3000/webhook',
  
  // Business logic config
  FREE_TIER_LIMIT: 100,
  FRAUD_ALERT_THRESHOLD: 50000,
  MONTHLY_RESET_CRON: '0 0 1 * *',
  
  // Subscription fees
  STARTER_SUB_FEE: 800,
  GROWING_SUB_FEE: 600,
  BUSINESS_SUB_FEE: 400,
  
  // Add-on package prices
  ANALYTICS_PACKAGE_PRICE: 500,
  FRAUD_ALERTS_PACKAGE_PRICE: 600,
  RECONCILIATION_PACKAGE_PRICE: 800,
  INVENTORY_INTEGRATION_PRICE: 1200,
  MULTICURRENCY_PACKAGE_PRICE: 1000,
  
  // Security
  API_SECRET: 'development-secret-key'
};

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Configuration value
 */
function getConfig(key, defaultValue = undefined) {
  // Try to get from environment variables
  const envValue = process.env[key];
  
  if (envValue !== undefined) {
    return envValue;
  }
  
  // Try to get from default config
  if (defaultConfig[key] !== undefined) {
    return defaultConfig[key];
  }
  
  // Return provided default or null
  return defaultValue !== undefined ? defaultValue : null;
}

/**
 * Get all configuration
 * @returns {Object} Full configuration object
 */
function getAllConfig() {
  const config = {};
  
  // Merge default config with environment variables
  for (const key in defaultConfig) {
    config[key] = getConfig(key);
  }
  
  return config;
}

module.exports = {
  getConfig,
  getAllConfig
};