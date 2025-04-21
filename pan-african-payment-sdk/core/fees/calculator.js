/**
 * Fee calculator for transactions
 */

const { TRANSACTION_BRACKETS } = require('./brackets');

/**
 * Calculate fees for a given transaction amount
 * @param {number} amount - Transaction amount in KES
 * @returns {Object} Fee breakdown
 */
function calculateFees(amount) {
  // Find the applicable bracket
  const bracket = TRANSACTION_BRACKETS.find(
    b => amount >= b.min && amount <= b.max
  );

  if (!bracket) {
    throw new Error(`No fee bracket found for amount: ${amount}`);
  }

  const { safaricomFee, markupType, markupValue, markupCap } = bracket;
  
  // Calculate our markup
  let markup = 0;
  if (markupType === 'flat') {
    markup = markupValue;
  } else if (markupType === 'percent') {
    markup = Math.min((amount * markupValue) / 100, markupCap);
  }

  const totalFee = safaricomFee + markup;

  return {
    amount,
    safaricomFee,
    markup,
    totalFee,
    netAmount: amount - totalFee
  };
}

/**
 * Get the subscription tier for a merchant based on monthly volume
 * @param {number} monthlyVolume - Monthly transaction volume in KES
 * @returns {Object} Subscription tier details
 */
function getSubscriptionTier(monthlyVolume) {
  const { SUBSCRIPTION_TIERS } = require('./brackets');
  
  return SUBSCRIPTION_TIERS.find(
    tier => monthlyVolume >= tier.minVolume && monthlyVolume <= tier.maxVolume
  );
}

module.exports = {
  calculateFees,
  getSubscriptionTier
};