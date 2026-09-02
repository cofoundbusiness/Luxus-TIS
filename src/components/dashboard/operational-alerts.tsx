import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface AlertData {
  id: string;
  severity: 'Critical' | 'Warning' | 'Attention' | 'Info';
  title: string;
  message: string;
  link: string;
}

interface OperationalAlertsProps {
  alerts: AlertData[];
}

const getIcon = (severity: string) => {
  switch (severity) {
    case 'Critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
    case 'Warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case 'Attention': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    default: return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getBgColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-red-50 border-red-100';
    case 'Warning': return 'bg-amber-50 border-amber-100';
    case 'Attention': return 'bg-orange-50 border-orange-100';
    default: return 'bg-blue-50 border-blue-100';
  }
};

export function OperationalAlerts({ alerts }: OperationalAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 h-full">
        <h2 className="text-base font-semibold text-navy-900 mb-4">Operational Attention</h2>
        <div className="flex flex-col items-center justify-center text-center h-32 border border-dashed border-slate-200 rounded-lg">
          <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-sm font-medium text-slate-600">All clear</p>
          <p className="text-xs text-slate-400">No operational alerts to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 h-full">
      <h2 className="text-base font-semibold text-navy-900 mb-4">Operational Attention</h2>
      <div className="space-y-3">
        {alerts.map(alert => (
          <Link key={alert.id} to={alert.link} className="block group">
            <div className={cn("p-3 rounded-lg border flex items-start gap-3 transition-colors", getBgColor(alert.severity))}>
              <div className="shrink-0 mt-0.5">{getIcon(alert.severity)}</div>
              <div>
                <h4 className="text-sm font-semibold text-navy-900 group-hover:underline">{alert.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
