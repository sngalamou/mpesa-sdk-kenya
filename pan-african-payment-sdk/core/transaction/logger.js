/**
 * Transaction logger for structured logging
 */

// Simple in-memory logging (replace with proper logging system in production)
const logs = [];

// Log levels
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Log a transaction event
 * @param {string} level - Log level
 * @param {string} transactionId - Transaction ID
 * @param {string} event - Event name
 * @param {Object} data - Additional event data
 */
function logTransaction(level, transactionId, event, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    transactionId,
    event,
    data
  };
  
  // Store log entry
  logs.push(logEntry);
  
  // Console output for development
  console.log(JSON.stringify(logEntry));
  
  return logEntry;
}

// Convenience methods for different log levels
function debug(transactionId, event, data) {
  return logTransaction(LOG_LEVELS.DEBUG, transactionId, event, data);
}

function info(transactionId, event, data) {
  return logTransaction(LOG_LEVELS.INFO, transactionId, event, data);
}

function warn(transactionId, event, data) {
  return logTransaction(LOG_LEVELS.WARN, transactionId, event, data);
}

function error(transactionId, event, data) {
  return logTransaction(LOG_LEVELS.ERROR, transactionId, event, data);
}

/**
 * Get logs for a specific transaction
 * @param {string} transactionId - Transaction ID
 * @returns {Array} Log entries for the transaction
 */
function getTransactionLogs(transactionId) {
  return logs.filter(log => log.transactionId === transactionId);
}

module.exports = {
  debug,
  info,
  warn,
  error,
  getTransactionLogs,
  LOG_LEVELS
};