/**
 * Input validation schemas
 */

// Using simple validation functions for MVP
// In production, use Joi or Zod for more robust validation

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is phone number valid
 */
function isValidPhone(phone) {
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Basic validation for East African phone numbers
    // Kenya: +254XXXXXXXXX or 07XXXXXXXX
    // Tanzania: +255XXXXXXXXX
    // Uganda: +256XXXXXXXXX
    
    // Check for international format
    if (/^\+\d{12}$/.test(cleanPhone)) {
      return true;
    }
    
    // Check for Kenyan format
    if (/^0\d{9}$/.test(cleanPhone)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Format phone number to international format
   * @param {string} phone - Phone number to format
   * @returns {string} Formatted phone number
   */
  function formatPhone(phone) {
    // Remove non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Handle Kenyan numbers that start with 0
    if (digits.startsWith('0') && digits.length === 10) {
      return `254${digits.substring(1)}`;
    }
    
    // Remove leading + if present
    if (digits.startsWith('254') || digits.startsWith('255') || digits.startsWith('256')) {
      return digits;
    }
    
    // Default to Kenyan format if unknown
    return `254${digits}`;
  }
  
  /**
   * Validate amount
   * @param {number|string} amount - Amount to validate
   * @returns {boolean} Is amount valid
   */
  function isValidAmount(amount) {
    const numAmount = Number(amount);
    return !isNaN(numAmount) && numAmount > 0;
  }
  
  /**
   * Validate API key format
   * @param {string} apiKey - API key to validate
   * @returns {boolean} Is API key format valid
   */
  function isValidApiKeyFormat(apiKey) {
    return typeof apiKey === 'string' && apiKey.startsWith('mpesa_') && apiKey.length >= 20;
  }
  
  /**
   * Validate checkout request
   * @param {Object} data - Checkout request data
   * @returns {Object} Validation result
   */
  function validateCheckoutRequest(data) {
    const errors = [];
    
    if (!data.phone || !isValidPhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Valid phone number is required' });
    }
    
    if (!data.amount || !isValidAmount(data.amount)) {
      errors.push({ field: 'amount', message: 'Valid amount is required' });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate merchant registration
   * @param {Object} data - Merchant registration data
   * @returns {Object} Validation result
   */
  function validateMerchantRegistration(data) {
    const errors = [];
    
    if (!data.businessName || data.businessName.trim().length < 3) {
      errors.push({ field: 'businessName', message: 'Business name is required' });
    }
    
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Valid email is required' });
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Valid phone number is required' });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  module.exports = {
    isValidPhone,
    formatPhone,
    isValidAmount,
    isValidApiKeyFormat,
    validateCheckoutRequest,
    validateMerchantRegistration
  };