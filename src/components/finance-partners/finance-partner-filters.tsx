import { Search, Filter, X } from 'lucide-react';
import { FinancePartnerStatus } from '../../types/enums';

export interface FinancePartnerFilterState {
  status: string;
  performance: string;
}

interface FinancePartnerFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FinancePartnerFilterState;
  onFilterChange: (f: FinancePartnerFilterState) => void;
}

export function FinancePartnerFilters({ searchQuery, onSearchChange, filters, onFilterChange }: FinancePartnerFiltersProps) {
  const handleFilterChange = (key: keyof FinancePartnerFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'All', performance: 'All' });
    onSearchChange('');
  };

  const hasActiveFilters = filters.status !== 'All' || filters.performance !== 'All' || searchQuery !== '';

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
          placeholder="Search by name, contact, phone..."
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
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[140px]"
        >
          <option value="All">All Statuses</option>
          {Object.values(FinancePartnerStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          value={filters.performance}
          onChange={(e) => handleFilterChange('performance', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[170px]"
        >
          <option value="All">All Performance</option>
          <option value="Has Active Loans">Has Active Loans</option>
          <option value="Has Disbursed Loans">Has Disbursed Loans</option>
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
