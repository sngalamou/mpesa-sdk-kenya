/**
 * M-Pesa webhook handler
 */

const { processSTKCallback } = require('../../payment-methods/mpesa/webhookHandler');
const { info, error } = require('../../core/transaction/logger');

/**
 * Handle M-Pesa webhook callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function handleWebhook(req, res, next) {
  try {
    // Get transaction ID from query
    const { txnId } = req.query;
    
    if (!txnId) {
      error('system', 'webhook_missing_txnid', { query: req.query });
      return res.status(400).json({
        success: false,
        message: 'Missing transaction ID'
      });
    }
    
    // Log webhook received
    info(txnId, 'webhook_received', { body: req.body });
    
    // Process callback
    const result = processSTKCallback(req.body, txnId);
    
    // Always respond with success to M-Pesa (even on errors)
    // This prevents M-Pesa from retrying the callback
    res.json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully'
    });
  } catch (err) {
    // Log error but still respond with success to prevent retries
    error('system', 'webhook_error', {
      message: err.message,
      stack: err.stack
    });
    
    res.json({
      ResultCode: 0,
      ResultDesc: 'Callback received'
    });
  }
}

module.exports = handleWebhook;