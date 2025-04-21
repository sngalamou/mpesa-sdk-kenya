/**
 * API key generation and validation
 */

const crypto = require('crypto');
const { getConfig } = require('../utils/config');

// In-memory store for API keys (replace with database in production)
const apiKeys = new Map();

/**
 * Generate a new API key for a merchant
 * @param {string} merchantId - Unique merchant identifier
 * @param {string} tier - Merchant subscription tier
 * @returns {string} Generated API key
 */
function generateApiKey(merchantId, tier = 'Starter') {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const data = `${merchantId}-${tier}-${timestamp}-${randomBytes}`;
  
  // Create HMAC using secret key
  const hmac = crypto.createHmac('sha256', getConfig('API_SECRET', 'default-secret-key'));
  hmac.update(data);
  
  const apiKey = `mpesa_${hmac.digest('hex')}`;
  
  // Store API key with merchant info (in-memory for demo)
  apiKeys.set(apiKey, {
    merchantId,
    tier,
    createdAt: timestamp
  });
  
  return apiKey;
}

/**
 * Validate an API key
 * @param {string} apiKey - API key to validate
 * @returns {Object|null} Merchant info if valid, null otherwise
 */
function validateApiKey(apiKey) {
  if (!apiKey || !apiKeys.has(apiKey)) {
    return null;
  }
  
  return apiKeys.get(apiKey);
}

/**
 * Revoke an API key
 * @param {string} apiKey - API key to revoke
 * @returns {boolean} Success indicator
 */
function revokeApiKey(apiKey) {
  if (!apiKey || !apiKeys.has(apiKey)) {
    return false;
  }
  
  return apiKeys.delete(apiKey);
}

module.exports = {
  generateApiKey,
  validateApiKey,
  revokeApiKey
};