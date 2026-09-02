import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { FinancePartnerSummary } from '../../components/finance-partners/finance-partner-summary';
import { FinancePartnerFilters } from '../../components/finance-partners/finance-partner-filters';
import type { FinancePartnerFilterState } from '../../components/finance-partners/finance-partner-filters';
import { FinancePartnerTable } from '../../components/finance-partners/finance-partner-table';
import { getFinancePartnerContext, getFinancePartnerSummary, searchFinancePartners } from '../../services/finance-partners/finance-partner-service';
import { financePartners as mockFinancePartners } from '../../data/mock';
import { Plus } from 'lucide-react';
import { FinancePartnerFormModal } from '../../components/finance-partners/finance-partner-form-modal';
import type { FinancePartner } from '../../types';

export default function FinancePartnersPage() {
  const [partnerList, setPartnerList] = useState<FinancePartner[]>(mockFinancePartners);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FinancePartnerFilterState>({
    status: 'All',
    performance: 'All'
  });

  const contexts = useMemo(() => partnerList.map(getFinancePartnerContext), [partnerList]);
  const summary = useMemo(() => getFinancePartnerSummary(contexts), [contexts]);
  
  const filteredPartners = useMemo(() => 
    searchFinancePartners(contexts, searchQuery, filters), 
    [contexts, searchQuery, filters]
  );

  const handleAddPartner = (newPartnerData: Partial<FinancePartner>) => {
    const newPartner: FinancePartner = {
      ...newPartnerData,
      id: `FP-${Math.floor(1000 + Math.random() * 9000)}`,
    } as FinancePartner;
    
    setPartnerList([newPartner, ...partnerList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Finance Partners" 
        description="Manage financing relationships, commission rates and loan activity."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Finance Partner
          </button>
        }
      />

      <FinancePartnerSummary summary={summary} />

      <FinancePartnerFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
      />

      <FinancePartnerTable partners={filteredPartners} />

      {isAddModalOpen && (
        <FinancePartnerFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddPartner} 
        />
      )}
    </div>
  );
}
