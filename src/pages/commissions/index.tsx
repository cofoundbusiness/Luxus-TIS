import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { CommissionSummary } from '../../components/commissions/commission-summary';
import { CommissionFilters } from '../../components/commissions/commission-filters';
import type { CommissionFilterState } from '../../components/commissions/commission-filters';
import { CommissionTable } from '../../components/commissions/commission-table';
import { getCommissionContext, getCommissionSummary, searchCommissions } from '../../services/commissions/commission-service';
import { commissions as mockCommissions, brokers, financePartners } from '../../data/mock';
import { Plus } from 'lucide-react';
import { CommissionFormModal } from '../../components/commissions/commission-form-modal';
import type { Commission } from '../../types';

export default function CommissionsPage() {
  const [commissionList, setCommissionList] = useState<Commission[]>(mockCommissions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CommissionFilterState>({
    type: 'All',
    status: 'All',
    brokerId: 'All',
    financePartnerId: 'All'
  });

  const contexts = useMemo(() => commissionList.map(getCommissionContext), [commissionList]);
  const summary = useMemo(() => getCommissionSummary(contexts), [contexts]);
  
  const filteredCommissions = useMemo(() => 
    searchCommissions(contexts, searchQuery, filters), 
    [contexts, searchQuery, filters]
  );

  const handleAddCommission = (newCommissionData: Partial<Commission>) => {
    const newCommission: Commission = {
      ...newCommissionData,
      id: `COM-${Math.floor(1000 + Math.random() * 9000)}`,
    } as Commission;
    
    setCommissionList([newCommission, ...commissionList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Commissions" 
        description="Track broker and finance commissions, outstanding payouts and received income."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Commission
          </button>
        }
      />

      <CommissionSummary summary={summary} />

      <CommissionFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        brokers={brokers}
        financePartners={financePartners}
      />

      <CommissionTable commissions={filteredCommissions} />

      {isAddModalOpen && (
        <CommissionFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddCommission} 
        />
      )}
    </div>
  );
}
