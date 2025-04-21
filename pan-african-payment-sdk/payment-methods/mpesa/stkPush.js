/**
 * M-Pesa STK Push implementation
 */

const { createMpesaClient } = require('./client');
const { getMpesaConfig } = require('./config');
const { generateTransactionId, generateCallbackUrl, generateCustomerReference } = require('../../core/transaction/generator');
const { createTransaction } = require('../../core/transaction/store');
const { formatPhone, validateCheckoutRequest } = require('../../core/utils/validation');
const { ValidationError, PaymentError } = require('../../core/utils/errors');
const { makeRequest } = require('../../core/utils/http');
const { info, error } = require('../../core/transaction/logger');

/**
 * Initiate STK Push payment
 * @param {Object} paymentData - Payment data
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<Object>} STK Push response
 */
async function initiateSTKPush(paymentData, merchantId) {
  // Validate payment data
  const validation = validateCheckoutRequest(paymentData);
  if (!validation.valid) {
    throw new ValidationError('Invalid payment data', validation.errors);
  }
  
  const { phone, amount, customerName = '', description = 'Payment' } = paymentData;
  
  // Format phone number to required format (254XXXXXXXXX)
  const formattedPhone = formatPhone(phone);
  
  // Generate transaction ID and reference
  const transactionId = generateTransactionId();
  const customerReference = generateCustomerReference(merchantId, transactionId);
  
  // Create transaction record
  const transaction = createTransaction({
    transactionId,
    merchantId,
    amount,
    phone: formattedPhone,
    customerName,
    customerReference,
    paymentMethod: 'mpesa_stk'
  });
  
  try {
    // Get config and prepare STK request
    const config = getMpesaConfig();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');
    
    const callbackUrl = generateCallbackUrl(config.callbackUrl, merchantId, transactionId);
    
    // Create request payload
    const stkRequestPayload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: config.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: customerReference,
      TransactionDesc: description.substring(0, 20) // Max 20 chars
    };
    
    // Log STK request
    info(transactionId, 'mpesa_stk_request', { 
      phone: formattedPhone, 
      amount, 
      reference: customerReference 
    });
    
    // Send STK Push request
    const client = await createMpesaClient();
    const response = await makeRequest(() => 
      client.post(config.endpoints.stkPush, stkRequestPayload)
    );
    
    // Check for success response
    if (response.ResponseCode === '0') {
      // Update transaction with CheckoutRequestID
      transaction.checkoutRequestId = response.CheckoutRequestID;
      
      // Log success
      info(transactionId, 'mpesa_stk_initiated', { 
        checkoutRequestId: response.CheckoutRequestID 
      });
      
      return {
        success: true,
        message: 'STK Push initiated successfully',
        transactionId,
        reference: customerReference,
        checkoutRequestId: response.CheckoutRequestID
      };
    } else {
      // Log error
      error(transactionId, 'mpesa_stk_failed', { 
        response 
      });
      
      throw new PaymentError(`STK Push failed: ${response.ResponseDescription}`, response);
    }
  } catch (err) {
    // Log error
    error(transactionId, 'mpesa_stk_error', { 
      message: err.message,
      stack: err.stack 
    });
    
    throw err;
  }
}

/**
 * Query STK Push status
 * @param {string} checkoutRequestId - Checkout request ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Query response
 */
async function querySTKStatus(checkoutRequestId, transactionId) {
  try {
    const config = getMpesaConfig();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');
    
    const queryPayload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };
    
    // Log query request
    info(transactionId, 'mpesa_stk_query', { checkoutRequestId });
    
    // Send query request
    const client = await createMpesaClient();
    const response = await makeRequest(() => 
      client.post(config.endpoints.stkQuery, queryPayload)
    );
    
    // Log response
    info(transactionId, 'mpesa_stk_query_response', { response });
    
    return response;
  } catch (err) {
    // Log error
    error(transactionId, 'mpesa_stk_query_error', { 
      checkoutRequestId,
      message: err.message 
    });
    
    throw err;
  }
}

module.exports = {
  initiateSTKPush,
  querySTKStatus
};