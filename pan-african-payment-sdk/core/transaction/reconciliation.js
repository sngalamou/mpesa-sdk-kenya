/**
 * Transaction reconciliation
 */

const { getTransaction, updateTransactionStatus, TRANSACTION_STATUS } = require('./store');
const { error, info } = require('./logger');
const { updateMerchantVolume } = require('../auth/merchant');

/**
 * Reconcile a transaction with a callback from payment provider
 * @param {string} transactionId - Transaction ID
 * @param {Object} callbackData - Callback data from payment provider
 * @returns {Object} Reconciliation result
 */
function reconcileTransaction(transactionId, callbackData) {
  // Get transaction
  const transaction = getTransaction(transactionId);
  
  if (!transaction) {
    error(transactionId, 'reconciliation_failed', { reason: 'transaction_not_found' });
    return { success: false, reason: 'Transaction not found' };
  }
  
  // Extract result code from callback (depends on payment provider)
  const resultCode = callbackData.ResultCode || callbackData.resultCode;
  
  // Process based on result code
  if (resultCode === '0' || resultCode === 0) {
    // Successful payment
    const updatedTransaction = updateTransactionStatus(
      transactionId,
      TRANSACTION_STATUS.COMPLETED,
      {
        providerReference: callbackData.mpesaReceiptNumber || callbackData.reference,
        completionTime: callbackData.transactionDate || new Date().toISOString(),
        callbackData
      }
    );
    
    // Update merchant volume
    updateMerchantVolume(transaction.merchantId, transaction.amount);
    
    info(transactionId, 'transaction_completed', { 
      amount: transaction.amount,
      fees: transaction.fees
    });
    
    return { 
      success: true, 
      transaction: updatedTransaction 
    };
  } else {
    // Failed payment
    const updatedTransaction = updateTransactionStatus(
      transactionId,
      TRANSACTION_STATUS.FAILED,
      {
        failureReason: callbackData.ResultDesc || callbackData.resultDescription || 'Unknown reason',
        callbackData
      }
    );
    
    error(transactionId, 'transaction_failed', { 
      resultCode,
      reason: callbackData.ResultDesc || callbackData.resultDescription
    });
    
    return { 
      success: false, 
      transaction: updatedTransaction,
      reason: callbackData.ResultDesc || callbackData.resultDescription
    };
  }
}

module.exports = {
  reconcileTransaction
};