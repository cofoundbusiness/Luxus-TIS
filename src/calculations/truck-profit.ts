import type { Truck, Expense, Currency } from '../types';

/**
 * Calculates the gross profit for a truck before considering a specific deal.
 * Gross Truck Profit = Selling Price - Purchase Price - Truck Expenses
 */
export const calculateTruckProfit = (
  truck: Truck,
  expenses: Expense[]
): Currency => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  return truck.sellingPrice - truck.purchasePrice - totalExpenses;
};
