import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate, formatINR } from '../../utils/format';
import { LoanStatusBadge } from './loan-status-badge';
import type { LoanContext } from '../../services/loans/loan-service';

interface LoanTableProps {
  loans: LoanContext[];
}

type SortField = 'id' | 'loanAmount' | 'expectedCommission' | 'receivedCommission' | 'applicationDate' | 'status' | 'customer' | 'financePartner';

export function LoanTable({ loans }: LoanTableProps) {
  const [sortField, setSortField] = useState<SortField>('applicationDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'applicationDate' && field !== 'loanAmount' && field !== 'expectedCommission');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...loans].sort((a, b) => {
    let valA: any = a.loan.id;
    let valB: any = b.loan.id;

    if (sortField === 'loanAmount') {
      valA = a.loan.loanAmount;
      valB = b.loan.loanAmount;
    } else if (sortField === 'expectedCommission') {
      valA = a.loan.expectedCommission;
      valB = b.loan.expectedCommission;
    } else if (sortField === 'receivedCommission') {
      valA = a.loan.receivedCommission;
      valB = b.loan.receivedCommission;
    } else if (sortField === 'applicationDate') {
      valA = new Date(a.loan.applicationDate).getTime();
      valB = new Date(b.loan.applicationDate).getTime();
    } else if (sortField === 'status') {
      valA = a.loan.status;
      valB = b.loan.status;
    } else if (sortField === 'customer') {
      valA = a.customer?.name || '';
      valB = b.customer?.name || '';
    } else if (sortField === 'financePartner') {
      valA = a.financePartner?.name || '';
      valB = b.financePartner?.name || '';
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
                <div className="flex items-center gap-1">Loan {getSortIcon('id')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('customer')}>
                <div className="flex items-center gap-1">Customer / Deal {getSortIcon('customer')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('financePartner')}>
                <div className="flex items-center gap-1">Partner {getSortIcon('financePartner')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('loanAmount')}>
                <div className="flex items-center justify-end gap-1">Loan Amount {getSortIcon('loanAmount')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('expectedCommission')}>
                <div className="flex items-center justify-end gap-1">Expected Comm {getSortIcon('expectedCommission')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('applicationDate')}>
                <div className="flex items-center gap-1">App Date {getSortIcon('applicationDate')}</div>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No loans found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { loan, deal, customer, truck, financePartner } = ctx;

                return (
                  <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/loans/${loan.id}`} className="font-medium text-navy-900 hover:underline block">
                        {loan.id}
                      </Link>
                      {truck && <span className="text-[10px] text-slate-500">{truck.registrationNumber}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {customer ? (
                        <Link to={`/customers/${customer.id}`} className="font-medium text-slate-800 hover:underline block truncate max-w-[150px]">
                          {customer.name}
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic block">Unknown</span>
                      )}
                      {deal && (
                        <Link to={`/deals/${deal.id}`} className="text-xs text-navy-600 hover:underline">
                          {deal.id}
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {financePartner ? (
                        <Link to={`/finance-partners/${financePartner.id}`} className="text-slate-700 hover:underline block max-w-[140px] truncate">
                          {financePartner.name}
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(loan.loanAmount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-emerald-700">{formatINR(loan.expectedCommission)}</div>
                      {loan.receivedCommission > 0 && <div className="text-[10px] text-slate-500 mt-0.5">Rcvd: {formatINR(loan.receivedCommission)}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <LoanStatusBadge status={loan.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(loan.applicationDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/loans/${loan.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
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
            <span className="font-medium text-navy-900">{sorted.length}</span> loans
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
