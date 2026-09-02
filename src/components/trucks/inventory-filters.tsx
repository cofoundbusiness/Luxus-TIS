import { Search, Filter, X } from 'lucide-react';
import type { Truck } from '../../types';

export interface FilterState {
  status: string;
  manufacturer: string;
  location: string;
  fuelType: string;
}

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  allTrucks: Truck[];
}

export function InventoryFilters({ searchQuery, onSearchChange, filters, onFilterChange, allTrucks }: InventoryFiltersProps) {
  const manufacturers = Array.from(new Set(allTrucks.map(t => t.manufacturer))).sort();
  const locations = Array.from(new Set(allTrucks.map(t => t.location))).sort();
  // removed unused fuelTypes

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'All',
      manufacturer: 'All',
      location: 'All',
      fuelType: 'All'
    });
    onSearchChange('');
  };

  const hasActiveFilters = filters.status !== 'All' || filters.manufacturer !== 'All' || filters.location !== 'All' || filters.fuelType !== 'All' || searchQuery !== '';

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-end sm:items-center">
      <div className="flex-1 relative w-full sm:w-auto">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:bg-white transition-colors"
          placeholder="Search registration, model, chassis, location..."
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 px-2 text-slate-500 border-r border-slate-200 pr-3">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="All">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="UNDER_PREPARATION">Under Prep</option>
          <option value="PENDING_DOCUMENTS">Pending Docs</option>
          <option value="SOLD">Sold</option>
        </select>

        <select 
          value={filters.manufacturer}
          onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="All">All Makes</option>
          {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select 
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="All">All Locations</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-navy-900 py-1.5 px-2 transition-colors ml-1"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
