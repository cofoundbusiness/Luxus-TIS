import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate, formatINR } from '../../utils/format';
import { LeadStatusBadge, LeadFollowUpBadge } from './lead-badges';
import { getFollowUpStatus } from '../../services/leads/lead-service';
import type { LeadContext } from '../../services/leads/lead-service';

interface LeadTableProps {
  leads: LeadContext[];
}

type SortField = 'createdAt' | 'nextFollowUp' | 'status' | 'budget' | 'probability';

export function LeadTable({ leads }: LeadTableProps) {
  const [sortField, setSortField] = useState<SortField>('nextFollowUp');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'createdAt' && field !== 'budget');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...leads].sort((a, b) => {
    let valA: any = a.lead[sortField as keyof typeof a.lead];
    let valB: any = b.lead[sortField as keyof typeof b.lead];

    if (sortField === 'createdAt' || sortField === 'nextFollowUp') {
      valA = valA ? new Date(valA).getTime() : 0;
      valB = valB ? new Date(valB).getTime() : 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Requirement / Truck</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Stage {getSortIcon('status')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('budget')}>
                <div className="flex items-center gap-1">Budget {getSortIcon('budget')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('probability')}>
                <div className="flex items-center gap-1">Prob. {getSortIcon('probability')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('nextFollowUp')}>
                <div className="flex items-center gap-1">Next Follow-up {getSortIcon('nextFollowUp')}</div>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { lead, customerName, customerCompany, truckDetails } = ctx;
                const followUpStatus = getFollowUpStatus(lead.nextFollowUp, lead.status);

                return (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/customers/${lead.customerId}`} className="font-medium text-navy-900 hover:underline">
                        {customerName}
                      </Link>
                      {customerCompany && <div className="text-xs text-slate-500">{customerCompany}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-800 truncate max-w-[200px]" title={lead.requirement}>
                        {lead.requirement}
                      </div>
                      {truckDetails && (
                        <Link to={`/inventory/${lead.truckId}`} className="text-xs text-navy-600 hover:underline truncate max-w-[200px] block">
                          {truckDetails}
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {formatINR(lead.budget)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${lead.probability >= 70 ? 'bg-green-500' : lead.probability >= 40 ? 'bg-amber-500' : 'bg-red-400'}`} 
                            style={{ width: `${lead.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{lead.probability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-slate-700">{lead.nextFollowUp ? formatDate(lead.nextFollowUp) : '-'}</span>
                        <LeadFollowUpBadge status={followUpStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/leads/${lead.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-navy-900">{(page - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="font-medium text-navy-900">{Math.min(page * rowsPerPage, sorted.length)}</span> of{' '}
            <span className="font-medium text-navy-900">{sorted.length}</span> leads
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
