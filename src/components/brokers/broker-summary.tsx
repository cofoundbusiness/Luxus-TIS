import { Users, UserCheck, UserMinus, Handshake, CheckCircle } from 'lucide-react';

interface BrokerSummaryProps {
  summary: {
    total: number;
    active: number;
    inactive: number;
    withActiveLeads: number;
    withCompletedDeals: number;
  };
}

export function BrokerSummary({ summary }: BrokerSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-medium">Total Brokers</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <UserCheck className="w-4 h-4" />
          <span className="text-xs font-medium">Active</span>
        </div>
        <div className="text-2xl font-bold text-emerald-700">{summary.active}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-slate-400">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <UserMinus className="w-4 h-4" />
          <span className="text-xs font-medium">Inactive</span>
        </div>
        <div className="text-2xl font-bold text-slate-700">{summary.inactive}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-navy-600">
        <div className="flex items-center gap-2 text-navy-600 mb-2">
          <Handshake className="w-4 h-4" />
          <span className="text-xs font-medium">W/ Active Leads</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.withActiveLeads}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">W/ Completed Deals</span>
        </div>
        <div className="text-2xl font-bold text-amber-700">{summary.withCompletedDeals}</div>
      </div>
    </div>
  );
}
