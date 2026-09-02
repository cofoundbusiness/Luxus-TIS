import { commissions, deals, loans, brokers, customers, trucks, financePartners, activities } from '../../data/mock';
import type { Commission, Deal, Broker, Loan, Customer, Truck, FinancePartner, Activity } from '../../types';

export interface CommissionContext {
  commission: Commission;
  deal: Deal | undefined;
  broker: Broker | undefined;
  loan: Loan | undefined;
  financePartner: FinancePartner | undefined;
  customer: Customer | undefined;
  truck: Truck | undefined;
}

export const getCommissionContext = (c: Commission): CommissionContext => {
  const deal = deals.find(d => d.id === c.dealId);
  const customer = deal ? customers.find(x => x.id === deal.customerId) : undefined;
  const truck = deal ? trucks.find(x => x.id === deal.truckId) : undefined;

  let broker: Broker | undefined;
  let loan: Loan | undefined;
  let financePartner: FinancePartner | undefined;

  if (c.type === 'BROKER' && c.brokerId) {
    broker = brokers.find(b => b.id === c.brokerId);
  } else if (c.type === 'FINANCE' && c.loanId) {
    loan = loans.find(l => l.id === c.loanId);
    if (loan) {
      financePartner = financePartners.find(fp => fp.id === loan?.financePartnerId);
    }
  }

  return { commission: c, deal, broker, loan, financePartner, customer, truck };
};

export const getCommissionSummary = (currentCommissions: CommissionContext[]) => {
  const total = currentCommissions.length;
  const pending = currentCommissions.filter(c => c.commission.status === 'PENDING').length;
  const partial = currentCommissions.filter(c => c.commission.status === 'PARTIAL').length;
  const paid = currentCommissions.filter(c => c.commission.status === 'PAID').length;
  const cancelled = currentCommissions.filter(c => c.commission.status === 'CANCELLED').length;

  const totalCommissionValue = currentCommissions.filter(c => c.commission.status !== 'CANCELLED').reduce((sum, c) => sum + c.commission.amount, 0);
  const pendingValue = currentCommissions.filter(c => c.commission.status === 'PENDING' || c.commission.status === 'PARTIAL').reduce((sum, c) => sum + c.commission.amount, 0); // Simplified calculation
  const paidValue = currentCommissions.filter(c => c.commission.status === 'PAID').reduce((sum, c) => sum + c.commission.amount, 0);

  const brokerCommissionTotal = currentCommissions.filter(c => c.commission.type === 'BROKER' && c.commission.status !== 'CANCELLED').reduce((sum, c) => sum + c.commission.amount, 0);
  const financeCommissionTotal = currentCommissions.filter(c => c.commission.type === 'FINANCE' && c.commission.status !== 'CANCELLED').reduce((sum, c) => sum + c.commission.amount, 0);

  return { total, pending, partial, paid, cancelled, totalCommissionValue, pendingValue, paidValue, brokerCommissionTotal, financeCommissionTotal };
};

export const searchCommissions = (
  currentCommissions: CommissionContext[],
  query: string,
  filters: { type: string, status: string, brokerId: string, financePartnerId: string }
): CommissionContext[] => {
  return currentCommissions.filter(ctx => {
    const { commission, deal, broker, loan, financePartner, customer, truck } = ctx;
    
    const searchString = `
      ${commission.id} 
      ${deal?.id || ''}
      ${loan?.id || ''}
      ${broker?.name || ''}
      ${financePartner?.name || ''}
      ${customer?.name || ''}
      ${truck?.registrationNumber || ''}
    `.toLowerCase();
    
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    const matchesType = filters.type === 'All' || commission.type === filters.type;
    const matchesStatus = filters.status === 'All' || commission.status === filters.status;
    const matchesBroker = filters.brokerId === 'All' || commission.brokerId === filters.brokerId;
    const matchesFinancePartner = filters.financePartnerId === 'All' || loan?.financePartnerId === filters.financePartnerId;

    return matchesQuery && matchesType && matchesStatus && matchesBroker && matchesFinancePartner;
  });
};

export const getCommissionById = (id: string) => {
  const c = commissions.find(x => x.id === id);
  return c ? getCommissionContext(c) : null;
};

export const getCommissionActivities = (commissionId: string): Activity[] => {
  return activities
    .filter(a => a.entityType === 'COMMISSION' && a.entityId === commissionId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
