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

const navigation = [
  {
    section: 'WORKSPACE',
    items: [
      { name: 'Overview', to: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    section: 'OPERATIONS',
    items: [
      { name: 'Inventory', to: '/inventory', icon: Truck },
      { name: 'Documents', to: '/documents', icon: FileText },
      { name: 'Expenses', to: '/expenses', icon: Receipt },
    ]
  },
  {
    section: 'COMMERCIAL',
    items: [
      { name: 'Leads', to: '/leads', icon: Contact },
      { name: 'Customers', to: '/customers', icon: Users },
      { name: 'Brokers', to: '/brokers', icon: Briefcase },
      { name: 'Deals', to: '/deals', icon: Handshake },
    ]
  },
  {
    section: 'FINANCE',
    items: [
      { name: 'Loans', to: '/loans', icon: Landmark },
      { name: 'Commissions', to: '/commissions', icon: Percent },
      { name: 'Partners', to: '/finance-partners', icon: Building2 },
    ]
  },
  {
    section: 'ANALYTICS',
    items: [
      { name: 'Reports', to: '/reports', icon: BarChart3 },
      { name: 'Insights', to: '/insights', icon: Lightbulb },
    ]
  },
  {
    section: 'ADMIN',
    items: [
      { name: 'Users', to: '/settings/users', icon: UserCog },
      { name: 'Settings', to: '/settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-navy-900 border-r border-slate-800 text-slate-300 h-screen sticky top-0 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-tight">LUXUS TiS</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Truck Inventory System</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        {navigation.map((group) => (
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
