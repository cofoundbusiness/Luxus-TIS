import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DocumentStatusBadgeProps {
  status: string;
  className?: string;
  iconOnly?: boolean;
}

export function DocumentStatusBadge({ status, className, iconOnly }: DocumentStatusBadgeProps) {
  if (status === 'AVAILABLE') {
    return (
      <span className={cn("inline-flex items-center gap-1 font-medium", iconOnly ? "" : "px-2 py-0.5 rounded text-[11px] uppercase tracking-wider bg-green-100 text-green-800", className)}>
        <CheckCircle className={iconOnly ? "w-4 h-4 text-green-600" : "w-3 h-3"} />
        {!iconOnly && "Available"}
      </span>
    );
  }
  
  if (status === 'PENDING') {
    return (
      <span className={cn("inline-flex items-center gap-1 font-medium", iconOnly ? "" : "px-2 py-0.5 rounded text-[11px] uppercase tracking-wider bg-amber-100 text-amber-800", className)}>
        <Clock className={iconOnly ? "w-4 h-4 text-amber-600" : "w-3 h-3"} />
        {!iconOnly && "Pending"}
      </span>
    );
  }
  
  if (status === 'EXPIRED') {
    return (
      <span className={cn("inline-flex items-center gap-1 font-medium", iconOnly ? "" : "px-2 py-0.5 rounded text-[11px] uppercase tracking-wider bg-red-100 text-red-800", className)}>
        <AlertCircle className={iconOnly ? "w-4 h-4 text-red-600" : "w-3 h-3"} />
        {!iconOnly && "Expired"}
      </span>
    );
  }

  return null;
}
