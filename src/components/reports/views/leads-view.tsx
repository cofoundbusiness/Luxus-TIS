import { formatDate } from '../../../utils/format';
import type { LeadReport } from '../../../services/reports/commercial-report';
import { Link } from 'react-router-dom';
import { Ban, Clock } from 'lucide-react';

interface LeadsViewProps {
  leads: LeadReport;
}

export function LeadsView({ leads }: LeadsViewProps) {
  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Leads</div>
          <div className="text-xl font-bold text-navy-900">{leads.totalLeads}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">{leads.activeLeads} Active</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Conversion Rate</div>
          <div className="text-xl font-bold text-navy-900">{leads.conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">{leads.soldLeads} Sold</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Overdue Follow-ups</div>
          <div className={`text-xl font-bold ${leads.overdueFollowUps > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {leads.overdueFollowUps}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Lost Leads</div>
          <div className="text-xl font-bold text-slate-600">{leads.lostLeads}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-sm text-navy-900">Funnel Status</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">New</span><span className="font-bold text-navy-900">{leads.newLeads}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Contacted</span><span className="font-bold text-navy-900">{leads.contactedLeads}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Interested</span><span className="font-bold text-navy-900">{leads.interestedLeads}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Negotiation</span><span className="font-bold text-navy-900">{leads.negotiationLeads}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Booked</span><span className="font-bold text-navy-900">{leads.bookedLeads}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-sm text-navy-900">Lead Source & Conversion</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(leads.leadsBySource).length > 0 ? (
              Object.entries(leads.leadsBySource).sort((a,b) => b[1].count - a[1].count).map(([source, data]) => (
                <div key={source} className="flex justify-between items-center text-sm border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                  <span className="text-slate-700 font-medium">{source}</span>
                  <div className="text-right">
                    <div className="font-bold text-navy-900">{data.count} <span className="font-normal text-slate-500 text-xs text-right ml-1">leads</span></div>
                    <div className="text-xs text-emerald-600">{data.conversion.toFixed(1)}% conv</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-navy-900">Lead Activity</h3>
        </div>
        <div className="overflow-x-auto">
          {leads.leadsDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Broker</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Next Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.leadsDetails.map(({ lead, customerName, brokerName, isOverdue }) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/leads/${lead.id}`} className="font-medium text-navy-900 hover:underline">
                        {lead.id}
                      </Link>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">{lead.requirement}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{customerName}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{brokerName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === 'SOLD' ? 'bg-emerald-100 text-emerald-800' :
                        lead.status === 'LOST' ? 'bg-slate-100 text-slate-600' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.status !== 'SOLD' && lead.status !== 'LOST' ? (
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                          {isOverdue && <Clock className="w-3.5 h-3.5" />}
                          {lead.nextFollowUp ? formatDate(lead.nextFollowUp) : 'Not Scheduled'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No leads match the selected period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
