import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { BrokerSummary } from '../../components/brokers/broker-summary';
import { BrokerFilters } from '../../components/brokers/broker-filters';
import type { BrokerFilterState } from '../../components/brokers/broker-filters';
import { BrokerTable } from '../../components/brokers/broker-table';
import { getBrokerSummary, searchBrokers } from '../../services/brokers/broker-service';
import { brokers as mockBrokers } from '../../data/mock';
import { Plus } from 'lucide-react';
import { BrokerFormModal } from '../../components/brokers/broker-form-modal';
import type { Broker } from '../../types';

export default function BrokersPage() {
  const [brokerList, setBrokerList] = useState<Broker[]>(mockBrokers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<BrokerFilterState>({
    status: 'All',
    city: 'All'
  });

  const summary = useMemo(() => getBrokerSummary(brokerList), [brokerList]);
  
  const cities = useMemo(() => Array.from(new Set(brokerList.map(b => b.city).filter(Boolean))) as string[], [brokerList]);
  
  const filteredBrokers = useMemo(() => searchBrokers(brokerList, searchQuery, filters), [brokerList, searchQuery, filters]);

  const handleAddBroker = (newBrokerData: Partial<Broker>) => {
    const newBroker: Broker = {
      ...newBrokerData,
      id: `BRK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Broker;
    
    setBrokerList([newBroker, ...brokerList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Brokers" 
        description="Manage broker relationships, opportunities and sales performance."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Broker
          </button>
        }
      />

      <BrokerSummary summary={summary} />

      <BrokerFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        cities={cities}
      />

      <BrokerTable brokers={filteredBrokers} />

      {isAddModalOpen && (
        <BrokerFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddBroker} 
        />
      )}
    </div>
  );
}
