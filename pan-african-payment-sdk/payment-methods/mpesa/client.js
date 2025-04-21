/**
 * M-Pesa Daraja API client
 */

const { createHttpClient, makeRequest } = require('../../core/utils/http');
const { getMpesaConfig } = require('./config');
const { info, error } = require('../../core/transaction/logger');

// In-memory token cache
let tokenCache = {
  accessToken: null,
  expiresAt: null
};

/**
 * Get OAuth token from M-Pesa
 * @returns {Promise<string>} Access token
 */
async function getOAuthToken() {
  // Check if we have a valid token in cache
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt && now < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  
  const config = getMpesaConfig();
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  
  const client = createHttpClient({
    baseURL: config.baseUrl,
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });
  
  try {
    const response = await makeRequest(() => client.get(config.endpoints.oauth));
    
    // Cache the token (expires in 1 hour)
    tokenCache = {
      accessToken: response.access_token,
      expiresAt: now + (response.expires_in * 1000) - 120000 // 2 minutes buffer
    };
    
    return tokenCache.accessToken;
  } catch (err) {
    error('system', 'mpesa_oauth_error', { message: err.message });
    throw err;
  }
}

/**
 * Create authenticated M-Pesa API client
 * @returns {Promise<Object>} Authenticated Axios client
 */
async function createMpesaClient() {
  const token = await getOAuthToken();
  const config = getMpesaConfig();
  
  return createHttpClient({
    baseURL: config.baseUrl,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * Register URLs for C2B callbacks
 * @param {string} validationUrl - Validation URL
 * @param {string} confirmationUrl - Confirmation URL
 * @returns {Promise<Object>} Registration response
 */
async function registerCallbackUrls(validationUrl, confirmationUrl) {
  const client = await createMpesaClient();
  const config = getMpesaConfig();
  
  const data = {
    ShortCode: config.shortcode,
    ResponseType: 'Completed', // or 'Cancelled'
    ConfirmationURL: confirmationUrl,
    ValidationURL: validationUrl
  };
  
  info('system', 'mpesa_register_urls', { urls: { validationUrl, confirmationUrl } });
  
  return makeRequest(() => client.post(config.endpoints.registerCallback, data));
}

/**
 * Simulate a C2B payment (only works in sandbox)
 * @param {string} phone - Customer phone number
 * @param {number} amount - Transaction amount
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} Simulation response
 */
async function simulateC2B(phone, amount, reference) {
  const client = await createMpesaClient();
  const config = getMpesaConfig();
  
  const data = {
    ShortCode: config.shortcode,
    CommandID: 'CustomerPayBillOnline',
    Amount: amount,
    Msisdn: phone,
    BillRefNumber: reference
  };
  
  info('system', 'mpesa_simulate_c2b', { phone, amount, reference });
  
  return makeRequest(() => client.post(config.endpoints.simulate, data));
}

module.exports = {
  getOAuthToken,
  createMpesaClient,
  registerCallbackUrls,
  simulateC2B
};