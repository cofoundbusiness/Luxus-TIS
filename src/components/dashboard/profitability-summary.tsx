import { formatINR } from '../../utils/format';

interface ProfitabilitySummaryProps {
  data: {
    currentInventoryCost: number;
    estimatedInventoryGrossProfit: number;
    completedDealRevenue: number;
    completedDealProfit: number;
    financeCommissionReceived: number;
    brokerCommissionPaid: number;
    brokerCommissionPending: number;
  };
}

export function ProfitabilitySummary({ data }: ProfitabilitySummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 h-full">
      <h2 className="text-base font-semibold text-navy-900 mb-4">Business Snapshot</h2>
      
      <div className="space-y-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Inventory Potential</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Current Inv. Cost</p>
              <p className="text-sm font-semibold text-navy-900">{formatINR(data.currentInventoryCost)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Est. Gross Profit</p>
              <p className="text-sm font-semibold text-green-600">{formatINR(data.estimatedInventoryGrossProfit)}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Completed Operations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Deal Revenue</p>
              <p className="text-sm font-semibold text-navy-900">{formatINR(data.completedDealRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Deal Net Profit</p>
              <p className="text-sm font-semibold text-green-600">{formatINR(data.completedDealProfit)}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Commissions (Completed)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Finance Comm. (In)</p>
              <p className="text-sm font-semibold text-blue-600">{formatINR(data.financeCommissionReceived)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Broker Comm. (Out)</p>
              <p className="text-sm font-semibold text-red-600">{formatINR(data.brokerCommissionPaid)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
