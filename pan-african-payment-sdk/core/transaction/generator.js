/**
 * Transaction ID and reference generator
 */

const crypto = require('crypto');

/**
 * Generate a unique transaction ID
 * @returns {string} Unique transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(4).toString('hex');
  return `TXN${timestamp}${randomBytes}`;
}

/**
 * Generate a reference number for the customer
 * @param {string} merchantId - Merchant ID
 * @param {string} transactionId - Transaction ID
 * @returns {string} Customer reference number
 */
function generateCustomerReference(merchantId, transactionId) {
  // Create a shorter, user-friendly reference
  const shortMerchantId = merchantId.substring(0, 4);
  const timestamp = Date.now().toString().substring(7);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${shortMerchantId}${timestamp}${random}`;
}

/**
 * Generate a unique callback URL with query parameters
 * @param {string} baseUrl - Base callback URL
 * @param {string} merchantId - Merchant ID
 * @param {string} transactionId - Transaction ID
 * @returns {string} Complete callback URL
 */
function generateCallbackUrl(baseUrl, merchantId, transactionId) {
  const url = new URL(baseUrl);
  url.searchParams.append('merchantId', merchantId);
  url.searchParams.append('txnId', transactionId);
  
  return url.toString();
}

module.exports = {
  generateTransactionId,
  generateCustomerReference,
  generateCallbackUrl
};