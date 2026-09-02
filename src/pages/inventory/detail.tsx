import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  getTruckDeal 
} from '../../services/inventory-service';
import type { Truck } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TruckDetailsPage() {
  const { truckId } = useParams<{ truckId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localTruckOverride, setLocalTruckOverride] = useState<Truck | null>(null);

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
    setLocalTruckOverride({ ...truck, ...updatedData } as Truck);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <TruckDetailHeader truck={truck} onEdit={() => setIsEditModalOpen(true)} />

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
    </div>
  );
}
