import { formatINR } from '../../../utils/format';
import type { FinanceReport } from '../../../services/reports/finance-report';
import { Link } from 'react-router-dom';
import { Ban, Building2 } from 'lucide-react';

interface FinanceViewProps {
  finance: FinanceReport;
}

export function FinanceView({ finance }: FinanceViewProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Loan Value</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(finance.totalLoanValue)}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">{finance.disbursed} disbursed loans</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Expected Commission</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(finance.expectedCommission)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Received Commission</div>
          <div className="text-xl font-bold text-emerald-600">{formatINR(finance.receivedCommission)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Outstanding Pipeline</div>
          <div className="text-xl font-bold text-amber-600">{formatINR(finance.outstandingCommission)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-sm text-navy-900">Application Status</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Application</span><span className="font-bold text-navy-900">{finance.applications}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Processing</span><span className="font-bold text-navy-900">{finance.processing}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Approved</span><span className="font-bold text-emerald-600">{finance.approved}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Disbursed</span><span className="font-bold text-emerald-600">{finance.disbursed}</span></div>
            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-2"><span className="text-slate-500">Rejected</span><span className="font-bold text-red-600">{finance.rejected}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-sm text-navy-900">Partner Performance</h3>
        </div>
        <div className="overflow-x-auto">
          {finance.partnerDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Finance Partner</th>
                  <th className="px-4 py-3 font-medium text-right">Total Apps</th>
                  <th className="px-4 py-3 font-medium text-right">Disbursed</th>
                  <th className="px-4 py-3 font-medium text-right">Rejected</th>
                  <th className="px-4 py-3 font-medium text-right">Loan Value</th>
                  <th className="px-4 py-3 font-medium text-right">Expected Comm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {finance.partnerDetails.map((p) => (
                  <tr key={p.partner.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/finance-partners/${p.partner.id}`} className="font-medium text-navy-900 hover:underline">
                        {p.partner.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">{p.totalLoans}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">{p.disbursed}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">{p.rejected}</td>
                    <td className="px-4 py-3 text-right font-bold text-navy-900">{formatINR(p.loanValue)}</td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">{formatINR(p.expectedCommission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No partner data for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
