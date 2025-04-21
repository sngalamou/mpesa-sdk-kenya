/**
 * M-Pesa specific settings
 */

const { getConfig } = require('../../core/utils/config');

/**
 * Get M-Pesa configuration
 * @returns {Object} M-Pesa configuration
 */
function getMpesaConfig() {
  return {
    baseUrl: getConfig('MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke'),
    consumerKey: getConfig('MPESA_CONSUMER_KEY', ''),
    consumerSecret: getConfig('MPESA_CONSUMER_SECRET', ''),
    shortcode: getConfig('MPESA_SHORTCODE', ''),
    passkey: getConfig('MPESA_PASSKEY', ''),
    callbackUrl: getConfig('CALLBACK_URL', 'http://localhost:3000/webhook'),
    
    // API endpoints
    endpoints: {
      oauth: '/oauth/v1/generate?grant_type=client_credentials',
      stkPush: '/mpesa/stkpush/v1/processrequest',
      stkQuery: '/mpesa/stkpushquery/v1/query',
      registerCallback: '/mpesa/c2b/v1/registerurl',
      simulate: '/mpesa/c2b/v1/simulate'
    }
  };
}

module.exports = {
  getMpesaConfig
};