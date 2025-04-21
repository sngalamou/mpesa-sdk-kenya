/**
 * Card payment processor
 */

const { tokenizeCard, chargeCard } = require('./client');
const { createTransaction, updateTransactionStatus, TRANSACTION_STATUS } = require('../../core/transaction/store');
const { generateTransactionId, generateCustomerReference } = require('../../core/transaction/generator');
const { ValidationError } = require('../../core/utils/errors');
const { info, error } = require('../../core/transaction/logger');
const { reconcileTransaction } = require('../../core/transaction/reconciliation');

/**
 * Process card payment
 * @param {Object} paymentData - Payment data including card details
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<Object>} Processing result
 */
async function processCardPayment(paymentData, merchantId) {
  try {
    const { 
      cardNumber, 
      cardholderName, 
      expiryMonth, 
      expiryYear, 
      cvv, 
      amount, 
      currency = 'KES',
      description = 'Card Payment'
    } = paymentData;
    
    // Validate inputs
    if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv || !amount) {
      throw new ValidationError('Missing required payment information');
    }
    
    // Generate transaction ID and reference
    const transactionId = generateTransactionId();
    const customerReference = generateCustomerReference(merchantId, transactionId);
    
    // Create transaction record
    const transaction = createTransaction({
      transactionId,
      merchantId,
      amount,
      currency,
      customerName: cardholderName,
      customerReference,
      paymentMethod: 'card'
    });
    
    // Log transaction initiation
    info(transactionId, 'card_payment_initiated', {
      amount,
      currency,
      cardLast4: cardNumber.slice(-4)
    });
    
    // Tokenize card
    const cardData = {
      number: cardNumber,
      name: cardholderName,
      expiryMonth,
      expiryYear,
      cvv,
      // Determine card brand from number
      brand: determineCardBrand(cardNumber)
    };
    
    const tokenResult = await tokenizeCard(cardData, transactionId);
    
    // Charge the tokenized card
    const chargeResult = await chargeCard(
      tokenResult.id,
      amount,
      currency,
      description,
      transactionId
    );
    
    // Check if charge was successful
    if (chargeResult.status === 'succeeded') {
      // Reconcile transaction
      const reconcileResult = reconcileTransaction(transactionId, {
        ResultCode: 0,
        ResultDesc: 'Success',
        reference: chargeResult.id
      });
      
      return {
        success: true,
        message: 'Payment processed successfully',
        transactionId,
        reference: customerReference,
        chargeId: chargeResult.id
      };
    } else {
      // Update transaction status
      updateTransactionStatus(transactionId, TRANSACTION_STATUS.FAILED, {
        failureReason: chargeResult.failure_message || 'Payment failed',
        chargeResult
      });
      
      // Log failure
      error(transactionId, 'card_payment_failed', {
        status: chargeResult.status,
        failureMessage: chargeResult.failure_message
      });
      
      return {
        success: false,
        message: chargeResult.failure_message || 'Payment failed',
        transactionId
      };
    }
  } catch (err) {
    // Log error
    error('system', 'card_payment_error', {
      message: err.message,
      stack: err.stack
    });
    
    throw err;
  }
}

/**
 * Determine card brand from card number
 * @param {string} cardNumber - Card number
 * @returns {string} Card brand
 */
function determineCardBrand(cardNumber) {
  // Remove spaces and dashes
  const number = cardNumber.replace(/[\s-]/g, '');
  
  // Basic card brand detection
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6(?:011|5)/.test(number)) return 'Discover';
  
  return 'Unknown';
}

module.exports = {
  processCardPayment
};