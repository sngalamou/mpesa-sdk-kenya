/**
 * Card payment gateway client
 */

const { createHttpClient, makeRequest } = require('../../core/utils/http');
const { getConfig } = require('../../core/utils/config');
const { info, error } = require('../../core/transaction/logger');

// For MVP, we'll simulate a generic card payment gateway

/**
 * Get card payment gateway configuration
 * @returns {Object} Gateway configuration
 */
function getCardGatewayConfig() {
  return {
    baseUrl: getConfig('CARD_GATEWAY_URL', 'https://api.example-gateway.com'),
    apiKey: getConfig('CARD_GATEWAY_API_KEY', 'test_key'),
    currency: getConfig('DEFAULT_CURRENCY', 'KES'),
    endpoints: {
      tokenize: '/v1/tokens',
      charge: '/v1/charges',
      refund: '/v1/refunds'
    }
  };
}

/**
 * Create card gateway client
 * @returns {Object} HTTP client for card gateway
 */
function createCardGatewayClient() {
  const config = getCardGatewayConfig();
  
  return createHttpClient({
    baseURL: config.baseUrl,
    headers: {
      'Authorization': `Bearer ${config.apiKey}`
    }
  });
}

/**
 * Tokenize card details
 * @param {Object} cardData - Card data to tokenize
 * @param {string} transactionId - Transaction ID for logging
 * @returns {Promise<Object>} Tokenization response
 */
async function tokenizeCard(cardData, transactionId) {
  try {
    const client = createCardGatewayClient();
    
    // Log tokenization attempt (without sensitive data)
    info(transactionId, 'card_tokenize_request', {
      cardLast4: cardData.number.slice(-4),
      cardBrand: cardData.brand
    });
    
    // In a real implementation, we would send the card data to the gateway
    // For MVP, we'll simulate the response
    
    // Simulate API call
    /*
    const response = await makeRequest(() => 
      client.post(getCardGatewayConfig().endpoints.tokenize, cardData)
    );
    */
    
    // Simulated response
    const response = {
      id: `tok_${Date.now()}${Math.floor(Math.random() * 1000)}`,
      object: 'token',
      card: {
        last4: cardData.number.slice(-4),
        brand: cardData.brand,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear
      },
      created: Date.now()
    };
    
    // Log successful tokenization
    info(transactionId, 'card_tokenize_success', {
      tokenId: response.id,
      cardLast4: response.card.last4
    });
    
    return response;
  } catch (err) {
    // Log error
    error(transactionId, 'card_tokenize_error', {
      message: err.message
    });
    
    throw err;
  }
}

/**
 * Charge a tokenized card
 * @param {string} token - Card token
 * @param {number} amount - Amount to charge
 * @param {string} currency - Currency code
 * @param {string} description - Charge description
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Charge response
 */
async function chargeCard(token, amount, currency, description, transactionId) {
  try {
    const client = createCardGatewayClient();
    const config = getCardGatewayConfig();
    
    // Log charge attempt
    info(transactionId, 'card_charge_request', {
      token,
      amount,
      currency
    });
    
    // Prepare charge data
    const chargeData = {
      token,
      amount,
      currency: currency || config.currency,
      description,
      metadata: {
        transactionId
      }
    };
    
    // In a real implementation, we would send the charge request to the gateway
    // For MVP, we'll simulate the response
    
    // Simulate API call
    /*
    const response = await makeRequest(() => 
      client.post(config.endpoints.charge, chargeData)
    );
    */
    
    // Simulated response
    const response = {
      id: `ch_${Date.now()}${Math.floor(Math.random() * 1000)}`,
      object: 'charge',
      amount,
      currency: currency || config.currency,
      status: 'succeeded',
      paid: true,
      card: {
        last4: '4242',
        brand: 'Visa'
      },
      created: Date.now()
    };
    
    // Log successful charge
    info(transactionId, 'card_charge_success', {
      chargeId: response.id,
      amount,
      status: response.status
    });
    
    return response;
  } catch (err) {
    // Log error
    error(transactionId, 'card_charge_error', {
      message: err.message,
      token
    });
    
    throw err;
  }
}

module.exports = {
  getCardGatewayConfig,
  createCardGatewayClient,
  tokenizeCard,
  chargeCard
};