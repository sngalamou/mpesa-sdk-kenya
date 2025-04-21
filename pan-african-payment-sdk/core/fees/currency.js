/**
 * Currency conversion utilities
 */

// Exchange rates against KES (Kenyan Shilling)
const exchangeRates = {
    KES: 1.0,
    USD: 0.0063, // Example rate: 1 KES = 0.0063 USD
    EUR: 0.0058, // Example rate: 1 KES = 0.0058 EUR
    GBP: 0.0051, // Example rate: 1 KES = 0.0051 GBP
    TZS: 15.63,  // Example rate: 1 KES = 15.63 TZS
    UGX: 23.41,  // Example rate: 1 KES = 23.41 UGX
    RWF: 7.35    // Example rate: 1 KES = 7.35 RWF
  };
  
  /**
   * Convert amount from one currency to another
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {number} Converted amount
   */
  function convert(amount, fromCurrency, toCurrency) {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      throw new Error(`Unsupported currency: ${!exchangeRates[fromCurrency] ? fromCurrency : toCurrency}`);
    }
  
    // Convert to KES first (base currency)
    const amountInKes = amount / exchangeRates[fromCurrency];
    
    // Then convert from KES to target currency
    return amountInKes * exchangeRates[toCurrency];
  }
  
  /**
   * Format amount with currency symbol
   * @param {number} amount - Amount to format
   * @param {string} currencyCode - Currency code
   * @returns {string} Formatted amount with currency symbol
   */
  function format(amount, currencyCode = 'KES') {
    const symbols = {
      KES: 'KSh',
      USD: '$',
      EUR: '€',
      GBP: '£',
      TZS: 'TSh',
      UGX: 'USh',
      RWF: 'RF'
    };
  
    return `${symbols[currencyCode] || currencyCode} ${amount.toFixed(2)}`;
  }
  
  module.exports = {
    convert,
    format,
    exchangeRates
  };