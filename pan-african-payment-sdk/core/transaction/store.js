/**
 * Transaction data access layer
 */

// In-memory transaction store (replace with database in production)
const transactions = new Map();

// Transaction status enum
const TRANSACTION_STATUS = {
  INITIATED: 'initiated',
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Object} Created transaction
 */
function createTransaction(transactionData) {
  const {
    transactionId,
    merchantId,
    amount,
    phone,
    customerName = '',
    customerReference,
    paymentMethod,
    currency = 'KES',
    metadata = {}
  } = transactionData;

  // Calculate fees
  const { calculateFees } = require('../fees/calculator');
  const fees = calculateFees(amount);

  // Create transaction object
  const transaction = {
    id: transactionId,
    merchantId,
    amount,
    currency,
    fees,
    phone,
    customerName,
    customerReference,
    paymentMethod,
    status: TRANSACTION_STATUS.INITIATED,
    metadata,
    timestamps: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      completed: null
    }
  };

  // Store transaction
  transactions.set(transactionId, transaction);

  return transaction;
}

/**
 * Get transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Object|null} Transaction if found
 */
function getTransaction(transactionId) {
  return transactions.get(transactionId) || null;
}

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} status - New status
 * @param {Object} additionalData - Additional data to update
 * @returns {Object|null} Updated transaction
 */
function updateTransactionStatus(transactionId, status, additionalData = {}) {
  const transaction = transactions.get(transactionId);
  
  if (!transaction) return null;
  
  // Update transaction
  transaction.status = status;
  transaction.timestamps.updated = new Date().toISOString();
  
  if (status === TRANSACTION_STATUS.COMPLETED) {
    transaction.timestamps.completed = new Date().toISOString();
  }
  
  // Update any additional fields
  Object.assign(transaction, additionalData);
  
  // Save updated transaction
  transactions.set(transactionId, transaction);
  
  return transaction;
}

/**
 * Get all transactions for a merchant
 * @param {string} merchantId - Merchant ID
 * @returns {Array} Merchant's transactions
 */
function getMerchantTransactions(merchantId) {
  const merchantTransactions = [];
  
  for (const transaction of transactions.values()) {
    if (transaction.merchantId === merchantId) {
      merchantTransactions.push(transaction);
    }
  }
  
  return merchantTransactions;
}

module.exports = {
  createTransaction,
  getTransaction,
  updateTransactionStatus,
  getMerchantTransactions,
  TRANSACTION_STATUS
};