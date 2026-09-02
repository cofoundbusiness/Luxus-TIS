import type { Currency, Percentage } from '../types';

/**
 * Calculates the broker commission based on the agreed basis and rate.
 * The business rule can be configured here later (e.g., flat fee, percentage of profit, percentage of sale price).
 */
export const calculateBrokerCommission = (
  basisAmount: Currency,
  ratePercentage: Percentage
): Currency => {
  return (basisAmount * ratePercentage) / 100;
};
