import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { InventorySummary } from '../../components/trucks/inventory-summary';
import { InventoryFilters } from '../../components/trucks/inventory-filters';
import type { FilterState } from '../../components/trucks/inventory-filters';
import { InventoryTable } from '../../components/trucks/inventory-table';
import { InventoryCards } from '../../components/trucks/inventory-cards';
import { getInventorySummary, searchTrucks, getAllTrucks, addTruck } from '../../services/inventory-service';
import { addTruckPhotos } from '../../services/photo-service';
import { Plus, LayoutList, LayoutGrid } from 'lucide-react';
import { TruckFormModal } from '../../components/trucks/truck-form-modal';
import type { Truck } from '../../types';
import { cn } from '../../utils/cn';


export default function InventoryPage() {
  const [trucks, setTrucks] = useState<Truck[]>(getAllTrucks());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'All',
    manufacturer: 'All',
    location: 'All',
    fuelType: 'All'
  });

  const summary = useMemo(() => getInventorySummary(trucks), [trucks]);
  const filteredTrucks = useMemo(() => searchTrucks(trucks, searchQuery, filters), [trucks, searchQuery, filters]);

  const handleAddTruck = (newTruckData: Partial<Truck>, photos?: File[]) => {
    const newTruck = addTruck(newTruckData);
    if (photos && photos.length > 0) {
      addTruckPhotos(newTruck.id, photos);
    }
    setTrucks(getAllTrucks());
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Inventory" 
        description="Manage and monitor your truck inventory."
        actions={
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('cards')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  viewMode === 'cards'
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  viewMode === 'table'
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutList className="w-3.5 h-3.5" />
                Table
              </button>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Truck
            </button>
          </div>
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

      {viewMode === 'table' ? (
        <InventoryTable trucks={filteredTrucks} />
      ) : (
        <InventoryCards trucks={filteredTrucks} />
      )}

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
