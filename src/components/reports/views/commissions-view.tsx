import { formatINR, formatDate } from '../../../utils/format';
import type { CommissionReport } from '../../../services/reports/finance-report';
import { Link } from 'react-router-dom';
import { Ban, AlertCircle } from 'lucide-react';

interface CommissionsViewProps {
  commissions: CommissionReport;
}

export function CommissionsView({ commissions }: CommissionsViewProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Paid Commissions</div>
          <div className="text-xl font-bold text-emerald-600">{formatINR(commissions.paidValue)}</div>
          <div className="text-xs text-slate-600 mt-1">{commissions.paidCount} paid records</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Pending Commissions</div>
          <div className="text-xl font-bold text-amber-600">{formatINR(commissions.pendingValue)}</div>
          <div className="text-xs text-slate-600 mt-1">{commissions.pendingCount + commissions.partialCount} pending records</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Finance vs Broker</div>
          <div className="text-sm font-bold text-navy-900 mt-1">F: {formatINR(commissions.financeCommissionTotal)}</div>
          <div className="text-sm font-bold text-slate-600">B: {formatINR(commissions.brokerCommissionTotal)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Overdue</div>
          <div className={`text-xl font-bold flex items-center gap-2 ${commissions.overdueCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
            {commissions.overdueCount} Records
            {commissions.overdueCount > 0 && <AlertCircle className="w-4 h-4" />}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-navy-900">Commission Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          {commissions.commissionDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Ref ID</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Deal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions.commissionDetails.map(({ commission: c, isOverdue }) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/commissions/${c.id}`} className="font-medium text-navy-900 hover:underline">
                        {c.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{c.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/deals/${c.dealId}`} className="text-navy-600 hover:underline">Deal {c.dealId}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        c.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(c.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {c.dueDate ? formatDate(c.dueDate) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No commission records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
