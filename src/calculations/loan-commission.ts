import type { Currency, Percentage } from '../types';

/**
 * Calculates the expected finance commission based on the loan amount.
 */
export const calculateLoanCommission = (
  loanAmount: Currency,
  commissionRate: Percentage
): Currency => {
  return (loanAmount * commissionRate) / 100;
};
