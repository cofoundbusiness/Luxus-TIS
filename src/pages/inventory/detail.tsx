import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TruckDetailHeader } from '../../components/trucks/truck-detail-header';
import { TruckOverview } from '../../components/trucks/truck-overview';
import { TruckFinancialSummary } from '../../components/trucks/truck-financial-summary';
import { TruckDocuments } from '../../components/trucks/truck-documents';
import { TruckExpenses } from '../../components/trucks/truck-expenses';
import { TruckCommercialContext } from '../../components/trucks/truck-commercial-context';
import { TruckFormModal } from '../../components/trucks/truck-form-modal';
import { 
  getTruckDetails, 
  getTruckExpenses, 
  getTruckDocuments, 
  getTruckLeads, 
  getTruckDeal,
  updateTruck,
  deleteTruck
} from '../../services/inventory-service';
import type { Truck } from '../../types';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function TruckDetailsPage() {
  const { truckId } = useParams<{ truckId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [localTruckOverride, setLocalTruckOverride] = useState<Truck | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const baseTruck = useMemo(() => {
    if (!truckId) return undefined;
    return getTruckDetails(truckId);
  }, [truckId]);

  const truck = localTruckOverride || baseTruck;

  const expenses = useMemo(() => getTruckExpenses(truckId || ''), [truckId]);
  const documents = useMemo(() => getTruckDocuments(truckId || ''), [truckId]);
  const leads = useMemo(() => getTruckLeads(truckId || ''), [truckId]);
  const deal = useMemo(() => getTruckDeal(truckId || ''), [truckId]);

  if (!baseTruck || !truck) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Truck not found</h1>
        <p className="text-slate-500 mb-6">The truck you are looking for does not exist or has been removed.</p>
        <Link to="/inventory" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
      </div>
    );
  }

  const handleEditTruck = (updatedData: Partial<Truck>) => {
    const updated = updateTruck(truck.id, updatedData);
    if (updated) {
      setLocalTruckOverride(updated);
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteTruck = () => {
    try {
      setDeleteError(null);
      deleteTruck(truck.id);
      navigate('/inventory');
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete truck.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <TruckDetailHeader 
        truck={truck} 
        onEdit={() => setIsEditModalOpen(true)} 
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TruckOverview truck={truck} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TruckDocuments documents={documents} />
            <TruckExpenses expenses={expenses} />
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <TruckFinancialSummary truck={truck} expenses={expenses} />
          <TruckCommercialContext leads={leads} deal={deal} />
        </div>
      </div>

      {isEditModalOpen && (
        <TruckFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditTruck}
          initialData={truck}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Delete Truck?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Are you sure you want to delete {truck.manufacturer} {truck.model} ({truck.registrationNumber})? 
                Deleting the truck removes it from inventory.
              </p>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                  {deleteError}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTruck}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Truck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
