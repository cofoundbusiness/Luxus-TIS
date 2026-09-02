import { Handshake, CheckSquare, CheckCircle, XCircle, IndianRupee, Briefcase } from 'lucide-react';
import { formatINR } from '../../utils/format';

interface DealSummaryProps {
  summary: {
    total: number;
    negotiation: number;
    booked: number;
    completed: number;
    cancelled: number;
    totalSalesValue: number;
    realizedProfit: number;
  };
}

export function DealSummary({ summary }: DealSummaryProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-medium">Total Deals</span>
          </div>
          <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Handshake className="w-4 h-4" />
            <span className="text-xs font-medium">Negotiation</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">{summary.negotiation}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <CheckSquare className="w-4 h-4" />
            <span className="text-xs font-medium">Booked</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{summary.booked}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Completed</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.completed}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-slate-400">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Cancelled</span>
          </div>
          <div className="text-2xl font-bold text-slate-700">{summary.cancelled}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-navy-900 text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-navy-800 p-2 rounded-md">
              <IndianRupee className="w-5 h-5 text-navy-200" />
            </div>
            <div>
              <div className="text-navy-300 text-xs font-medium uppercase tracking-wider mb-0.5">Total Sales Volume</div>
              <div className="text-2xl font-bold">{formatINR(summary.totalSalesValue)}</div>
            </div>
          </div>
        </div>
        <div className="bg-emerald-900 text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 p-2 rounded-md">
              <IndianRupee className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-emerald-300 text-xs font-medium uppercase tracking-wider mb-0.5">Realized Profit (Completed Deals)</div>
              <div className="text-2xl font-bold text-emerald-100">{formatINR(summary.realizedProfit)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
