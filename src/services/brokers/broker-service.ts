import { brokers, leads, customers, deals, commissions, activities } from '../../data/mock';
import type { Broker, Customer } from '../../types';

export interface BrokerContext {
  broker: Broker;
  activeLeadsCount: number;
  completedDealsCount: number;
  totalBrokerCommission: number;
}

export const getBrokerContext = (broker: Broker): BrokerContext => {
  const brokerLeads = leads.filter(l => l.brokerId === broker.id);
  const activeLeadsCount = brokerLeads.filter(l => l.status !== 'SOLD' && l.status !== 'LOST').length;

  const brokerDeals = deals.filter(d => d.brokerId === broker.id);
  const completedDealsCount = brokerDeals.filter(d => d.status === 'COMPLETED').length;

  const brokerCommissions = commissions.filter(c => c.type === 'BROKER' && c.brokerId === broker.id);
  const totalBrokerCommission = brokerCommissions.reduce((sum, c) => sum + c.amount, 0);

  return { broker, activeLeadsCount, completedDealsCount, totalBrokerCommission };
};

export const getBrokerSummary = (currentBrokers: Broker[]) => {
  const mapped = currentBrokers.map(getBrokerContext);
  const total = mapped.length;
  const active = currentBrokers.filter(b => b.status === 'ACTIVE').length;
  const inactive = currentBrokers.filter(b => b.status === 'INACTIVE').length;
  const withActiveLeads = mapped.filter(b => b.activeLeadsCount > 0).length;
  const withCompletedDeals = mapped.filter(b => b.completedDealsCount > 0).length;

  return { total, active, inactive, withActiveLeads, withCompletedDeals };
};

export const searchBrokers = (
  currentBrokers: Broker[],
  query: string,
  filters: { status: string, city: string }
): BrokerContext[] => {
  const mapped = currentBrokers.map(getBrokerContext);

  return mapped.filter(ctx => {
    const b = ctx.broker;
    const searchString = `${b.name} ${b.companyName || ''} ${b.phone} ${b.email || ''} ${b.city || ''} ${b.notes || ''}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || b.status === filters.status;
    const matchesCity = filters.city === 'All' || b.city === filters.city;

    return matchesQuery && matchesStatus && matchesCity;
  });
};

export const getBrokerById = (id: string) => {
  const broker = brokers.find(b => b.id === id);
  return broker ? getBrokerContext(broker) : null;
};

export const getBrokerPerformance = (brokerId: string) => {
  const brokerLeads = leads.filter(l => l.brokerId === brokerId);
  const brokerDeals = deals.filter(d => d.brokerId === brokerId);

  const totalLeads = brokerLeads.length;
  const activeLeads = brokerLeads.filter(l => l.status !== 'SOLD' && l.status !== 'LOST').length;
  const wonLeads = brokerLeads.filter(l => l.status === 'SOLD').length;
  const lostLeads = brokerLeads.filter(l => l.status === 'LOST').length;

  const totalDeals = brokerDeals.length;
  const completedDeals = brokerDeals.filter(d => d.status === 'COMPLETED').length;
  const cancelledDeals = brokerDeals.filter(d => d.status === 'CANCELLED').length;

  return {
    totalLeads, activeLeads, wonLeads, lostLeads, totalDeals, completedDeals, cancelledDeals
  };
};

export const getBrokerPipeline = (brokerId: string) => {
  const brokerLeads = leads.filter(l => l.brokerId === brokerId);
  const counts = {
    NEW: 0, CONTACTED: 0, INTERESTED: 0, NEGOTIATION: 0, BOOKED: 0, SOLD: 0, LOST: 0
  };

  brokerLeads.forEach(l => {
    if (counts[l.status as keyof typeof counts] !== undefined) {
      counts[l.status as keyof typeof counts]++;
    }
  });

  return counts;
};

export const getBrokerCustomers = (brokerId: string): Customer[] => {
  const brokerLeads = leads.filter(l => l.brokerId === brokerId);
  const customerIds = Array.from(new Set(brokerLeads.map(l => l.customerId)));
  return customers.filter(c => customerIds.includes(c.id));
};

export const getBrokerLeads = (brokerId: string) => {
  return leads.filter(l => l.brokerId === brokerId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const getBrokerDeals = (brokerId: string) => {
  return deals.filter(d => d.brokerId === brokerId).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
};

export const getBrokerCommissions = (brokerId: string) => {
  return commissions.filter(c => c.type === 'BROKER' && c.brokerId === brokerId);
};

export const getBrokerActivities = (brokerId: string) => {
  return activities
    .filter(a => a.entityType === 'BROKER' && a.entityId === brokerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
