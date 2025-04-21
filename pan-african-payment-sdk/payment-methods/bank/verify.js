/**
 * Bank transfer verification
 */

const { getTransaction, updateTransactionStatus, TRANSACTION_STATUS } = require('../../core/transaction/store');
const { reconcileTransaction } = require('../../core/transaction/reconciliation');
const { info, error } = require('../../core/transaction/logger');

/**
 * Initiate bank transfer payment
 * @param {number} amount - Payment amount
 * @param {string} merchantId - Merchant ID
 * @param {string} transactionId - Transaction ID
 * @param {string} customerName - Customer name
 * @returns {Object} Bank payment instructions
 */
function initiateBankTransfer(amount, merchantId, transactionId, customerName = '') {
  try {
    // Get bank details for the transaction
    const { generateBankDetails } = require('./reference');
    const bankDetails = generateBankDetails(merchantId, transactionId, amount);
    
    // Create transaction record
    const { createTransaction } = require('../../core/transaction/store');
    const transaction = createTransaction({
      transactionId,
      merchantId,
      amount,
      customerName,
      customerReference: bankDetails.reference,
      paymentMethod: 'bank_transfer'
    });
    
    // Log bank transfer initiation
    info(transactionId, 'bank_transfer_initiated', {
      amount,
      reference: bankDetails.reference
    });
    
    return {
      success: true,
      message: 'Bank transfer initiated',
      transactionId,
      reference: bankDetails.reference,
      bankDetails
    };
  } catch (err) {
    // Log error
    error('system', 'bank_transfer_error', {
      message: err.message,
      transactionId
    });
    
    throw err;
  }
}

/**
 * Verify bank transfer payment
 * @param {string} reference - Bank reference number
 * @returns {Promise<Object>} Verification result
 */
async function verifyBankTransfer(reference) {
  try {
    // In a real implementation, we would:
    // 1. Query bank API or database for transfer with this reference
    // 2. Check if amount matches
    // 3. Update transaction status accordingly
    
    // For MVP, we'll simulate a manual verification process
    
    // Find transaction by reference
    let transactionId = null;
    let transaction = null;
    
    // This is inefficient, but works for MVP
    // In production, we would have a proper database query
    const { getMerchantTransactions } = require('../../core/transaction/store');
    for (const merchantId of ['M12345', 'M67890']) { // Sample merchant IDs
      const transactions = getMerchantTransactions(merchantId);
      
      for (const tx of transactions) {
        if (tx.customerReference === reference) {
          transaction = tx;
          transactionId = tx.id;
          break;
        }
      }
      
      if (transaction) break;
    }
    
    if (!transaction) {
      return {
        success: false,
        message: 'Transaction not found',
        reference
      };
    }
    
    // Log verification attempt
    info(transactionId, 'bank_transfer_verify', { reference });
    
    // For MVP, we'll assume verification is successful
    // In production, this would involve checking bank statements
    
    // Reconcile transaction
    const reconcileResult = reconcileTransaction(transactionId, {
      ResultCode: 0,
      ResultDesc: 'Success',
      reference: `BANK_${reference}`
    });
    
    return {
      success: true,
      message: 'Bank transfer verified',
      transactionId,
      reference
    };
  } catch (err) {
    // Log error
    error('system', 'bank_verify_error', {
      message: err.message,
      reference
    });
    
    throw err;
  }
}

/**
 * Check bank transfer status
 * @param {string} transactionId - Transaction ID
 * @returns {Object} Status information
 */
function checkBankTransferStatus(transactionId) {
  try {
    // Get transaction
    const transaction = getTransaction(transactionId);
    
    if (!transaction) {
      return {
        success: false,
        message: 'Transaction not found'
      };
    }
    
    // Check if payment method is bank transfer
    if (transaction.paymentMethod !== 'bank_transfer') {
      return {
        success: false,
        message: 'Not a bank transfer transaction'
      };
    }
    
    // Return current status
    return {
      success: true,
      reference: transaction.customerReference,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency || 'KES',
      initiated: transaction.timestamps.created,
      completed: transaction.timestamps.completed
    };
  } catch (err) {
    // Log error
    error(transactionId, 'bank_status_error', {
      message: err.message
    });
    
    throw err;
  }
}

module.exports = {
  initiateBankTransfer,
  verifyBankTransfer,
  checkBankTransferStatus
};