/**
 * M-Pesa checkout endpoint
 */

const { initiateSTKPush } = require('../../payment-methods/mpesa/stkPush');
const { ValidationError } = require('../../core/utils/errors');

/**
 * Handle M-Pesa checkout request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function handleCheckout(req, res, next) {
  try {
    const { phone, amount, description } = req.body;
    const merchantId = req.merchant.id;
    
    // Validate request
    if (!phone || !amount) {
      throw new ValidationError('Phone number and amount are required');
    }
    
    // Initiate STK Push
    const result = await initiateSTKPush(
      { phone, amount, description },
      merchantId
    );
    
    // Return response
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = handleCheckout;