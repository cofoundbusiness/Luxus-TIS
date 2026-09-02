import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Truck, 
  Contact, 
  Handshake, 
  BarChart3,
  MapPinOff
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-slate-50/50">
      
      {/* Main 404 Container */}
      <div className="w-full max-w-2xl text-center flex flex-col items-center animate-in fade-in duration-500">
        
        {/* Visual Graphic */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-sm relative z-10">
            <Truck className="w-16 h-16 text-navy-900" />
          </div>
          <div className="absolute -top-2 -right-4 w-12 h-12 bg-amber-50 rounded-full border border-amber-200 shadow-sm flex items-center justify-center z-20">
            <MapPinOff className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Text Content */}
        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">
          Sorry, the page you are looking for doesn't exist
        </p>
        
        <h1 className="text-8xl font-black text-navy-900 tracking-tighter leading-none mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-slate-700 tracking-tight mb-4">
          PAGE NOT FOUND
        </h2>
        
        <p className="text-base text-slate-600 max-w-md mx-auto mb-10">
          It looks like this route has taken a wrong turn. Let's get you back on the right road.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link 
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-2.5 bg-navy-900 text-white rounded-md text-sm font-medium hover:bg-navy-800 transition-colors shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-navy-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Previous Page
          </button>
        </div>

      </div>

      {/* Quick Navigation Recovery */}
      <div className="w-full max-w-3xl mt-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-4">
          Quick Navigation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/inventory" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:shadow transition-all group">
            <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-navy-900">Inventory</span>
          </Link>
          <Link to="/leads" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:shadow transition-all group">
            <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors">
              <Contact className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-navy-900">Leads</span>
          </Link>
          <Link to="/deals" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:shadow transition-all group">
            <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors">
              <Handshake className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-navy-900">Deals</span>
          </Link>
          <Link to="/reports" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 hover:shadow transition-all group">
            <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-navy-50 group-hover:text-navy-700 transition-colors">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-navy-900">Reports</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2026 LUXUS TiS &mdash; Truck Inventory System.
        </p>
      </div>

    </div>
  );
}
