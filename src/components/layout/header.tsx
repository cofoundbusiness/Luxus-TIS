import { Bell, HelpCircle, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { GlobalSearch } from './global-search';
import { useAuth } from '../../auth/auth-context';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentUser, logout, can } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/auth/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const userName = currentUser?.name || 'User Name';
  const userRole = currentUser?.role || 'Administrator';
  const roleDisplay = userRole.charAt(0) + userRole.slice(1).toLowerCase();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 flex-shrink-0">
      
      {/* Global Search */}
      <GlobalSearch />

      {/* Right side actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-4">
        <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-50 rounded-lg transition-colors relative">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <button className="hidden sm:block p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-50 rounded-lg transition-colors">
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        {/* User Menu */}
        <div className="relative ml-1">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-1"
          >
            <div className="h-7 w-7 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(userName)}
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-medium text-navy-900 leading-none mb-0.5">{userName}</span>
              <span className="text-[10px] text-slate-500 leading-none">{roleDisplay}</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-30 border border-slate-100">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-sm font-medium text-navy-900">{userName}</p>
                  <p className="text-xs text-slate-500">{roleDisplay}</p>
                </div>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <User className="h-4 w-4 text-slate-400" />
                  Profile
                </a>
                {can('settings.view') && (
                  <button onClick={() => navigate('/settings')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <SettingsIcon className="h-4 w-4 text-slate-400" />
                    Settings
                  </button>
                )}
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
