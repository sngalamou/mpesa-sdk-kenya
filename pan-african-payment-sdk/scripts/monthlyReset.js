/**
 * Monthly reset cron job
 * Resets transaction volumes and updates merchant tiers
 */

const cron = require('node-cron');
const { resetAllMerchantVolumes } = require('../core/auth/merchant');
const { getConfig } = require('../core/utils/config');
const { info, error } = require('../core/transaction/logger');

/**
 * Update merchant tiers based on volume
 */
function updateMerchantTiers() {
  // In production, this would query the database and update tiers
  // based on each merchant's volume for the previous month
  info('system', 'monthly_tiers_updated', { message: 'Merchant tiers updated based on volume' });
}

/**
 * Reset monthly volumes and update tiers
 */
function performMonthlyReset() {
  try {
    // Log reset start
    info('system', 'monthly_reset_started', { timestamp: new Date().toISOString() });
    
    // Reset all merchant volumes
    resetAllMerchantVolumes();
    
    // Update merchant tiers based on previous month's volume
    updateMerchantTiers();
    
    // Log reset completion
    info('system', 'monthly_reset_completed', { timestamp: new Date().toISOString() });
  } catch (err) {
    // Log error
    error('system', 'monthly_reset_error', {
      message: err.message,
      stack: err.stack
    });
  }
}

/**
 * Schedule the monthly reset cron job
 */
function scheduleMonthlyReset() {
  const cronExpression = getConfig('MONTHLY_RESET_CRON', '0 0 1 * *');
  
  // Schedule the cron job
  cron.schedule(cronExpression, performMonthlyReset, {
    scheduled: true,
    timezone: 'Africa/Nairobi'
  });
  
  // Log cron job scheduled
  info('system', 'monthly_reset_scheduled', { 
    cronExpression,
    nextRun: getNextRunDate(cronExpression)
  });
}

/**
 * Get the next run date for a cron expression
 * @param {string} cronExpression - Cron expression
 * @returns {Date} Next run date
 */
function getNextRunDate(cronExpression) {
  const schedule = cron.schedule(cronExpression, () => {});
  const nextRun = schedule.nextDate();
  schedule.stop();
  return nextRun;
}

// Export the functions
module.exports = {
  performMonthlyReset,
  scheduleMonthlyReset
};

// If this script is run directly, execute the reset
if (require.main === module) {
  performMonthlyReset();
}