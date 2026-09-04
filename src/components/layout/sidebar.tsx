import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  FileText, 
  Receipt, 
  Users, 
  Contact, 
  Briefcase, 
  Handshake, 
  Landmark, 
  Percent, 
  Building2, 
  BarChart3, 
  UserCog, 
  Settings,
  Lightbulb
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../auth/auth-context';
import type { Permission } from '../../auth/permissions';

type NavItem = {
  name: string;
  to: string;
  icon: any;
  permission?: Permission;
};

type NavGroup = {
  section: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    section: 'WORKSPACE',
    items: [
      { name: 'Overview', to: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    section: 'OPERATIONS',
    items: [
      { name: 'Inventory', to: '/inventory', icon: Truck, permission: 'inventory.view' },
      { name: 'Documents', to: '/documents', icon: FileText, permission: 'documents.view' },
      { name: 'Expenses', to: '/expenses', icon: Receipt, permission: 'expenses.view' },
    ]
  },
  {
    section: 'COMMERCIAL',
    items: [
      { name: 'Leads', to: '/leads', icon: Contact, permission: 'leads.view' },
      { name: 'Customers', to: '/customers', icon: Users, permission: 'customers.view' },
      { name: 'Brokers', to: '/brokers', icon: Briefcase, permission: 'brokers.view' },
      { name: 'Deals', to: '/deals', icon: Handshake, permission: 'deals.view' },
    ]
  },
  {
    section: 'FINANCE',
    items: [
      { name: 'Loans', to: '/loans', icon: Landmark, permission: 'loans.view' },
      { name: 'Commissions', to: '/commissions', icon: Percent, permission: 'commissions.view' },
      { name: 'Partners', to: '/finance-partners', icon: Building2, permission: 'finance_partners.view' },
    ]
  },
  {
    section: 'ANALYTICS',
    items: [
      { name: 'Reports', to: '/reports', icon: BarChart3, permission: 'reports.view' },
      { name: 'Insights', to: '/insights', icon: Lightbulb, permission: 'insights.view' },
    ]
  },
  {
    section: 'ADMIN',
    items: [
      { name: 'Users', to: '/settings/users', icon: UserCog, permission: 'users.view' },
      { name: 'Settings', to: '/settings', icon: Settings, permission: 'settings.view' },
    ]
  }
];

export function Sidebar() {
  const { can } = useAuth();

  const filteredNavigation = navigation.map(group => ({
    ...group,
    items: group.items.filter(item => !item.permission || can(item.permission))
  })).filter(group => group.items.length > 0);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-navy-900 border-r border-slate-800 text-slate-300 h-screen sticky top-0 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Geometric mark */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm shadow-amber-500/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12L8 4L14 12H2Z" fill="#1e293b" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M5 12L8 7L11 12" fill="#f59e0b" stroke="#1e293b" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold text-white tracking-wide" style={{ fontVariant: 'small-caps', letterSpacing: '0.08em' }}>LUXUS</span>
              <span className="text-base font-light text-amber-400 tracking-wide"> TiS</span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-medium">Truck Inventory System</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        {filteredNavigation.map((group) => (
          <div key={group.section}>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {group.section}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      isActive 
                        ? "bg-slate-800 text-gold-DEFAULT" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Online
        </div>
      </div>
    </aside>
  );
}
