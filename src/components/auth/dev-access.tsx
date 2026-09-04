import { useState } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../auth/auth-context';
import { useNavigate } from 'react-router-dom';
import { Code, ChevronDown } from 'lucide-react';

export function DevAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const { devAccessLogin } = useAuth();
  const navigate = useNavigate();

  const handleDevLogin = async (role: UserRole) => {
    try {
      await devAccessLogin(role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const roles: { role: UserRole; label: string }[] = [
    { role: 'ADMINISTRATOR', label: 'Administrator' },
    { role: 'MANAGER', label: 'Manager' },
    { role: 'SALES', label: 'Sales' },
    { role: 'OPERATIONS', label: 'Operations' },
    { role: 'FINANCE', label: 'Finance' },
    { role: 'VIEWER', label: 'Viewer' }
  ];

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-200 rounded-md bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <Code className="h-4 w-4" />
        Dev Access
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-md shadow-lg p-3 z-10">
          <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Choose demo role:</div>
          <div className="space-y-1">
            {roles.map(({ role, label }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDevLogin(role)}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-900 rounded-md transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
