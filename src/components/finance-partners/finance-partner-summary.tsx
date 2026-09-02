import { Building2, CheckCircle, XCircle, FileText, Banknote, IndianRupee } from 'lucide-react';
import { formatINR } from '../../utils/format';

interface FinancePartnerSummaryProps {
  summary: {
    total: number;
    active: number;
    inactive: number;
    withActiveLoans: number;
    withDisbursedLoans: number;
    totalLoanValue: number;
    expectedCommission: number;
  };
}

export function FinancePartnerSummary({ summary }: FinancePartnerSummaryProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-medium">Total Partners</span>
          </div>
          <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Active</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.active}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-slate-400">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Inactive</span>
          </div>
          <div className="text-2xl font-bold text-slate-700">{summary.inactive}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium truncate">W/ Active Loans</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{summary.withActiveLoans}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Banknote className="w-4 h-4" />
            <span className="text-xs font-medium truncate">W/ Disbursed</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary.withDisbursedLoans}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-navy-900 text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-navy-800 p-2 rounded-md">
              <Banknote className="w-5 h-5 text-navy-200" />
            </div>
            <div>
              <div className="text-navy-300 text-xs font-medium uppercase tracking-wider mb-0.5">Total Portfolio Value</div>
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
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Total Expected Comm.</div>
              <div className="text-xl font-bold">{formatINR(summary.expectedCommission)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
