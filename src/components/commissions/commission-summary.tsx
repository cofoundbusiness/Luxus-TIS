import { IndianRupee, PieChart, CheckCircle, Clock, Banknote, Building2, Briefcase } from 'lucide-react';
import { formatINR } from '../../utils/format';

interface CommissionSummaryProps {
  summary: {
    total: number;
    pending: number;
    partial: number;
    paid: number;
    cancelled: number;
    totalCommissionValue: number;
    pendingValue: number;
    paidValue: number;
    brokerCommissionTotal: number;
    financeCommissionTotal: number;
  };
}

export function CommissionSummary({ summary }: CommissionSummaryProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <PieChart className="w-4 h-4" />
            <span className="text-xs font-medium">Total Comm.</span>
          </div>
          <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">{summary.pending}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Banknote className="w-4 h-4" />
            <span className="text-xs font-medium">Partial</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{summary.partial}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Paid</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.paid}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-slate-200">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <IndianRupee className="w-4 h-4" />
            <span className="text-xs font-medium">Value</span>
          </div>
          <div className="text-2xl font-bold text-navy-900">{formatINR(summary.totalCommissionValue)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-navy-900 text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <div className="text-navy-300 text-xs font-medium uppercase tracking-wider mb-0.5">Pending Value</div>
            <div className="text-xl font-bold text-amber-400">{formatINR(summary.pendingValue)}</div>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-900 p-4 rounded-lg border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-emerald-700 text-xs font-medium uppercase tracking-wider mb-0.5">Paid Value</div>
            <div className="text-xl font-bold">{formatINR(summary.paidValue)}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5 uppercase tracking-wider mb-0.5"><Briefcase className="w-3 h-3" /> Broker Comm.</div>
            <div className="text-xl font-bold text-slate-800">{formatINR(summary.brokerCommissionTotal)}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5 uppercase tracking-wider mb-0.5"><Building2 className="w-3 h-3" /> Finance Comm.</div>
            <div className="text-xl font-bold text-slate-800">{formatINR(summary.financeCommissionTotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
