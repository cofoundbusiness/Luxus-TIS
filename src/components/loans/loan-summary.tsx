import { Landmark, FileText, Settings, CheckCircle, XCircle, Banknote, IndianRupee } from 'lucide-react';
import { formatINR } from '../../utils/format';

interface LoanSummaryProps {
  summary: {
    total: number;
    application: number;
    processing: number;
    approved: number;
    rejected: number;
    disbursed: number;
    totalLoanValue: number;
    expectedCommission: number;
    receivedCommission: number;
  };
}

export function LoanSummary({ summary }: LoanSummaryProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Landmark className="w-4 h-4" />
            <span className="text-xs font-medium">Total Loans</span>
          </div>
          <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-slate-400">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Application</span>
          </div>
          <div className="text-2xl font-bold text-slate-700">{summary.application}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-amber-400">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-xs font-medium">Processing</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">{summary.processing}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Approved</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{summary.approved}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Banknote className="w-4 h-4" />
            <span className="text-xs font-medium">Disbursed</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.disbursed}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-red-400">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Rejected</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{summary.rejected}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-navy-900 text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-navy-800 p-2 rounded-md">
              <Landmark className="w-5 h-5 text-navy-200" />
            </div>
            <div>
              <div className="text-navy-300 text-xs font-medium uppercase tracking-wider mb-0.5">Total Loan Value</div>
              <div className="text-xl font-bold">{formatINR(summary.totalLoanValue)}</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 text-slate-800 p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-md border border-slate-200">
              <IndianRupee className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Expected Comm.</div>
              <div className="text-xl font-bold">{formatINR(summary.expectedCommission)}</div>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-900 p-4 rounded-lg border border-emerald-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-md border border-emerald-100">
              <IndianRupee className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-emerald-700 text-xs font-medium uppercase tracking-wider mb-0.5">Received Comm.</div>
              <div className="text-xl font-bold">{formatINR(summary.receivedCommission)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
