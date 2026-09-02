import { expenses, trucks, deals, MOCK_REFERENCE_DATE } from '../../data/mock';
import type { Expense } from '../../types';

export interface ExpenseContext {
  expense: Expense;
  truckName?: string;
  truckRegistration?: string;
  dealName?: string;
}

export const getExpenseContext = (exp: Expense): ExpenseContext => {
  let truckName = undefined;
  let truckRegistration = undefined;
  let dealName = undefined;

  if (exp.truckId) {
    const truck = trucks.find(t => t.id === exp.truckId);
    if (truck) {
      truckName = `${truck.manufacturer} ${truck.model}`;
      truckRegistration = truck.registrationNumber;
    }
  }

  if (exp.dealId) {
    const deal = deals.find(d => d.id === exp.dealId);
    if (deal) {
      dealName = `Deal ${deal.id}`;
    }
  }

  return { expense: exp, truckName, truckRegistration, dealName };
};

export const getExpenseSummary = (currentExpenses: Expense[]) => {
  const total = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const truckExpenses = currentExpenses.filter(e => e.truckId).reduce((sum, e) => sum + e.amount, 0);
  const dealExpenses = currentExpenses.filter(e => e.dealId && !e.truckId).reduce((sum, e) => sum + e.amount, 0);

  // Month filtering - parse MOCK_REFERENCE_DATE
  const refDate = new Date(MOCK_REFERENCE_DATE);
  const currentMonthExpenses = currentExpenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate.getMonth() === refDate.getMonth() && expDate.getFullYear() === refDate.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);

  return {
    total,
    truckExpenses,
    dealExpenses,
    currentMonthExpenses,
    count: currentExpenses.length
  };
};

export const searchExpenses = (currentExpenses: Expense[], query: string, filters: { category: string, truckId: string }) => {
  const mapped = currentExpenses.map(getExpenseContext);

  return mapped.filter(ctx => {
    const searchString = `${ctx.expense.description} ${ctx.expense.category} ${ctx.truckName || ''} ${ctx.truckRegistration || ''}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());

    const matchesCategory = filters.category === 'All' || ctx.expense.category === filters.category;
    const matchesTruck = filters.truckId === 'All' || ctx.expense.truckId === filters.truckId;

    return matchesQuery && matchesCategory && matchesTruck;
  });
};

export const getExpensesByCategory = (currentExpenses: Expense[]) => {
  const breakdown: Record<string, number> = {};
  currentExpenses.forEach(e => {
    breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
  });
  return breakdown;
};

export const getHighestCostTrucks = (currentExpenses: Expense[], limit = 5) => {
  const truckTotals: Record<string, number> = {};
  currentExpenses.forEach(e => {
    if (e.truckId) {
      truckTotals[e.truckId] = (truckTotals[e.truckId] || 0) + e.amount;
    }
  });

  return Object.entries(truckTotals)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, limit)
    .map(([truckId, amount]) => {
      const truck = trucks.find(t => t.id === truckId);
      return {
        truckId,
        amount,
        truckName: truck ? `${truck.manufacturer} ${truck.model}` : 'Unknown Truck',
        truckRegistration: truck?.registrationNumber
      };
    });
};

export const getExpenseById = (id: string) => {
  const exp = expenses.find(e => e.id === id);
  return exp ? getExpenseContext(exp) : null;
};
