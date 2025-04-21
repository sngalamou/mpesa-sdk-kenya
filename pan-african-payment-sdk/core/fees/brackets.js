/**
 * Transaction bracket definitions for fee calculation
 * Based on Safaricom's M-Pesa tariff brackets plus our markup
 */

const TRANSACTION_BRACKETS = [
    {
      min: 1,
      max: 100,
      safaricomFee: 0,
      markupType: 'flat',
      markupValue: 10
    },
    {
      min: 101,
      max: 500,
      safaricomFee: 7,
      markupType: 'percent',
      markupValue: 1.5,
      markupCap: 5
    },
    {
      min: 501,
      max: 1000,
      safaricomFee: 13,
      markupType: 'percent',
      markupValue: 1.5,
      markupCap: 10
    },
    {
      min: 1001,
      max: 2500,
      safaricomFee: 33,
      markupType: 'percent',
      markupValue: 1.25,
      markupCap: 20
    },
    {
      min: 2501,
      max: 5000,
      safaricomFee: 57,
      markupType: 'percent',
      markupValue: 1.0,
      markupCap: 30
    },
    {
      min: 5001,
      max: 15000,
      safaricomFee: 100,
      markupType: 'percent',
      markupValue: 0.75,
      markupCap: 50
    },
    {
      min: 15001,
      max: 50000,
      safaricomFee: 108,
      markupType: 'percent',
      markupValue: 0.5,
      markupCap: 75
    },
    {
      min: 50001,
      max: Infinity,
      safaricomFee: 108,
      markupType: 'percent',
      markupValue: 0.25,
      markupCap: 100
    }
  ];
  
  // Subscription tiers
  const SUBSCRIPTION_TIERS = [
    {
      name: 'Starter',
      minVolume: 0,
      maxVolume: 500000,
      fee: 800
    },
    {
      name: 'Growing',
      minVolume: 500001,
      maxVolume: 1000000,
      fee: 600
    },
    {
      name: 'Business',
      minVolume: 1000001,
      maxVolume: 5000000,
      fee: 400
    },
    {
      name: 'Enterprise',
      minVolume: 5000001,
      maxVolume: Infinity,
      fee: 0
    }
  ];
  
  module.exports = {
    TRANSACTION_BRACKETS,
    SUBSCRIPTION_TIERS
  };