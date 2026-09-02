import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatINR } from '../../utils/format';
import type { FinancePartnerContext } from '../../services/finance-partners/finance-partner-service';

interface FinancePartnerTableProps {
  partners: FinancePartnerContext[];
}

type SortField = 'name' | 'contactPerson' | 'commissionRate' | 'activeLoansCount' | 'disbursedLoansCount' | 'totalLoanValue' | 'expectedCommission' | 'status';

export function FinancePartnerTable({ partners }: FinancePartnerTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'contactPerson' || field === 'status');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...partners].sort((a, b) => {
    let valA: any = a.partner.name;
    let valB: any = b.partner.name;

    if (sortField === 'contactPerson') {
      valA = a.partner.contactPerson || '';
      valB = b.partner.contactPerson || '';
    } else if (sortField === 'commissionRate') {
      valA = a.partner.commissionRate;
      valB = b.partner.commissionRate;
    } else if (sortField === 'activeLoansCount') {
      valA = a.activeLoansCount;
      valB = b.activeLoansCount;
    } else if (sortField === 'disbursedLoansCount') {
      valA = a.disbursedLoansCount;
      valB = b.disbursedLoansCount;
    } else if (sortField === 'totalLoanValue') {
      valA = a.totalLoanValue;
      valB = b.totalLoanValue;
    } else if (sortField === 'expectedCommission') {
      valA = a.expectedCommission;
      valB = b.expectedCommission;
    } else if (sortField === 'status') {
      valA = a.partner.status;
      valB = b.partner.status;
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
                <div className="flex items-center gap-1">Partner {getSortIcon('name')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('contactPerson')}>
                <div className="flex items-center gap-1">Contact {getSortIcon('contactPerson')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('commissionRate')}>
                <div className="flex items-center justify-end gap-1">Rate {getSortIcon('commissionRate')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-center" onClick={() => handleSort('activeLoansCount')}>
                <div className="flex items-center justify-center gap-1">Active {getSortIcon('activeLoansCount')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-center" onClick={() => handleSort('disbursedLoansCount')}>
                <div className="flex items-center justify-center gap-1">Disbursed {getSortIcon('disbursedLoansCount')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('totalLoanValue')}>
                <div className="flex items-center justify-end gap-1">Loan Value {getSortIcon('totalLoanValue')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('expectedCommission')}>
                <div className="flex items-center justify-end gap-1">Exp. Comm {getSortIcon('expectedCommission')}</div>
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
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  No partners found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { partner, activeLoansCount, disbursedLoansCount, totalLoanValue, expectedCommission } = ctx;

                return (
                  <tr key={partner.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/finance-partners/${partner.id}`} className="font-medium text-navy-900 hover:underline block max-w-[200px] truncate">
                        {partner.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800">{partner.contactPerson || '—'}</div>
                      <div className="text-[10px] text-slate-500">{partner.phone || partner.email || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">
                      {partner.commissionRate}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs">
                        {activeLoansCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs">
                        {disbursedLoansCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(totalLoanValue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-slate-700">{formatINR(expectedCommission)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${partner.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/finance-partners/${partner.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
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
            <span className="font-medium text-navy-900">{sorted.length}</span> partners
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
