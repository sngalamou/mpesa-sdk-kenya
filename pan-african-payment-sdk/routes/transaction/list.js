/**
 * List transactions endpoint
 */

const { getMerchantTransactions } = require('../../core/transaction/store');

/**
 * Handle list transactions request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function handleListTransactions(req, res, next) {
  try {
    const merchantId = req.merchant.id;
    
    // Get transactions
    const transactions = getMerchantTransactions(merchantId);
    
    // Return response
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (err) {
    next(err);
  }
}

module.exports = handleListTransactions;