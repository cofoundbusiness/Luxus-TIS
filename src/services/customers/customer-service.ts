import { customers, leads, deals, activities, trucks, MOCK_REFERENCE_DATE } from '../../data/mock';
import type { Customer, Lead, Deal, Truck, Activity } from '../../types';

export interface CustomerContext {
  customer: Customer;
  activeLeadsCount: number;
  completedDealsCount: number;
  totalDealsCount: number;
  lastActivityDate?: string;
}

export const getCustomerContext = (cust: Customer): CustomerContext => {
  const customerLeads = leads.filter(l => l.customerId === cust.id);
  const activeLeadsCount = customerLeads.filter(l => l.status !== 'SOLD' && l.status !== 'LOST').length;

  const customerDeals = deals.filter(d => d.customerId === cust.id);
  const totalDealsCount = customerDeals.length;
  const completedDealsCount = customerDeals.filter(d => d.status === 'COMPLETED').length;

  const customerActivities = activities
    .filter(a => a.entityType === 'CUSTOMER' && a.entityId === cust.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const lastActivityDate = customerActivities.length > 0 ? customerActivities[0].timestamp : undefined;

  return { customer: cust, activeLeadsCount, completedDealsCount, totalDealsCount, lastActivityDate };
};

export const getCustomerSummary = (currentCustomers: Customer[]) => {
  const mapped = currentCustomers.map(getCustomerContext);
  const total = mapped.length;
  const withActiveLeads = mapped.filter(c => c.activeLeadsCount > 0).length;
  const withCompletedDeals = mapped.filter(c => c.completedDealsCount > 0).length;

  // New/Recent -> Created in the last 30 days based on MOCK_REFERENCE_DATE
  const refTime = new Date(MOCK_REFERENCE_DATE).getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const newRecent = currentCustomers.filter(c => {
    return (refTime - new Date(c.createdAt).getTime()) <= thirtyDaysMs;
  }).length;

  return { total, withActiveLeads, withCompletedDeals, newRecent };
};

export const searchCustomers = (
  currentCustomers: Customer[], 
  query: string, 
  filters: { city: string, state: string, hasActiveLeads: string }
) => {
  const mapped = currentCustomers.map(getCustomerContext);

  return mapped.filter(ctx => {
    const { customer, activeLeadsCount } = ctx;
    
    // Search
    const searchString = `${customer.name} ${customer.phone} ${customer.email || ''} ${customer.companyName || ''} ${customer.city || ''} ${customer.state || ''}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());

    // Filters
    const matchesCity = filters.city === 'All' || customer.city === filters.city;
    const matchesState = filters.state === 'All' || customer.state === filters.state;
    
    let matchesActiveLeads = true;
    if (filters.hasActiveLeads === 'Yes') matchesActiveLeads = activeLeadsCount > 0;
    if (filters.hasActiveLeads === 'No') matchesActiveLeads = activeLeadsCount === 0;

    return matchesQuery && matchesCity && matchesState && matchesActiveLeads;
  });
};

export const getCustomerById = (id: string) => {
  const cust = customers.find(c => c.id === id);
  return cust ? getCustomerContext(cust) : null;
};

export const getCustomerLeads = (customerId: string): Lead[] => {
  return leads.filter(l => l.customerId === customerId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const getCustomerDeals = (customerId: string): Deal[] => {
  return deals.filter(d => d.customerId === customerId)
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
};

export const getCustomerTrucks = (customerId: string): Truck[] => {
  const customerDealTruckIds = deals.filter(d => d.customerId === customerId).map(d => d.truckId);
  return trucks.filter(t => customerDealTruckIds.includes(t.id));
};

export const getCustomerActivities = (customerId: string): Activity[] => {
  return activities.filter(a => a.entityType === 'CUSTOMER' && a.entityId === customerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
