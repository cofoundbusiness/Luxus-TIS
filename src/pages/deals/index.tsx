import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { DealSummary } from '../../components/deals/deal-summary';
import { DealFilters } from '../../components/deals/deal-filters';
import type { DealFilterState } from '../../components/deals/deal-filters';
import { DealTable } from '../../components/deals/deal-table';
import { getDealContext, getDealSummary, searchDeals } from '../../services/deals/deal-service';
import { deals as mockDeals } from '../../data/mock';
import { Plus } from 'lucide-react';
import { DealFormModal } from '../../components/deals/deal-form-modal';
import type { Deal } from '../../types';

export default function DealsPage() {
  const [dealList, setDealList] = useState<Deal[]>(mockDeals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DealFilterState>({
    status: 'All'
  });

  const contexts = useMemo(() => dealList.map(getDealContext), [dealList]);
  const summary = useMemo(() => getDealSummary(contexts), [contexts]);
  
  const filteredDeals = useMemo(() => 
    searchDeals(contexts, searchQuery, { ...filters, brokerId: 'All', customerId: 'All', truckId: 'All' }), 
    [contexts, searchQuery, filters]
  );

  const handleAddDeal = (newDealData: Partial<Deal>) => {
    const newDeal: Deal = {
      ...newDealData,
      id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Deal;
    
    setDealList([newDeal, ...dealList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Deals" 
        description="Manage truck sales, customers, brokers, transaction value and profitability."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        }
      />

      <DealSummary summary={summary} />

      <DealFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
      />

      <DealTable deals={filteredDeals} />

      {isAddModalOpen && (
        <DealFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddDeal} 
        />
      )}
    </div>
  );
}
