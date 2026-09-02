import { formatINR } from '../../../utils/format';
import type { BrokerReport } from '../../../services/reports/commercial-report';
import { Link } from 'react-router-dom';
import { Ban } from 'lucide-react';

interface BrokersViewProps {
  brokersReport: BrokerReport;
}

export function BrokersView({ brokersReport }: BrokersViewProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-navy-900">Broker Performance Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          {brokersReport.brokersDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Broker</th>
                  <th className="px-4 py-3 font-medium text-right">Total Leads</th>
                  <th className="px-4 py-3 font-medium text-right">Sold Leads</th>
                  <th className="px-4 py-3 font-medium text-right">Lead Conv. %</th>
                  <th className="px-4 py-3 font-medium text-right">Completed Deals</th>
                  <th className="px-4 py-3 font-medium text-right">Sales Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {brokersReport.brokersDetails.map((b) => (
                  <tr key={b.broker.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/brokers/${b.broker.id}`} className="font-medium text-navy-900 hover:underline">
                        {b.broker.name}
                      </Link>
                      <div className="text-xs text-slate-500">{b.broker.companyName || 'Independent'}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">{b.totalLeads}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">{b.soldLeads}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{b.conversionRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-bold text-navy-900">{b.completedDeals}</td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">{formatINR(b.salesValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No broker activity in the selected period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
