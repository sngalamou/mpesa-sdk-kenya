/**
 * Merchant authentication and tier management
 */

// Simple in-memory merchant store (replace with database in production)
const merchants = new Map();

/**
 * Register a new merchant
 * @param {Object} merchantData - Merchant registration data
 * @returns {string} Merchant ID
 */
function registerMerchant(merchantData) {
  const {
    businessName,
    email,
    phone,
    contactName,
    address,
    businessType,
    kra_pin,
    initialTier = 'Starter'
  } = merchantData;

  // Validate required fields
  if (!businessName || !email || !phone) {
    throw new Error('Missing required merchant information');
  }

  // Generate merchant ID
  const merchantId = `M${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Create merchant record
  const merchant = {
    id: merchantId,
    businessName,
    email,
    phone,
    contactName,
    address,
    businessType,
    kra_pin,
    tier: initialTier,
    status: 'active',
    createdAt: new Date(),
    monthlyVolume: 0,
    transactionCount: 0
  };

  // Store merchant (in memory for demo)
  merchants.set(merchantId, merchant);

  return merchantId;
}

/**
 * Get merchant by ID
 * @param {string} merchantId - Merchant ID
 * @returns {Object|null} Merchant data if found
 */
function getMerchant(merchantId) {
  return merchants.get(merchantId) || null;
}

/**
 * Update merchant tier
 * @param {string} merchantId - Merchant ID
 * @param {string} newTier - New subscription tier
 * @returns {boolean} Success indicator
 */
function updateMerchantTier(merchantId, newTier) {
  const merchant = merchants.get(merchantId);
  
  if (!merchant) return false;
  
  merchant.tier = newTier;
  merchants.set(merchantId, merchant);
  
  return true;
}

/**
 * Update merchant monthly volume
 * @param {string} merchantId - Merchant ID
 * @param {number} amount - Amount to add to monthly volume
 * @returns {boolean} Success indicator
 */
function updateMerchantVolume(merchantId, amount) {
  const merchant = merchants.get(merchantId);
  
  if (!merchant) return false;
  
  merchant.monthlyVolume += amount;
  merchant.transactionCount += 1;
  merchants.set(merchantId, merchant);
  
  return true;
}

/**
 * Reset monthly volume for all merchants
 * (Called by monthly cron job)
 */
function resetAllMerchantVolumes() {
  for (const [merchantId, merchant] of merchants.entries()) {
    merchant.monthlyVolume = 0;
    merchant.transactionCount = 0;
    merchants.set(merchantId, merchant);
  }
}

module.exports = {
  registerMerchant,
  getMerchant,
  updateMerchantTier,
  updateMerchantVolume,
  resetAllMerchantVolumes
};