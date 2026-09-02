import { formatINR } from '../../utils/format';
import type { Truck, Expense } from '../../types';
import { getTruckProfit } from '../../services/inventory-service';

interface TruckFinancialSummaryProps {
  truck: Truck;
  expenses: Expense[];
}

export function TruckFinancialSummary({ truck, expenses }: TruckFinancialSummaryProps) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = getTruckProfit(truck);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-base font-semibold text-navy-900">Financial Summary</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-sm text-slate-600">Purchase Price</span>
          <span className="text-sm font-medium text-navy-900">{formatINR(truck.purchasePrice)}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-sm text-slate-600">Truck Expenses</span>
          <span className="text-sm font-medium text-red-600">{formatINR(totalExpenses)}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-sm text-slate-600">Target Selling Price</span>
          <span className="text-sm font-medium text-navy-900">{formatINR(truck.sellingPrice)}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-semibold text-navy-900">
            {truck.status === 'SOLD' ? 'Realized Gross Profit' : 'Expected Gross Profit'}
          </span>
          <span className="text-base font-bold text-green-600">{formatINR(profit)}</span>
        </div>
      </div>
    </div>
  );
}
