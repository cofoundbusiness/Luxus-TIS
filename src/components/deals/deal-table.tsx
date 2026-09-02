import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate, formatINR } from '../../utils/format';
import { DealStatusBadge } from './deal-status-badge';
import type { DealContext } from '../../services/deals/deal-service';

interface DealTableProps {
  deals: DealContext[];
}

type SortField = 'id' | 'salePrice' | 'saleDate' | 'profit' | 'status' | 'customer' | 'broker';

export function DealTable({ deals }: DealTableProps) {
  const [sortField, setSortField] = useState<SortField>('saleDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'saleDate' && field !== 'salePrice' && field !== 'profit');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...deals].sort((a, b) => {
    let valA: any = a.deal.id;
    let valB: any = b.deal.id;

    if (sortField === 'salePrice') {
      valA = a.deal.salePrice;
      valB = b.deal.salePrice;
    } else if (sortField === 'saleDate') {
      valA = new Date(a.deal.saleDate).getTime();
      valB = new Date(b.deal.saleDate).getTime();
    } else if (sortField === 'profit') {
      valA = a.realizedProfit ?? -Infinity;
      valB = b.realizedProfit ?? -Infinity;
    } else if (sortField === 'status') {
      valA = a.deal.status;
      valB = b.deal.status;
    } else if (sortField === 'customer') {
      valA = a.customer?.name || '';
      valB = b.customer?.name || '';
    } else if (sortField === 'broker') {
      valA = a.broker?.name || '';
      valB = b.broker?.name || '';
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
                <div className="flex items-center gap-1">Deal {getSortIcon('id')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Truck</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('customer')}>
                <div className="flex items-center gap-1">Customer {getSortIcon('customer')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('broker')}>
                <div className="flex items-center gap-1">Broker {getSortIcon('broker')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('saleDate')}>
                <div className="flex items-center gap-1">Date {getSortIcon('saleDate')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('salePrice')}>
                <div className="flex items-center justify-end gap-1">Sale Price {getSortIcon('salePrice')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('profit')}>
                <div className="flex items-center justify-end gap-1">Profit {getSortIcon('profit')}</div>
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
                  No deals found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { deal, truck, customer, broker, realizedProfit } = ctx;

                return (
                  <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/deals/${deal.id}`} className="font-medium text-navy-900 hover:underline">
                        Deal {deal.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {truck ? (
                        <div className="max-w-[180px] truncate">
                          <Link to={`/inventory/${truck.id}`} className="font-medium text-navy-700 hover:underline text-sm truncate block">
                            {truck.registrationNumber}
                          </Link>
                          <span className="text-xs text-slate-500 truncate block">{truck.manufacturer} {truck.model}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unknown Truck</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {customer ? (
                        <div className="max-w-[150px] truncate">
                          <Link to={`/customers/${customer.id}`} className="text-slate-800 hover:underline hover:text-navy-900 block truncate">
                            {customer.name}
                          </Link>
                          {customer.companyName && <span className="text-xs text-slate-500 truncate block">{customer.companyName}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {broker ? (
                        <Link to={`/brokers/${broker.id}`} className="text-slate-700 hover:underline max-w-[120px] truncate block">
                          {broker.name}
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Direct</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(deal.saleDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(deal.salePrice)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {realizedProfit !== null ? (
                        <span className="font-medium text-emerald-700">{formatINR(realizedProfit)}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <DealStatusBadge status={deal.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/deals/${deal.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
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
            <span className="font-medium text-navy-900">{sorted.length}</span> deals
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
