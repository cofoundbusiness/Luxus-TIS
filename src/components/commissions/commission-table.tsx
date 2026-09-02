import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, CheckCircle, Clock } from 'lucide-react';
import { formatDate, formatINR } from '../../utils/format';
import type { CommissionContext } from '../../services/commissions/commission-service';

interface CommissionTableProps {
  commissions: CommissionContext[];
}

type SortField = 'id' | 'type' | 'entity' | 'amount' | 'dueDate' | 'paidDate' | 'status';

export function CommissionTable({ commissions }: CommissionTableProps) {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'amount' && field !== 'dueDate' && field !== 'paidDate');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...commissions].sort((a, b) => {
    let valA: any = a.commission.id;
    let valB: any = b.commission.id;

    if (sortField === 'type') {
      valA = a.commission.type;
      valB = b.commission.type;
    } else if (sortField === 'entity') {
      valA = a.commission.type === 'BROKER' ? a.broker?.name || '' : a.financePartner?.name || '';
      valB = b.commission.type === 'BROKER' ? b.broker?.name || '' : b.financePartner?.name || '';
    } else if (sortField === 'amount') {
      valA = a.commission.amount;
      valB = b.commission.amount;
    } else if (sortField === 'dueDate') {
      valA = a.commission.dueDate ? new Date(a.commission.dueDate).getTime() : 0;
      valB = b.commission.dueDate ? new Date(b.commission.dueDate).getTime() : 0;
    } else if (sortField === 'paidDate') {
      valA = a.commission.paidDate ? new Date(a.commission.paidDate).getTime() : 0;
      valB = b.commission.paidDate ? new Date(b.commission.paidDate).getTime() : 0;
    } else if (sortField === 'status') {
      valA = a.commission.status;
      valB = b.commission.status;
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
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">Commission {getSortIcon('id')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('type')}>
                <div className="flex items-center gap-1">Type {getSortIcon('type')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('entity')}>
                <div className="flex items-center gap-1">Broker / Partner {getSortIcon('entity')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end gap-1">Amount {getSortIcon('amount')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center gap-1">Due Date {getSortIcon('dueDate')}</div>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No commissions found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { commission, broker, financePartner, deal, loan } = ctx;

                return (
                  <tr key={commission.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/commissions/${commission.id}`} className="font-medium text-navy-900 hover:underline block">
                        {commission.id}
                      </Link>
                      <div className="text-[10px] text-slate-500 flex gap-2 mt-0.5">
                        {deal && <Link to={`/deals/${deal.id}`} className="hover:text-navy-600">Deal {deal.id}</Link>}
                        {loan && <Link to={`/loans/${loan.id}`} className="hover:text-navy-600 border-l border-slate-300 pl-2">Loan {loan.id}</Link>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${commission.type === 'BROKER' ? 'bg-slate-100 text-slate-600' : 'bg-navy-50 text-navy-600'}`}>
                        {commission.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {commission.type === 'BROKER' ? (
                        broker ? (
                          <Link to={`/brokers/${broker.id}`} className="font-medium text-slate-800 hover:underline block max-w-[150px] truncate">
                            {broker.name}
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic block">Unknown Broker</span>
                        )
                      ) : (
                        financePartner ? (
                          <Link to={`/finance-partners/${financePartner.id}`} className="font-medium text-slate-800 hover:underline block max-w-[150px] truncate">
                            {financePartner.name}
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic block">Unknown Partner</span>
                        )
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-navy-900">{formatINR(commission.amount)}</div>
                      {commission.rate && <div className="text-[10px] text-slate-500 mt-0.5">{commission.rate}%</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {commission.status === 'PAID' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          commission.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          commission.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          commission.status === 'CANCELLED' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {commission.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{commission.dueDate ? formatDate(commission.dueDate) : '—'}</div>
                      {commission.paidDate && <div className="text-[10px] text-emerald-600 mt-0.5">Paid: {formatDate(commission.paidDate)}</div>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/commissions/${commission.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
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
            <span className="font-medium text-navy-900">{sorted.length}</span> commissions
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
