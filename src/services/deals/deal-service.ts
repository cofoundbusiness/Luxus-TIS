import { deals, trucks, customers, brokers, expenses, commissions, loans, activities } from '../../data/mock';
import type { Deal, Truck, Customer, Broker, Expense, Commission, Loan, Activity } from '../../types';
import { calculateDealProfit } from '../../calculations/deal-profit';

export interface DealContext {
  deal: Deal;
  truck: Truck | undefined;
  customer: Customer | undefined;
  broker: Broker | undefined;
  realizedProfit: number | null; // null if not COMPLETED
}

export const getDealContext = (d: Deal): DealContext => {
  const truck = trucks.find(t => t.id === d.truckId);
  const customer = customers.find(c => c.id === d.customerId);
  const broker = d.brokerId ? brokers.find(b => b.id === d.brokerId) : undefined;
  
  let realizedProfit = null;

  if (d.status === 'COMPLETED' && truck) {
    // Deal expenses + Truck expenses
    const relatedExpenses = expenses.filter(e => e.dealId === d.id || e.truckId === truck.id);
    const brokerCommissions = commissions.filter(c => c.dealId === d.id && c.type === 'BROKER');
    const financeCommissions = commissions.filter(c => c.dealId === d.id && c.type === 'FINANCE');
    
    realizedProfit = calculateDealProfit(
      d,
      truck,
      relatedExpenses,
      brokerCommissions,
      financeCommissions
    );
  }

  return { deal: d, truck, customer, broker, realizedProfit };
};

export const getDealSummary = (currentDeals: DealContext[]) => {
  const total = currentDeals.length;
  const negotiation = currentDeals.filter(d => d.deal.status === 'NEGOTIATION').length;
  const booked = currentDeals.filter(d => d.deal.status === 'BOOKED').length;
  const completed = currentDeals.filter(d => d.deal.status === 'COMPLETED').length;
  const cancelled = currentDeals.filter(d => d.deal.status === 'CANCELLED').length;

  const totalSalesValue = currentDeals.reduce((sum, d) => sum + d.deal.salePrice, 0);
  const realizedProfit = currentDeals.reduce((sum, d) => sum + (d.realizedProfit || 0), 0);

  return { total, negotiation, booked, completed, cancelled, totalSalesValue, realizedProfit };
};

export const searchDeals = (
  currentDeals: DealContext[],
  query: string,
  filters: { status: string, brokerId: string, customerId: string, truckId: string }
): DealContext[] => {
  return currentDeals.filter(ctx => {
    const { deal, truck, customer, broker } = ctx;
    
    const searchString = `
      ${deal.id} 
      ${truck?.registrationNumber || ''} ${truck?.manufacturer || ''} ${truck?.model || ''}
      ${customer?.name || ''} ${customer?.companyName || ''}
      ${broker?.name || ''} ${broker?.companyName || ''}
    `.toLowerCase();
    
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || deal.status === filters.status;
    const matchesBroker = filters.brokerId === 'All' || deal.brokerId === filters.brokerId;
    const matchesCustomer = filters.customerId === 'All' || deal.customerId === filters.customerId;
    const matchesTruck = filters.truckId === 'All' || deal.truckId === filters.truckId;

    return matchesQuery && matchesStatus && matchesBroker && matchesCustomer && matchesTruck;
  });
};

export const getDealById = (id: string) => {
  const d = deals.find(x => x.id === id);
  return d ? getDealContext(d) : null;
};

export const getDealExpenses = (dealId: string, truckId: string): Expense[] => {
  return expenses.filter(e => e.dealId === dealId || e.truckId === truckId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getDealLoans = (dealId: string): Loan[] => {
  return loans.filter(l => l.dealId === dealId);
};

export const getDealCommissions = (dealId: string): Commission[] => {
  return commissions.filter(c => c.dealId === dealId)
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateB - dateA;
    });
};

export const getDealActivities = (dealId: string): Activity[] => {
  return activities
    .filter(a => a.entityType === 'DEAL' && a.entityId === dealId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
