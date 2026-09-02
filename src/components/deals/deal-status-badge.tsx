import { cn } from '../../utils/cn';

interface DealStatusBadgeProps {
  status: string;
  className?: string;
}

export function DealStatusBadge({ status, className }: DealStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'NEGOTIATION': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'BOOKED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'CANCELLED': return 'bg-slate-100 text-slate-700 border border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-sm", getStyle(), className)}>
      {status}
    </span>
  );
}
