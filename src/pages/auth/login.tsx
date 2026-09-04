import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/auth-context';
import { DevAccess } from '../../components/auth/dev-access';
import { Truck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Safety: hide password on blur/visibility change
  const hidePassword = useCallback(() => {
    setIsPasswordRevealed(false);
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', hidePassword);
    window.addEventListener('blur', hidePassword);
    return () => {
      document.removeEventListener('visibilitychange', hidePassword);
      window.removeEventListener('blur', hidePassword);
    };
  }, [hidePassword]);

  // Ensure hidden on unmount
  useEffect(() => {
    return () => setIsPasswordRevealed(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Available when account infrastructure is connected.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-navy-900 rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900 tracking-tight">LUXUS TiS</h1>
            <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Truck Inventory System</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md text-center font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-shadow text-slate-900" 
                placeholder="admin@luxustis.local"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs font-medium text-navy-600 hover:text-navy-800 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input 
                  type={isPasswordRevealed ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-11 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-shadow text-slate-900" 
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  title="Hold to reveal password"
                  aria-label={isPasswordRevealed ? "Password revealed, release to hide" : "Hold to reveal password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:rounded transition-colors"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    setIsPasswordRevealed(true);
                  }}
                  onPointerUp={hidePassword}
                  onPointerLeave={hidePassword}
                  onPointerCancel={hidePassword}
                  onKeyDown={(e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                      e.preventDefault();
                      setIsPasswordRevealed(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      hidePassword();
                    }
                  }}
                  onBlur={hidePassword}
                  tabIndex={0}
                >
                  {isPasswordRevealed ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-navy-900" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                Remember me
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-md transition-colors shadow-sm"
            >
              Sign In
            </button>
          </form>

          {import.meta.env.VITE_APP_ENV === 'development' && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <DevAccess />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}