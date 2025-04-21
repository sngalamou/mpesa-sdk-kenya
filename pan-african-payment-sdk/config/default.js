/**
 * Default configuration schema and values
 */

module.exports = {
    // Server configuration
    server: {
      port: process.env.PORT || 3000,
      host: process.env.HOST || 'localhost',
      env: process.env.NODE_ENV || 'development'
    },
    
    // Application URLs
    urls: {
      app: process.env.APP_URL || 'http://localhost:3000',
      callback: process.env.CALLBACK_URL || 'http://localhost:3000/webhook'
    },
    
    // M-Pesa configuration
    mpesa: {
      baseUrl: process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke',
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      passkey: process.env.MPESA_PASSKEY || '',
      initiatorName: process.env.MPESA_INITIATOR_NAME || 'testapi'
    },
    
    // Business rules
    business: {
      freeTierLimit: process.env.FREE_TIER_LIMIT || 100,
      fraudAlertThreshold: process.env.FRAUD_ALERT_THRESHOLD || 50000,
      monthlyResetCron: process.env.MONTHLY_RESET_CRON || '0 0 1 * *'
    },
    
    // Subscription fees
    subscriptions: {
      starter: process.env.STARTER_SUB_FEE || 800,
      growing: process.env.GROWING_SUB_FEE || 600,
      business: process.env.BUSINESS_SUB_FEE || 400,
      enterprise: 0
    },
    
    // Premium add-on prices
    premiumAddons: {
      analytics: process.env.ANALYTICS_PACKAGE_PRICE || 500,
      fraudAlerts: process.env.FRAUD_ALERTS_PACKAGE_PRICE || 600,
      reconciliation: process.env.RECONCILIATION_PACKAGE_PRICE || 800,
      inventory: process.env.INVENTORY_INTEGRATION_PRICE || 1200,
      multiCurrency: process.env.MULTICURRENCY_PACKAGE_PRICE || 1000
    },
    
    // Security
    security: {
      apiSecret: process.env.API_SECRET || 'development-secret-key',
      jwtSecret: process.env.JWT_SECRET || 'development-jwt-secret',
      jwtExpiry: process.env.JWT_EXPIRY || '1d'
    },
    
    // Database (placeholder for production)
    database: {
      url: process.env.DATABASE_URL || '',
      type: process.env.DATABASE_TYPE || 'memory' // 'memory', 'mongodb', 'postgres'
    }
  };