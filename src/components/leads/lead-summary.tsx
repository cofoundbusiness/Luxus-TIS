import { Users, UserPlus, Handshake, CheckSquare, CalendarClock } from 'lucide-react';

interface LeadSummaryProps {
  summary: {
    total: number;
    activeCount: number;
    newCount: number;
    negotiationCount: number;
    bookedCount: number;
    overdueCount: number;
  };
}

export function LeadSummary({ summary }: LeadSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Users className="w-4 h-4" />
          <span className="text-xs font-medium">Total Leads</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-navy-600">
        <div className="flex items-center gap-2 text-navy-600 mb-2">
          <span className="text-xs font-medium">Active Leads</span>
        </div>
        <div className="text-2xl font-bold text-navy-900">{summary.activeCount}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-blue-400">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <UserPlus className="w-4 h-4" />
          <span className="text-xs font-medium">New</span>
        </div>
        <div className="text-2xl font-bold text-blue-700">{summary.newCount}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-amber-400">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <Handshake className="w-4 h-4" />
          <span className="text-xs font-medium">Negotiation</span>
        </div>
        <div className="text-2xl font-bold text-amber-700">{summary.negotiationCount}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between border-l-4 border-l-green-400">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <CheckSquare className="w-4 h-4" />
          <span className="text-xs font-medium">Booked</span>
        </div>
        <div className="text-2xl font-bold text-green-700">{summary.bookedCount}</div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-red-200 bg-red-50 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <CalendarClock className="w-4 h-4" />
          <span className="text-xs font-medium leading-tight">Overdue Follow-ups</span>
        </div>
        <div className="text-2xl font-bold text-red-700">{summary.overdueCount}</div>
      </div>
    </div>
  );
}
