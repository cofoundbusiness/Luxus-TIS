import { formatINR } from '../../utils/format';

interface FinanceSummaryProps {
  data: {
    applications: number;
    processingOrApproved: number;
    disbursed: number;
    pendingCommValue: number;
    receivedCommValue: number;
  };
}

export function FinanceSummary({ data }: FinanceSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 h-full flex flex-col">
      <h2 className="text-base font-semibold text-navy-900 mb-4">Finance Snapshot</h2>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-3 bg-slate-50 rounded border border-slate-100">
          <div className="text-xl font-semibold text-navy-900">{data.applications}</div>
          <div className="text-xs text-slate-500 mt-1">Applications</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded border border-slate-100">
          <div className="text-xl font-semibold text-blue-600">{data.processingOrApproved}</div>
          <div className="text-xs text-slate-500 mt-1">Processing</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded border border-slate-100">
          <div className="text-xl font-semibold text-green-600">{data.disbursed}</div>
          <div className="text-xs text-slate-500 mt-1">Disbursed</div>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50">
          <span className="text-sm font-medium text-slate-600">Pending Comm.</span>
          <span className="text-sm font-bold text-amber-600">{formatINR(data.pendingCommValue)}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-slate-50">
          <span className="text-sm font-medium text-slate-600">Received Comm.</span>
          <span className="text-sm font-bold text-green-600">{formatINR(data.receivedCommValue)}</span>
        </div>
      </div>
    </div>
  );
}
