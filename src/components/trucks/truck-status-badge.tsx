import { cn } from '../../utils/cn';

interface TruckStatusBadgeProps {
  status: string;
  className?: string;
}

export function TruckStatusBadge({ status, className }: TruckStatusBadgeProps) {
  let styles = '';
  let label = status.replace('_', ' ');

  switch (status) {
    case 'AVAILABLE':
      styles = 'bg-green-100 text-green-800';
      break;
    case 'RESERVED':
      styles = 'bg-blue-100 text-blue-800';
      break;
    case 'UNDER_PREPARATION':
      styles = 'bg-amber-100 text-amber-800';
      break;
    case 'PENDING_DOCUMENTS':
      styles = 'bg-red-100 text-red-800';
      break;
    case 'SOLD':
      styles = 'bg-slate-200 text-slate-800';
      break;
    default:
      styles = 'bg-slate-100 text-slate-700';
  }

  return (
    <span className={cn("text-xs font-medium px-2 py-1 rounded", styles, className)}>
      {label}
    </span>
  );
}
