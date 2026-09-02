import { formatDate } from '../../utils/format';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FollowUp {
  id: string;
  customerName: string;
  truckRef: string;
  brokerName: string;
  status: string;
  nextFollowUp?: string;
  isOverdue: boolean;
  isToday: boolean;
}

interface FollowUpTableProps {
  data: FollowUp[];
}

export function FollowUpTable({ data }: FollowUpTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col items-center justify-center text-center h-48">
        <Calendar className="w-8 h-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-medium text-slate-600">No follow-ups required</h3>
        <p className="text-xs text-slate-400 mt-1">Your pipeline is up to date.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-base font-semibold text-navy-900">Follow-up Required</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Requirement</th>
              <th className="px-4 py-3 font-medium">Broker</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Follow-up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.slice(0, 5).map(lead => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-navy-900">{lead.customerName}</td>
                <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{lead.truckRef}</td>
                <td className="px-4 py-3 text-slate-600">{lead.brokerName}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {lead.isOverdue && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                    <span className={cn(
                      "font-medium",
                      lead.isOverdue ? "text-red-600" : (lead.isToday ? "text-amber-600" : "text-slate-600")
                    )}>
                      {lead.isOverdue ? 'Overdue' : (lead.isToday ? 'Today' : (lead.nextFollowUp ? formatDate(lead.nextFollowUp) : ''))}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
