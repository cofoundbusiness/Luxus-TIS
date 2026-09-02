import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { LeadSummary } from '../../components/leads/lead-summary';
import { LeadPipeline } from '../../components/leads/lead-pipeline';
import { LeadFilters } from '../../components/leads/lead-filters';
import type { LeadFilterState } from '../../components/leads/lead-filters';
import { LeadTable } from '../../components/leads/lead-table';
import { getLeadSummary, getLeadPipeline, searchLeads } from '../../services/leads/lead-service';
import { leads as mockLeads, customers as mockCustomers } from '../../data/mock';
import { Plus } from 'lucide-react';
import { LeadFormModal } from '../../components/leads/lead-form-modal';
import type { Lead, Customer } from '../../types';

export default function LeadsPage() {
  const [leadList, setLeadList] = useState<Lead[]>(mockLeads);
  // We'll manage a local customer list so new customers appear in selection immediately (if they reopen modal)
  // But ideally they are handled by a shared store. For now, local is fine.
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LeadFilterState>({
    status: 'All',
    source: 'All',
    brokerId: 'All',
    truckId: 'All',
    assignedTo: 'All'
  });

  const summary = useMemo(() => getLeadSummary(leadList), [leadList]);
  const pipeline = useMemo(() => getLeadPipeline(leadList), [leadList]);
  
  const sources = useMemo(() => Array.from(new Set(leadList.map(l => l.source))).sort(), [leadList]);
  
  const filteredLeads = useMemo(() => searchLeads(leadList, searchQuery, filters), [leadList, searchQuery, filters]);

  const handleAddLead = (newLeadData: Partial<Lead>, newCustomerData?: Partial<Customer>) => {
    let customerId = newLeadData.customerId;

    if (newCustomerData && customerId === 'TEMP_CUST') {
      const newCust: Customer = {
        ...newCustomerData,
        id: `CUS-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Customer;
      mockCustomers.push(newCust); // Dirty but fulfills "local state only without backend" requirement globally enough for this view
      customerId = newCust.id;
    }

    const newLead: Lead = {
      ...newLeadData,
      customerId,
      id: `LD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Lead;
    
    setLeadList([newLead, ...leadList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Leads" 
        description="Manage sales opportunities, follow-ups and truck requirements."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </button>
        }
      />

      <LeadSummary summary={summary} />
      
      <LeadPipeline counts={pipeline} />

      <LeadFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        sources={sources}
      />

      <LeadTable leads={filteredLeads} />

      {isAddModalOpen && (
        <LeadFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddLead} 
        />
      )}
    </div>
  );
}
