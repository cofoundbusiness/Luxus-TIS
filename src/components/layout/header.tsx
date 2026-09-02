import { Search, Bell, HelpCircle, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 flex-shrink-0">
      
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-navy-900 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-navy-900 focus:border-navy-900 sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <button className="hidden sm:block p-2 text-slate-400 hover:text-navy-900 hover:bg-slate-50 rounded-full transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* User Menu */}
        <div className="relative ml-2">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-1"
          >
            <div className="h-7 w-7 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-medium">
              UN
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-medium text-navy-900 leading-none mb-1">User Name</span>
              <span className="text-[10px] text-slate-500 leading-none">Administrator</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-30 border border-slate-100">
                <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p className="text-sm font-medium text-navy-900">User Name</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <User className="h-4 w-4 text-slate-400" />
                  Profile
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <SettingsIcon className="h-4 w-4 text-slate-400" />
                  Settings
                </a>
                <div className="border-t border-slate-100 my-1"></div>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign out
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
