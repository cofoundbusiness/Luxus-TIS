import { cn } from '../../utils/cn';

interface LeadStatusBadgeProps {
  status: string;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-indigo-100 text-indigo-800';
      case 'INTERESTED': return 'bg-purple-100 text-purple-800';
      case 'NEGOTIATION': return 'bg-amber-100 text-amber-800';
      case 'BOOKED': return 'bg-green-100 text-green-800';
      case 'SOLD': return 'bg-emerald-100 text-emerald-800';
      case 'LOST': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider", getStyle(), className)}>
      {status}
    </span>
  );
}

export function LeadFollowUpBadge({ status, className }: { status: 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'NONE', className?: string }) {
  if (status === 'NONE') return null;
  
  const getStyle = () => {
    switch (status) {
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'TODAY': return 'bg-amber-100 text-amber-800';
      case 'UPCOMING': return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider", getStyle(), className)}>
      {status}
    </span>
  );
}
