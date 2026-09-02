import { formatINR, formatDate } from '../../../utils/format';
import type { SalesReport } from '../../../services/reports/sales-report';
import { Link } from 'react-router-dom';
import { TrendingUp, FileText, Ban, Handshake } from 'lucide-react';

interface SalesViewProps {
  sales: SalesReport;
}

export function SalesView({ sales }: SalesViewProps) {
  return (
    <div className="p-6 space-y-6">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Realized Revenue</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(sales.totalSalesValue)}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">{sales.completedDeals} completed deals</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Realized Profit</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(sales.totalRealizedProfit)}</div>
          <div className="text-xs text-slate-500 mt-1">Avg Margin: <strong className="text-navy-900">{sales.averageProfitMargin.toFixed(1)}%</strong></div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Average Sale Value</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(sales.averageSaleValue)}</div>
          <div className="text-xs text-slate-500 mt-1">Per completed deal</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Average Profit</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(sales.averageDealProfit)}</div>
          <div className="text-xs text-slate-500 mt-1">Per completed deal</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deal Status Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Handshake className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-sm text-navy-900">Pipeline Status</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Negotiation</span>
              <span className="font-bold text-navy-900">{sales.negotiationDeals}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Booked</span>
              <span className="font-bold text-navy-900">{sales.bookedDeals}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Completed (Realized)</span>
              <span className="font-bold text-emerald-600">{sales.completedDeals}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
              <span className="text-slate-500">Cancelled</span>
              <span className="font-medium text-slate-600">{sales.cancelledDeals}</span>
            </div>
          </div>
        </div>

        {/* Sales by Manufacturer */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-sm text-navy-900">Completed by Manufacturer</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(sales.salesByManufacturer).length > 0 ? (
              Object.entries(sales.salesByManufacturer).sort((a,b) => b[1] - a[1]).map(([mfg, count]) => (
                <div key={mfg} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{mfg}</span>
                  <span className="font-bold text-navy-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No completed sales</div>
            )}
          </div>
        </div>

        {/* Sales by Broker */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-sm text-navy-900">Completed by Channel</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(sales.salesByBroker).length > 0 ? (
              Object.entries(sales.salesByBroker).sort((a,b) => b[1] - a[1]).map(([broker, count]) => (
                <div key={broker} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{broker}</span>
                  <span className="font-bold text-navy-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No completed sales</div>
            )}
          </div>
        </div>

      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-navy-900">Transaction Profitability</h3>
        </div>
        <div className="overflow-x-auto">
          {sales.dealDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Deal</th>
                  <th className="px-4 py-3 font-medium">Truck</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Sale Price</th>
                  <th className="px-4 py-3 font-medium text-right">Net Profit</th>
                  <th className="px-4 py-3 font-medium text-right">Margin</th>
                  <th className="px-4 py-3 font-medium text-right">Sale Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.dealDetails.map(({ deal, truck, profit, margin }) => (
                  <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/deals/${deal.id}`} className="font-medium text-navy-900 hover:underline">
                        {deal.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {truck ? `${truck.manufacturer} ${truck.model}` : 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        deal.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        deal.status === 'CANCELLED' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(deal.salePrice)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {deal.status === 'COMPLETED' ? (
                        <span className={`font-medium ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatINR(profit)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Unrealized</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {deal.status === 'COMPLETED' ? (
                        <span className="text-slate-600">{margin.toFixed(1)}%</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 text-xs">
                      {formatDate(deal.saleDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No deals match the selected period.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
