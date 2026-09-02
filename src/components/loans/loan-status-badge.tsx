import { cn } from '../../utils/cn';
import { LoanStatus } from '../../types/enums';

interface LoanStatusBadgeProps {
  status: string;
  className?: string;
}

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps) {
  const getStyle = () => {
    switch (status as LoanStatus) {
      case 'APPLICATION': return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'APPROVED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'DISBURSED': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-sm", getStyle(), className)}>
      {status}
    </span>
  );
}
