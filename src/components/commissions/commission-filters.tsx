import { Search, Filter, X } from 'lucide-react';
import { CommissionStatus, CommissionType } from '../../types/enums';
import type { Broker, FinancePartner } from '../../types';

export interface CommissionFilterState {
  type: string;
  status: string;
  brokerId: string;
  financePartnerId: string;
}

interface CommissionFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: CommissionFilterState;
  onFilterChange: (f: CommissionFilterState) => void;
  brokers: Broker[];
  financePartners: FinancePartner[];
}

export function CommissionFilters({ searchQuery, onSearchChange, filters, onFilterChange, brokers, financePartners }: CommissionFiltersProps) {
  const handleFilterChange = (key: keyof CommissionFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ type: 'All', status: 'All', brokerId: 'All', financePartnerId: 'All' });
    onSearchChange('');
  };

  const hasActiveFilters = filters.type !== 'All' || filters.status !== 'All' || filters.brokerId !== 'All' || filters.financePartnerId !== 'All' || searchQuery !== '';

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 flex flex-col lg:flex-row gap-4 items-end lg:items-center">
      <div className="flex-1 relative w-full lg:w-auto min-w-[200px]">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:bg-white transition-colors"
          placeholder="Search ID, Deal, Broker, Partner..."
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <div className="flex items-center gap-1.5 px-2 text-slate-500 border-r border-slate-200 pr-3">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <select 
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[120px]"
        >
          <option value="All">All Types</option>
          {Object.values(CommissionType).map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[120px]"
        >
          <option value="All">All Statuses</option>
          {Object.values(CommissionStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          value={filters.brokerId}
          onChange={(e) => handleFilterChange('brokerId', e.target.value)}
          disabled={filters.type === 'FINANCE'}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[140px] disabled:opacity-50"
        >
          <option value="All">All Brokers</option>
          {brokers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select 
          value={filters.financePartnerId}
          onChange={(e) => handleFilterChange('financePartnerId', e.target.value)}
          disabled={filters.type === 'BROKER'}
          className="bg-slate-50 border border-slate-200 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-navy-500 max-w-[140px] disabled:opacity-50"
        >
          <option value="All">All Partners</option>
          {financePartners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
