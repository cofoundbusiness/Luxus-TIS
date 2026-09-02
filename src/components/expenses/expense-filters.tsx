import { Search, Filter, X } from 'lucide-react';
import { trucks } from '../../data/mock';
import { ExpenseCategory } from '../../types/enums';

export interface ExpenseFilterState {
  category: string;
  truckId: string;
}

interface ExpenseFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: ExpenseFilterState;
  onFilterChange: (f: ExpenseFilterState) => void;
}

export function ExpenseFilters({ searchQuery, onSearchChange, filters, onFilterChange }: ExpenseFiltersProps) {
  const categories = Object.values(ExpenseCategory);

  const handleFilterChange = (key: keyof ExpenseFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'All',
      truckId: 'All'
    });
    onSearchChange('');
  };

  const hasActiveFilters = filters.category !== 'All' || filters.truckId !== 'All' || searchQuery !== '';

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
          placeholder="Search descriptions, categories, trucks..."
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 px-2 text-slate-500 border-r border-slate-200 pr-3">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <select 
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[140px]"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          value={filters.truckId}
          onChange={(e) => handleFilterChange('truckId', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[180px] truncate"
        >
          <option value="All">All Trucks</option>
          {trucks.map(t => (
            <option key={t.id} value={t.id}>
              {t.manufacturer} {t.model} — {t.registrationNumber}
            </option>
          ))}
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
