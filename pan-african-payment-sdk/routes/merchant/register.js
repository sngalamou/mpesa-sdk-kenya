/**
 * Merchant registration endpoint
 */

const { registerMerchant } = require('../../core/auth/merchant');
const { generateApiKey } = require('../../core/auth/apiKey');
const { validateMerchantRegistration } = require('../../core/utils/validation');
const { ValidationError } = require('../../core/utils/errors');
const { info, error } = require('../../core/transaction/logger');

/**
 * Handle merchant registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function handleMerchantRegistration(req, res, next) {
  try {
    const merchantData = req.body;
    
    // Validate merchant data
    const validation = validateMerchantRegistration(merchantData);
    
    if (!validation.valid) {
      throw new ValidationError('Invalid merchant data', validation.errors);
    }
    
    // Register merchant
    const merchantId = registerMerchant(merchantData);
    
    // Generate API key
    const apiKey = generateApiKey(merchantId, 'Starter');
    
    // Log successful registration
    info('system', 'merchant_registered', { 
      merchantId,
      businessName: merchantData.businessName
    });
    
    // Return response
    res.status(201).json({
      success: true,
      merchantId,
      apiKey,
      tier: 'Starter'
    });
  } catch (err) {
    // Log error
    error('system', 'merchant_registration_error', {
      message: err.message,
      data: req.body
    });
    
    next(err);
  }
}

module.exports = handleMerchantRegistration;