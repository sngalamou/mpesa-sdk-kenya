/**
 * M-Pesa webhook/callback handler
 */

const { reconcileTransaction } = require('../../core/transaction/reconciliation');
const { getTransaction, updateTransactionStatus, TRANSACTION_STATUS } = require('../../core/transaction/store');
const { info, error } = require('../../core/transaction/logger');

/**
 * Process M-Pesa STK Push callback
 * @param {Object} callbackData - Callback data from M-Pesa
 * @param {string} transactionId - Transaction ID
 * @returns {Object} Processing result
 */
function processSTKCallback(callbackData, transactionId) {
  try {
    // Extract the callback body
    const callbackBody = callbackData.Body && callbackData.Body.stkCallback;
    
    if (!callbackBody) {
      error(transactionId, 'mpesa_callback_invalid', { 
        reason: 'Missing stkCallback body',
        data: callbackData
      });
      
      return {
        success: false,
        message: 'Invalid callback data'
      };
    }
    
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callbackBody;
    
    // Log callback received
    info(transactionId, 'mpesa_callback_received', {
      checkoutRequestId: CheckoutRequestID,
      resultCode: ResultCode,
      resultDesc: ResultDesc
    });
    
    // Get transaction
    const transaction = getTransaction(transactionId);
    
    if (!transaction) {
      error(transactionId, 'mpesa_callback_error', {
        reason: 'Transaction not found',
        checkoutRequestId: CheckoutRequestID
      });
      
      return {
        success: false,
        message: 'Transaction not found'
      };
    }
    
    // Check if the checkout request ID matches
    if (transaction.checkoutRequestId !== CheckoutRequestID) {
      error(transactionId, 'mpesa_callback_mismatch', {
        expectedId: transaction.checkoutRequestId,
        receivedId: CheckoutRequestID
      });
      
      return {
        success: false,
        message: 'Checkout request ID mismatch'
      };
    }
    
    // Process based on result code
    if (ResultCode === 0) {
      // Extract metadata items
      const metadataItems = {};
      
      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach(item => {
          metadataItems[item.Name] = item.Value;
        });
      }
      
      // Reconcile transaction
      const result = reconcileTransaction(transactionId, {
        ResultCode,
        ResultDesc,
        mpesaReceiptNumber: metadataItems.MpesaReceiptNumber,
        transactionDate: metadataItems.TransactionDate,
        phoneNumber: metadataItems.PhoneNumber,
        amount: metadataItems.Amount
      });
      
      return {
        success: true,
        message: 'Payment completed successfully',
        transaction: result.transaction
      };
    } else {
      // Payment failed
      updateTransactionStatus(transactionId, TRANSACTION_STATUS.FAILED, {
        failureReason: ResultDesc,
        callbackData
      });
      
      error(transactionId, 'mpesa_payment_failed', {
        resultCode: ResultCode,
        resultDesc: ResultDesc
      });
      
      return {
        success: false,
        message: `Payment failed: ${ResultDesc}`,
        resultCode: ResultCode
      };
    }
  } catch (err) {
    // Log error
    error(transactionId, 'mpesa_callback_processing_error', {
      message: err.message,
      stack: err.stack
    });
    
    return {
      success: false,
      message: `Error processing callback: ${err.message}`
    };
  }
}

/**
 * Process M-Pesa C2B validation request
 * @param {Object} validationData - Validation data
 * @returns {Object} Validation result
 */
function processValidation(validationData) {
  // Log validation request
  info('system', 'mpesa_validation_request', { data: validationData });
  
  // For simplicity, always validate positively in this MVP
  return {
    ResultCode: 0,
    ResultDesc: 'Accepted'
  };
}

/**
 * Process M-Pesa C2B confirmation
 * @param {Object} confirmationData - Confirmation data
 * @returns {Object} Processing result
 */
function processConfirmation(confirmationData) {
  // Log confirmation
  info('system', 'mpesa_confirmation_received', { data: confirmationData });
  
  // Extract reference from BillRefNumber
  const reference = confirmationData.BillRefNumber;
  
  // In a real implementation, we would:
  // 1. Look up transaction by reference
  // 2. Reconcile the payment
  // 3. Update the transaction status
  
  return {
    ResultCode: 0,
    ResultDesc: 'Confirmation received successfully'
  };
}

module.exports = {
  processSTKCallback,
  processValidation,
  processConfirmation
};