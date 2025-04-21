/**
 * HTTP client wrappers
 */

const axios = require('axios');
const { PaymentError } = require('./errors');

/**
 * Create HTTP client with default configuration
 * @param {Object} options - Axios configuration options
 * @returns {Object} Configured Axios instance
 */
function createHttpClient(options = {}) {
  return axios.create({
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    },
    ...options
  });
}

/**
 * Make HTTP request with error handling
 * @param {Function} requestFn - Axios request function
 * @returns {Promise} Request result
 */
async function makeRequest(requestFn) {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new PaymentError(
        `HTTP Error: ${error.response.status} - ${error.response.statusText}`,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new PaymentError('No response received from server', {
        message: error.message
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new PaymentError('Request configuration error', {
        message: error.message
      });
    }
  }
}

module.exports = {
  createHttpClient,
  makeRequest
};