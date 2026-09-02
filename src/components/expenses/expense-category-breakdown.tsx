import { formatINR } from '../../utils/format';

interface ExpenseCategoryBreakdownProps {
  breakdown: Record<string, number>;
}

export function ExpenseCategoryBreakdown({ breakdown }: ExpenseCategoryBreakdownProps) {
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  if (total === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Expenses by Category</h3>
      <div className="flex flex-wrap gap-4 md:gap-8">
        {Object.entries(breakdown).map(([category, amount]) => (
          <div key={category} className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">{category}</span>
            <span className="text-sm font-bold text-navy-900">{formatINR(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
