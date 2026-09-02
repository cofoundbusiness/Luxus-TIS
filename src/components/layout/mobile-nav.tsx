import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Menu, 
  X, 
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
  LineChart, 
  UserCog, 
  Settings 
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
      { name: 'Loans', to: '/finance/loans', icon: Landmark },
      { name: 'Commissions', to: '/finance/commissions', icon: Percent },
      { name: 'Partners', to: '/finance/partners', icon: Building2 },
    ]
  },
  {
    section: 'ANALYTICS',
    items: [
      { name: 'Reports', to: '/reports', icon: BarChart3 },
      { name: 'Insights', to: '/reports/profit', icon: LineChart },
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center p-4 bg-navy-900 text-white sticky top-0 z-20">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 mr-2 hover:bg-slate-800 rounded-md transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight">LUXUS TiS</span>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-72 bg-navy-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight">LUXUS TiS</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Truck Inventory System</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
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
      </div>
    </>
  );
}
