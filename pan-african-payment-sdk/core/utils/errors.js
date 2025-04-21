/**
 * Custom error classes
 */

/**
 * Base custom error class
 */
class CustomError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Validation error
   */
  class ValidationError extends CustomError {
    constructor(message, errors = []) {
      super(message, 400);
      this.errors = errors;
    }
  }
  
  /**
   * Authentication error
   */
  class AuthError extends CustomError {
    constructor(message) {
      super(message, 401);
    }
  }
  
  /**
   * Not found error
   */
  class NotFoundError extends CustomError {
    constructor(message) {
      super(message, 404);
    }
  }
  
  /**
   * Payment provider error
   */
  class PaymentError extends CustomError {
    constructor(message, providerError = null) {
      super(message, 502);
      this.providerError = providerError;
    }
  }
  
  /**
   * Error handler middleware for Express
   * @param {Error} err - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  function errorHandler(err, req, res, next) {
    console.error(err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    
    // Prepare error response
    const errorResponse = {
      error: true,
      message
    };
    
    // Add validation errors if available
    if (err instanceof ValidationError && err.errors.length > 0) {
      errorResponse.errors = err.errors;
    }
    
    // Add provider error if available
    if (err instanceof PaymentError && err.providerError) {
      errorResponse.providerError = err.providerError;
    }
    
    // Send error response
    res.status(statusCode).json(errorResponse);
  }
  
  module.exports = {
    CustomError,
    ValidationError,
    AuthError,
    NotFoundError,
    PaymentError,
    errorHandler
  };