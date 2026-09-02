import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

interface DocumentSummaryProps {
  summary: {
    total: number;
    available: number;
    pending: number;
    expired: number;
    attentionRequired: number;
  };
}

export function DocumentSummary({ summary }: DocumentSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <FileText className="w-4 h-4" />
          <span className="text-xs font-medium">Total Documents</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium">Available</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{summary.available}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium">Pending</span>
        </div>
        <div className="text-2xl font-bold text-amber-600">{summary.pending}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium">Expired</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{summary.expired}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-red-200 bg-red-50 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">Attention Required</span>
        </div>
        <div className="text-2xl font-bold text-red-700">{summary.attentionRequired}</div>
      </div>
    </div>
  );
}
