import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate, formatINR } from '../../utils/format';
import type { ExpenseContext } from '../../services/expenses/expense-service';

interface ExpenseTableProps {
  expenses: ExpenseContext[];
}

type SortField = 'date' | 'amount' | 'category' | 'truckName';

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'date' && field !== 'amount');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...expenses].sort((a, b) => {
    let valA: any = a.expense[sortField as keyof typeof a.expense] || a[sortField as keyof typeof a];
    let valB: any = b.expense[sortField as keyof typeof b.expense] || b[sortField as keyof typeof b];

    if (sortField === 'date') {
      valA = new Date(a.expense.date).getTime();
      valB = new Date(b.expense.date).getTime();
    } else if (sortField === 'amount') {
      valA = a.expense.amount;
      valB = b.expense.amount;
    } else if (sortField === 'category') {
      valA = a.expense.category;
      valB = b.expense.category;
    } else if (sortField === 'truckName') {
      valA = a.truckName || '';
      valB = b.truckName || '';
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
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">Date {getSortIcon('date')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('category')}>
                <div className="flex items-center gap-1">Category {getSortIcon('category')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('truckName')}>
                <div className="flex items-center gap-1">Truck {getSortIcon('truckName')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Deal</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end gap-1">Amount {getSortIcon('amount')}</div>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No expenses found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { expense: exp, truckName, truckRegistration, dealName } = ctx;

                return (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">{formatDate(exp.date)}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy-900 truncate max-w-[200px]" title={exp.description}>
                        {exp.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {truckName ? (
                        <div>
                          <Link to={`/inventory/${exp.truckId}`} className="font-medium text-navy-600 hover:underline">
                            {truckName}
                          </Link>
                          <div className="text-xs text-slate-500 mt-0.5">{truckRegistration}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {dealName ? (
                        <Link to={`/deals/${exp.dealId}`} className="text-sm text-navy-600 hover:underline">
                          {dealName}
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-600 text-right">
                      {formatINR(exp.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/expenses/${exp.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
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
            <span className="font-medium text-navy-900">{sorted.length}</span> expenses
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
