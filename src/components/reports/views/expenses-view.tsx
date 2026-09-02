import { formatINR, formatDate } from '../../../utils/format';
import type { ExpenseReport } from '../../../services/reports/expense-report';
import { Link } from 'react-router-dom';
import { Ban, Truck } from 'lucide-react';

interface ExpensesViewProps {
  expenses: ExpenseReport;
}

export function ExpensesView({ expenses }: ExpensesViewProps) {
  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Expenses</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(expenses.totalExpenseValue)}</div>
          <div className="text-xs text-slate-600 mt-1">{expenses.totalExpenses} records</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Average Expense</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(expenses.averageExpense)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Highest Single Expense</div>
          <div className="text-xl font-bold text-amber-600">{formatINR(expenses.highestExpense)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-sm text-navy-900">Expenses by Category</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(expenses.byCategory).length > 0 ? (
              Object.entries(expenses.byCategory).sort((a,b) => b[1] - a[1]).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{cat}</span>
                  <span className="font-bold text-navy-900">{formatINR(amount)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-sm text-navy-900">Highest Expense Trucks</h3>
          </div>
          <div className="p-4 space-y-3">
            {expenses.truckExpensesDetails.length > 0 ? (
              expenses.truckExpensesDetails.slice(0, 5).map((t) => (
                <div key={t.truck.id} className="flex justify-between items-center text-sm border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                  <div>
                    <Link to={`/inventory/${t.truck.id}`} className="font-medium text-navy-900 hover:underline">
                      {t.truck.registrationNumber}
                    </Link>
                    <div className="text-xs text-slate-500">{t.expenseCount} expenses</div>
                  </div>
                  <span className="font-bold text-amber-700">{formatINR(t.totalAmount)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-navy-900">Recent Expense Records</h3>
        </div>
        <div className="overflow-x-auto">
          {expenses.expenseDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Truck / Deal</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.expenseDetails.map(({ expense: e, truck, deal }) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy-900">{e.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{e.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {truck && <Link to={`/inventory/${truck.id}`} className="text-navy-600 hover:underline block">Truck: {truck.registrationNumber}</Link>}
                      {deal && <Link to={`/deals/${deal.id}`} className="text-navy-600 hover:underline block">Deal: {deal.id}</Link>}
                      {!truck && !deal && <span className="text-slate-500">General</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(e.amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 text-xs">
                      {formatDate(e.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No expense records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
