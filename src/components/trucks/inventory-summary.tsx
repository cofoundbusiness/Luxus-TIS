import { formatINR } from '../../utils/format';

interface InventorySummaryProps {
  summary: {
    total: number;
    available: number;
    reserved: number;
    underPrep: number;
    pendingDocs: number;
    sold: number;
    inventoryValue: number;
  };
}

export function InventorySummary({ summary }: InventorySummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 mb-1">Total Trucks</div>
        <div className="text-lg font-semibold text-navy-900">{summary.total}</div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 mb-1">Available</div>
        <div className="text-lg font-semibold text-green-600">{summary.available}</div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 mb-1">Reserved</div>
        <div className="text-lg font-semibold text-blue-600">{summary.reserved}</div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 mb-1">Under Prep</div>
        <div className="text-lg font-semibold text-amber-600">{summary.underPrep}</div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 mb-1">Pending Docs</div>
        <div className="text-lg font-semibold text-red-600">{summary.pendingDocs}</div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 mb-1">Sold</div>
        <div className="text-lg font-semibold text-slate-700">{summary.sold}</div>
      </div>
      <div className="bg-white p-3 rounded-lg border border-slate-200 bg-navy-50 border-navy-100">
        <div className="text-xs text-navy-600 mb-1">Unsold Value</div>
        <div className="text-lg font-semibold text-navy-900">{formatINR(summary.inventoryValue)}</div>
      </div>
    </div>
  );
}
