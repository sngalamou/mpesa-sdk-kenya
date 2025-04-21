/**
 * Bank transfer reference generator
 */

const crypto = require('crypto');
const { getConfig } = require('../../core/utils/config');

/**
 * Generate a bank transfer reference
 * @param {string} merchantId - Merchant ID
 * @param {string} transactionId - Transaction ID
 * @returns {string} Bank reference number
 */
function generateBankReference(merchantId, transactionId) {
  // Create a short, readable reference code
  const prefix = getConfig('BANK_REFERENCE_PREFIX', 'PAY');
  const timestamp = Date.now().toString().substring(7);
  const shortMerchantId = merchantId.substring(0, 3).toUpperCase();
  const randomChars = crypto.randomBytes(2).toString('hex').toUpperCase();
  
  return `${prefix}${shortMerchantId}${timestamp}${randomChars}`;
}

/**
 * Generate bank account details for a specific transaction
 * @param {string} merchantId - Merchant ID
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Transaction amount
 * @returns {Object} Bank account details
 */
function generateBankDetails(merchantId, transactionId, amount) {
  // Generate a unique reference number
  const reference = generateBankReference(merchantId, transactionId);
  
  // Return bank details (these would be configured per merchant in production)
  return {
    bankName: getConfig('DEFAULT_BANK_NAME', 'Kenya Commercial Bank'),
    accountName: getConfig('DEFAULT_ACCOUNT_NAME', 'Pan-African Payments Ltd'),
    accountNumber: getConfig('DEFAULT_ACCOUNT_NUMBER', '1234567890'),
    branchCode: getConfig('DEFAULT_BRANCH_CODE', '001'),
    swiftCode: getConfig('DEFAULT_SWIFT_CODE', 'KCBLKENX'),
    amount,
    reference,
    instructions: `Please include reference number ${reference} in your transfer details. Your payment will be processed once received.`
  };
}

module.exports = {
  generateBankReference,
  generateBankDetails
};