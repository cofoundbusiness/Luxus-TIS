import type { Deal, Truck, Expense, Commission, Currency } from '../types';

/**
 * Calculates the net contribution of a deal.
 * Net Deal Contribution = Selling Price - Purchase Price - Deal/Truck Expenses - Broker Commission + Finance Commission
 */
export const calculateDealProfit = (
  deal: Deal,
  truck: Truck,
  expenses: Expense[],
  brokerCommissions: Commission[],
  financeCommissions: Commission[]
): Currency => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBrokerCommissions = brokerCommissions.reduce((sum, comm) => sum + comm.amount, 0);
  const totalFinanceCommissions = financeCommissions.reduce((sum, comm) => sum + comm.amount, 0);

  return (
    deal.salePrice -
    truck.purchasePrice -
    totalExpenses -
    totalBrokerCommissions +
    totalFinanceCommissions
  );
};
