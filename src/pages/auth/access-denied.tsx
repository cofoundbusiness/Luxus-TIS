import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center p-4">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
        <ShieldAlert className="h-12 w-12 text-amber-500" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-navy-900">Access Restricted</h1>
      <p className="mb-8 text-center text-slate-500 max-w-md">
        You don't have permission to access this area. If you believe this is a mistake, please contact your administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
        <Link 
          to="/dashboard"
          className="flex items-center justify-center gap-2 rounded-md bg-navy-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-navy-800 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
