import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import type { Truck } from '../../types';
import { formatINR } from '../../utils/format';
import { TruckStatusBadge } from './truck-status-badge';
import { getTruckProfit, getInventoryAge, checkDocumentWarning } from '../../services/inventory-service';

interface InventoryTableProps {
  trucks: Truck[];
}

type SortField = 'purchaseDate' | 'year' | 'mileage' | 'purchasePrice' | 'sellingPrice' | 'expectedProfit';

export function InventoryTable({ trucks }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('purchaseDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'purchaseDate'); // default desc for dates
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />; // spacer
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sortedTrucks = [...trucks].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (sortField === 'purchaseDate') {
      valA = new Date(a.purchaseDate).getTime();
      valB = new Date(b.purchaseDate).getTime();
    } else if (sortField === 'expectedProfit') {
      valA = getTruckProfit(a);
      valB = getTruckProfit(b);
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTrucks.length / rowsPerPage);
  const paginatedTrucks = sortedTrucks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Truck</th>
              <th className="px-4 py-3 font-medium">Registration</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('year')}>
                <div className="flex items-center gap-1">Year {getSortIcon('year')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('mileage')}>
                <div className="flex items-center gap-1">Mileage {getSortIcon('mileage')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('purchasePrice')}>
                <div className="flex items-center justify-end gap-1">Purchase {getSortIcon('purchasePrice')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('sellingPrice')}>
                <div className="flex items-center justify-end gap-1">Selling {getSortIcon('sellingPrice')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors text-right" onClick={() => handleSort('expectedProfit')}>
                <div className="flex items-center justify-end gap-1">Profit {getSortIcon('expectedProfit')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Status & Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTrucks.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                  No trucks found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedTrucks.map(truck => {
                const profit = getTruckProfit(truck);
                const age = getInventoryAge(truck.purchaseDate);
                const hasDocWarning = checkDocumentWarning(truck);
                const isOver90Days = truck.status !== 'SOLD' && age > 90;

                return (
                  <tr key={truck.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/inventory/${truck.id}`} className="font-semibold text-navy-900 hover:underline">
                        {truck.manufacturer} {truck.model}
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">{truck.variant}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-700">{truck.registrationNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{truck.year}</td>
                    <td className="px-4 py-3 text-slate-600">{truck.mileage.toLocaleString()} km</td>
                    <td className="px-4 py-3 text-slate-600">{truck.location}</td>
                    <td className="px-4 py-3 font-medium text-navy-900 text-right">{formatINR(truck.purchasePrice)}</td>
                    <td className="px-4 py-3 font-medium text-navy-900 text-right">{formatINR(truck.sellingPrice)}</td>
                    <td className="px-4 py-3 font-medium text-green-600 text-right">{formatINR(profit)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TruckStatusBadge status={truck.status} />
                        {hasDocWarning && (
                          <div title="Document attention required" className="text-red-500 cursor-help">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className={`text-xs mt-1 font-medium ${isOver90Days ? 'text-red-600' : 'text-slate-400'}`}>
                        {truck.status !== 'SOLD' ? `${age} days in stock` : 'Sold'}
                      </div>
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
            <span className="font-medium text-navy-900">{Math.min(page * rowsPerPage, sortedTrucks.length)}</span> of{' '}
            <span className="font-medium text-navy-900">{sortedTrucks.length}</span> trucks
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
