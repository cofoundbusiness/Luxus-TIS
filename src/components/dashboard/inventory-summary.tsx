import { formatINR } from '../../utils/format';

interface InventorySummaryProps {
  data: {
    available: number;
    reserved: number;
    underPrep: number;
    pendingDocs: number;
    sold: number;
    aging: {
      '0-30': number;
      '31-60': number;
      '61-90': number;
      '90+': number;
    }
  };
  totalValue: number;
}

export function InventorySummary({ data, totalValue }: InventorySummaryProps) {
  const totalActive = data.available + data.reserved + data.underPrep + data.pendingDocs;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-navy-900">Inventory Position</h2>
        <div className="text-right">
          <p className="text-xs text-slate-500">Unsold Value</p>
          <p className="text-sm font-semibold text-navy-900">{formatINR(totalValue)}</p>
        </div>
      </div>

      <div className="flex w-full h-3 rounded-full overflow-hidden mb-4 bg-slate-100">
        <div style={{ width: `${(data.available / totalActive) * 100}%` }} className="bg-green-600"></div>
        <div style={{ width: `${(data.reserved / totalActive) * 100}%` }} className="bg-blue-600"></div>
        <div style={{ width: `${(data.underPrep / totalActive) * 100}%` }} className="bg-amber-500"></div>
        <div style={{ width: `${(data.pendingDocs / totalActive) * 100}%` }} className="bg-red-500"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-8">
        <div>
          <div className="flex items-center gap-2 text-slate-600"><span className="w-2 h-2 rounded-full bg-green-600"></span> Available</div>
          <div className="font-semibold text-navy-900 mt-1">{data.available}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-slate-600"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Reserved</div>
          <div className="font-semibold text-navy-900 mt-1">{data.reserved}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Under Prep</div>
          <div className="font-semibold text-navy-900 mt-1">{data.underPrep}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-slate-600"><span className="w-2 h-2 rounded-full bg-red-500"></span> Pending Docs</div>
          <div className="font-semibold text-navy-900 mt-1">{data.pendingDocs}</div>
        </div>
      </div>

      <h3 className="text-sm font-medium text-navy-900 mb-3 border-t border-slate-100 pt-4">Inventory Aging</h3>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-slate-500 mb-1">0-30d</div>
          <div className="font-semibold">{data.aging['0-30']}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-slate-500 mb-1">31-60d</div>
          <div className="font-semibold">{data.aging['31-60']}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-100">
          <div className="text-slate-500 mb-1">61-90d</div>
          <div className="font-semibold">{data.aging['61-90']}</div>
        </div>
        <div className="bg-red-50 p-2 rounded border border-red-100 text-red-900">
          <div className="mb-1 font-medium">90+ days</div>
          <div className="font-bold">{data.aging['90+']}</div>
        </div>
      </div>
    </div>
  );
}
