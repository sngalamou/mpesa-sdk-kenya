/**
 * Express authentication middleware
 */

const { validateApiKey } = require('./apiKey');
const { getMerchant } = require('./merchant');
const { CustomError } = require('../utils/errors');

/**
 * Middleware to authenticate API requests using API key
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function apiKeyAuth(req, res, next) {
  // Get API key from header or query parameter
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return next(new CustomError('API key is required', 401));
  }
  
  // Validate API key
  const merchantInfo = validateApiKey(apiKey);
  
  if (!merchantInfo) {
    return next(new CustomError('Invalid API key', 401));
  }
  
  // Attach merchant info to request
  req.merchant = getMerchant(merchantInfo.merchantId);
  
  if (!req.merchant) {
    return next(new CustomError('Merchant not found', 404));
  }
  
  // Check if merchant is active
  if (req.merchant.status !== 'active') {
    return next(new CustomError('Merchant account is not active', 403));
  }
  
  next();
}

/**
 * Middleware to restrict access based on merchant tier
 * @param {string[]} allowedTiers - Array of allowed tiers
 */
function tierRestriction(allowedTiers) {
  return (req, res, next) => {
    if (!req.merchant) {
      return next(new CustomError('Authentication required', 401));
    }
    
    if (!allowedTiers.includes(req.merchant.tier)) {
      return next(new CustomError(`This feature is restricted to ${allowedTiers.join(', ')} tier merchants`, 403));
    }
    
    next();
  };
}

module.exports = {
  apiKeyAuth,
  tierRestriction
};