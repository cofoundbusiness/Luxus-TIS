import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Truck } from '../../types';
import { TruckStatusBadge } from './truck-status-badge';

interface TruckDetailHeaderProps {
  truck: Truck;
  onEdit: () => void;
  onDelete?: () => void;
}

export function TruckDetailHeader({ truck, onEdit, onDelete }: TruckDetailHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Inventory
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-navy-900">{truck.manufacturer} {truck.model}</h1>
            <TruckStatusBadge status={truck.status} />
          </div>
          <p className="text-slate-600">{truck.variant} • {truck.registrationNumber}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
