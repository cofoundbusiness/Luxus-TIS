import { formatINR, formatDate } from '../../utils/format';
import type { Expense } from '../../types';

interface TruckExpensesProps {
  expenses: Expense[];
}

export function TruckExpenses({ expenses }: TruckExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-semibold text-navy-900">Expenses</h2>
        </div>
        <div className="p-6 text-center text-slate-500 text-sm">
          No expenses recorded.
        </div>
      </div>
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-base font-semibold text-navy-900">Expenses</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 text-xs uppercase border-b border-slate-100">
            <tr>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.map(e => (
              <tr key={e.id}>
                <td className="px-4 py-2 text-slate-600">{formatDate(e.date)}</td>
                <td className="px-4 py-2 text-slate-900">{e.category}</td>
                <td className="px-4 py-2 text-right font-medium text-red-600">{formatINR(e.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center mt-auto">
        <span className="text-sm font-medium text-navy-900">Total Expenses</span>
        <span className="text-base font-bold text-red-600">{formatINR(total)}</span>
      </div>
    </div>
  );
}
