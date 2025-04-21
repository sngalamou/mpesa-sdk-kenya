/**
 * Get transaction endpoint
 */

const { getTransaction } = require('../../core/transaction/store');
const { NotFoundError } = require('../../core/utils/errors');

/**
 * Handle get transaction request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function handleGetTransaction(req, res, next) {
  try {
    const { transactionId } = req.params;
    const merchantId = req.merchant.id;
    
    // Get transaction
    const transaction = getTransaction(transactionId);
    
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }
    
    // Check if transaction belongs to merchant
    if (transaction.merchantId !== merchantId) {
      throw new NotFoundError('Transaction not found');
    }
    
    // Return response
    res.json({
      success: true,
      transaction
    });
  } catch (err) {
    next(err);
  }
}

module.exports = handleGetTransaction;