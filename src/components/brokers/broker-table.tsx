import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatINR } from '../../utils/format';
import type { BrokerContext } from '../../services/brokers/broker-service';

interface BrokerTableProps {
  brokers: BrokerContext[];
}

type SortField = 'name' | 'company' | 'activeLeads' | 'completedDeals' | 'commission' | 'status';

export function BrokerTable({ brokers }: BrokerTableProps) {
  const [sortField, setSortField] = useState<SortField>('completedDeals');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'activeLeads' && field !== 'completedDeals' && field !== 'commission');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...brokers].sort((a, b) => {
    let valA: any = a.broker.name;
    let valB: any = b.broker.name;

    if (sortField === 'name') {
      valA = a.broker.name;
      valB = b.broker.name;
    } else if (sortField === 'company') {
      valA = a.broker.companyName || '';
      valB = b.broker.companyName || '';
    } else if (sortField === 'activeLeads') {
      valA = a.activeLeadsCount;
      valB = b.activeLeadsCount;
    } else if (sortField === 'completedDeals') {
      valA = a.completedDealsCount;
      valB = b.completedDealsCount;
    } else if (sortField === 'commission') {
      valA = a.totalBrokerCommission;
      valB = b.totalBrokerCommission;
    } else if (sortField === 'status') {
      valA = a.broker.status;
      valB = b.broker.status;
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
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Broker {getSortIcon('name')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">Company {getSortIcon('company')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('activeLeads')}>
                <div className="flex items-center gap-1">Active Leads {getSortIcon('activeLeads')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('completedDeals')}>
                <div className="flex items-center gap-1">Completed Deals {getSortIcon('completedDeals')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('commission')}>
                <div className="flex items-center gap-1">Commission {getSortIcon('commission')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No brokers found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { broker: b, activeLeadsCount, completedDealsCount, totalBrokerCommission } = ctx;

                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/brokers/${b.id}`} className="font-medium text-navy-900 hover:underline">
                        {b.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {b.companyName || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{b.phone}</div>
                      {b.city && <div className="text-xs text-slate-500">{b.city}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium ${activeLeadsCount > 0 ? 'bg-navy-100 text-navy-800' : 'bg-slate-100 text-slate-500'}`}>
                        {activeLeadsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium ${completedDealsCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {completedDealsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {formatINR(totalBrokerCommission)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${b.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/brokers/${b.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
                        View Profile
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
            <span className="font-medium text-navy-900">{sorted.length}</span> brokers
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
