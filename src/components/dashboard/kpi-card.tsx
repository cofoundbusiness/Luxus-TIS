import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KpiCardProps {
  label: string;
  value: string | number;
  context: string;
  Icon: LucideIcon;
  linkTo?: string;
  className?: string;
}

export function KpiCard({ label, value, context, Icon, linkTo, className }: KpiCardProps) {
  const content = (
    <div className={cn("bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow", className)}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-500">{label}</h3>
        <div className="p-2 bg-slate-50 rounded-md">
          <Icon className="w-4 h-4 text-navy-800" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-navy-900">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{context}</p>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block">{content}</Link>;
  }
  return content;
}
