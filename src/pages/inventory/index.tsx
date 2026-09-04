import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { InventorySummary } from '../../components/trucks/inventory-summary';
import { InventoryFilters } from '../../components/trucks/inventory-filters';
import type { FilterState } from '../../components/trucks/inventory-filters';
import { InventoryTable } from '../../components/trucks/inventory-table';
import { getInventorySummary, searchTrucks, getAllTrucks, addTruck } from '../../services/inventory-service';
import { Plus } from 'lucide-react';
import { TruckFormModal } from '../../components/trucks/truck-form-modal';
import type { Truck } from '../../types';


export default function InventoryPage() {
  const [trucks, setTrucks] = useState<Truck[]>(getAllTrucks());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'All',
    manufacturer: 'All',
    location: 'All',
    fuelType: 'All'
  });

  const summary = useMemo(() => getInventorySummary(trucks), [trucks]);
  const filteredTrucks = useMemo(() => searchTrucks(trucks, searchQuery, filters), [trucks, searchQuery, filters]);

  const handleAddTruck = (newTruckData: Partial<Truck>) => {
    addTruck(newTruckData);
    setTrucks(getAllTrucks());
    setIsAddModalOpen(false);
    // Optionally alert('Truck added successfully'); but it's okay without it too.
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Inventory" 
        description="Manage and monitor your truck inventory."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Truck
          </button>
        }
      />

      <InventorySummary summary={summary} />

      <InventoryFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        allTrucks={trucks}
      />

      <InventoryTable trucks={filteredTrucks} />

      {isAddModalOpen && (
        <TruckFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddTruck} 
        />
      )}
    </div>
  );
}
