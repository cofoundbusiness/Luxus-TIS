import { Wallet, Truck, Briefcase, Calendar } from 'lucide-react';
import { formatINR } from '../../utils/format';

interface ExpenseSummaryProps {
  summary: {
    total: number;
    truckExpenses: number;
    dealExpenses: number;
    currentMonthExpenses: number;
    count: number;
  };
}

export function ExpenseSummary({ summary }: ExpenseSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Wallet className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium">Total Expenses</span>
        </div>
        <div className="text-xl font-bold text-red-600">{formatINR(summary.total)}</div>
        <div className="text-[10px] text-slate-400 mt-1">{summary.count} records</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Truck className="w-4 h-4" />
          <span className="text-xs font-medium">Truck Operations</span>
        </div>
        <div className="text-xl font-bold text-navy-900">{formatINR(summary.truckExpenses)}</div>
        <div className="text-[10px] text-slate-400 mt-1">Direct vehicle costs</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Briefcase className="w-4 h-4" />
          <span className="text-xs font-medium">Deal Expenses</span>
        </div>
        <div className="text-xl font-bold text-navy-900">{formatINR(summary.dealExpenses)}</div>
        <div className="text-[10px] text-slate-400 mt-1">Non-truck transaction costs</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between bg-navy-50 border-navy-100">
        <div className="flex items-center gap-2 text-navy-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span className="text-xs font-medium">Current Month</span>
        </div>
        <div className="text-xl font-bold text-navy-900">{formatINR(summary.currentMonthExpenses)}</div>
        <div className="text-[10px] text-navy-500 mt-1">Based on reference date</div>
      </div>
    </div>
  );
}
