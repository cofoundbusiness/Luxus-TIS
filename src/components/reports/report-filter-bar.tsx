import { Calendar } from 'lucide-react';
import type { DateRange } from '../../utils/date-utils';

interface ReportFilterBarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function ReportFilterBar({ dateRange, onDateRangeChange }: ReportFilterBarProps) {
  const options: { value: DateRange; label: string }[] = [
    { value: 'ALL_TIME', label: 'All Time' },
    { value: 'TODAY', label: 'Today' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'THIS_MONTH', label: 'This Month' },
    { value: 'THIS_YEAR', label: 'This Year' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Report Period:</span>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-md">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => onDateRangeChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                dateRange === opt.value
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="text-xs text-slate-500">
        Reference Date: <span className="font-medium text-slate-700">Sep 1, 2026</span>
      </div>
    </div>
  );
}
