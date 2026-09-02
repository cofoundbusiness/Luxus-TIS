import { Users, UserCheck, CheckCircle, Clock } from 'lucide-react';

interface CustomerSummaryProps {
  summary: {
    total: number;
    withActiveLeads: number;
    withCompletedDeals: number;
    newRecent: number;
  };
}

export function CustomerSummary({ summary }: CustomerSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-medium">Total Customers</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-navy-600">
        <div className="flex items-center gap-2 text-navy-600 mb-2">
          <UserCheck className="w-4 h-4" />
          <span className="text-xs font-medium">Active Leads</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.withActiveLeads}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Completed Deals</span>
        </div>
        <div className="text-2xl font-bold text-emerald-700">{summary.withCompletedDeals}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium leading-tight">New / Recent (30d)</span>
        </div>
        <div className="text-2xl font-bold text-amber-700">{summary.newRecent}</div>
      </div>
    </div>
  );
}
