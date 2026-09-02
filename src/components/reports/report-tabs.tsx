import { Link, useLocation } from 'react-router-dom';

export const REPORT_TABS = [
  { id: 'overview', label: 'Overview', path: '/reports' },
  { id: 'inventory', label: 'Inventory', path: '/reports?tab=inventory' },
  { id: 'sales', label: 'Sales & Profit', path: '/reports?tab=sales' },
  { id: 'leads', label: 'Leads', path: '/reports?tab=leads' },
  { id: 'brokers', label: 'Brokers', path: '/reports?tab=brokers' },
  { id: 'finance', label: 'Finance', path: '/reports?tab=finance' },
  { id: 'commissions', label: 'Commissions', path: '/reports?tab=commissions' },
  { id: 'expenses', label: 'Expenses', path: '/reports?tab=expenses' },
];

export function ReportTabs() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';

  return (
    <div className="px-6 border-b border-slate-200 bg-white">
      <nav className="flex space-x-8 overflow-x-auto hide-scrollbar" aria-label="Tabs">
        {REPORT_TABS.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${isActive
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
