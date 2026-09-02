import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { CustomerSummary } from '../../components/customers/customer-summary';
import { CustomerFilters } from '../../components/customers/customer-filters';
import type { CustomerFilterState } from '../../components/customers/customer-filters';
import { CustomerTable } from '../../components/customers/customer-table';
import { getCustomerSummary, searchCustomers } from '../../services/customers/customer-service';
import { customers as mockCustomers } from '../../data/mock';
import { Plus } from 'lucide-react';
import { CustomerFormModal } from '../../components/customers/customer-form-modal';
import type { Customer } from '../../types';

export default function CustomersPage() {
  const [customerList, setCustomerList] = useState<Customer[]>(mockCustomers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CustomerFilterState>({
    city: 'All',
    state: 'All',
    hasActiveLeads: 'All'
  });

  const summary = useMemo(() => getCustomerSummary(customerList), [customerList]);
  
  const cities = useMemo(() => Array.from(new Set(customerList.map(c => c.city).filter(Boolean))) as string[], [customerList]);
  const states = useMemo(() => Array.from(new Set(customerList.map(c => c.state).filter(Boolean))) as string[], [customerList]);
  
  const filteredCustomers = useMemo(() => searchCustomers(customerList, searchQuery, filters), [customerList, searchQuery, filters]);

  const handleAddCustomer = (newCustData: Partial<Customer>) => {
    const newCust: Customer = {
      ...newCustData,
      id: `CUS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Customer;
    
    setCustomerList([newCust, ...customerList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Customers" 
        description="Manage customer relationships and sales history."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Customer
          </button>
        }
      />

      <CustomerSummary summary={summary} />

      <CustomerFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        cities={cities}
        states={states}
      />

      <CustomerTable customers={filteredCustomers} />

      {isAddModalOpen && (
        <CustomerFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddCustomer} 
        />
      )}
    </div>
  );
}
