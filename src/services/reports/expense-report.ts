import { expenses, trucks, deals } from '../../data/mock';
import { isDateInRange } from '../../utils/date-utils';
import type { DateRange } from '../../utils/date-utils';
import type { Expense, Truck, Deal } from '../../types';

export interface ExpenseReport {
  totalExpenses: number;
  totalExpenseValue: number;
  averageExpense: number;
  highestExpense: number;
  
  byCategory: Record<string, number>;
  
  truckExpensesDetails: Array<{
    truck: Truck;
    totalAmount: number;
    expenseCount: number;
  }>;

  dealExpensesDetails: Array<{
    deal: Deal;
    totalAmount: number;
    expenseCount: number;
  }>;

  expenseDetails: Array<{
    expense: Expense;
    truck: Truck | undefined;
    deal: Deal | undefined;
  }>;
}

export function generateExpenseReport(dateRange: DateRange): ExpenseReport {
  const filteredExpenses = expenses.filter(e => isDateInRange(e.date, dateRange));

  const report: ExpenseReport = {
    totalExpenses: filteredExpenses.length,
    totalExpenseValue: 0,
    averageExpense: 0,
    highestExpense: 0,
    byCategory: {},
    truckExpensesDetails: [],
    dealExpensesDetails: [],
    expenseDetails: []
  };

  const truckSums: Record<string, { amount: number; count: number }> = {};
  const dealSums: Record<string, { amount: number; count: number }> = {};

  filteredExpenses.forEach(exp => {
    report.totalExpenseValue += exp.amount;
    
    if (exp.amount > report.highestExpense) {
      report.highestExpense = exp.amount;
    }

    report.byCategory[exp.category] = (report.byCategory[exp.category] || 0) + exp.amount;

    if (exp.truckId) {
      if (!truckSums[exp.truckId]) truckSums[exp.truckId] = { amount: 0, count: 0 };
      truckSums[exp.truckId].amount += exp.amount;
      truckSums[exp.truckId].count++;
    }

    if (exp.dealId) {
      if (!dealSums[exp.dealId]) dealSums[exp.dealId] = { amount: 0, count: 0 };
      dealSums[exp.dealId].amount += exp.amount;
      dealSums[exp.dealId].count++;
    }

    report.expenseDetails.push({
      expense: exp,
      truck: exp.truckId ? trucks.find(t => t.id === exp.truckId) : undefined,
      deal: exp.dealId ? deals.find(d => d.id === exp.dealId) : undefined
    });
  });

  if (report.totalExpenses > 0) {
    report.averageExpense = report.totalExpenseValue / report.totalExpenses;
  }

  // Build truck aggregate array
  Object.keys(truckSums).forEach(truckId => {
    const t = trucks.find(x => x.id === truckId);
    if (t) {
      report.truckExpensesDetails.push({
        truck: t,
        totalAmount: truckSums[truckId].amount,
        expenseCount: truckSums[truckId].count
      });
    }
  });

  // Build deal aggregate array
  Object.keys(dealSums).forEach(dealId => {
    const d = deals.find(x => x.id === dealId);
    if (d) {
      report.dealExpensesDetails.push({
        deal: d,
        totalAmount: dealSums[dealId].amount,
        expenseCount: dealSums[dealId].count
      });
    }
  });

  // Sort aggregates by amount desc
  report.truckExpensesDetails.sort((a, b) => b.totalAmount - a.totalAmount);
  report.dealExpensesDetails.sort((a, b) => b.totalAmount - a.totalAmount);

  // Sort details by date desc
  report.expenseDetails.sort((a, b) => new Date(b.expense.date).getTime() - new Date(a.expense.date).getTime());

  return report;
}
