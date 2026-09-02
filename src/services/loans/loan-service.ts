import { loans, deals, customers, trucks, financePartners, commissions, activities } from '../../data/mock';
import type { Loan, Deal, Customer, Truck, FinancePartner, Commission, Activity } from '../../types';

export interface LoanContext {
  loan: Loan;
  deal: Deal | undefined;
  customer: Customer | undefined;
  truck: Truck | undefined;
  financePartner: FinancePartner | undefined;
  financeCommission: Commission | undefined;
}

export const getLoanContext = (l: Loan): LoanContext => {
  const deal = deals.find(d => d.id === l.dealId);
  const customer = customers.find(c => c.id === l.customerId);
  const truck = trucks.find(t => t.id === l.truckId);
  const financePartner = financePartners.find(fp => fp.id === l.financePartnerId);
  
  // Tie strictly via loanId where available
  const financeCommission = commissions.find(c => c.loanId === l.id && c.type === 'FINANCE');

  return { loan: l, deal, customer, truck, financePartner, financeCommission };
};

export const getLoanSummary = (currentLoans: LoanContext[]) => {
  const total = currentLoans.length;
  const application = currentLoans.filter(l => l.loan.status === 'APPLICATION').length;
  const processing = currentLoans.filter(l => l.loan.status === 'PROCESSING').length;
  const approved = currentLoans.filter(l => l.loan.status === 'APPROVED').length;
  const rejected = currentLoans.filter(l => l.loan.status === 'REJECTED').length;
  const disbursed = currentLoans.filter(l => l.loan.status === 'DISBURSED').length;

  const totalLoanValue = currentLoans.filter(l => l.loan.status !== 'REJECTED').reduce((sum, l) => sum + l.loan.loanAmount, 0);
  const expectedCommission = currentLoans.reduce((sum, l) => sum + l.loan.expectedCommission, 0);
  const receivedCommission = currentLoans.reduce((sum, l) => sum + l.loan.receivedCommission, 0);

  return { total, application, processing, approved, rejected, disbursed, totalLoanValue, expectedCommission, receivedCommission };
};

export const searchLoans = (
  currentLoans: LoanContext[],
  query: string,
  filters: { status: string, financePartnerId: string }
): LoanContext[] => {
  return currentLoans.filter(ctx => {
    const { loan, deal, customer, truck, financePartner } = ctx;
    
    const searchString = `
      ${loan.id} 
      ${deal?.id || ''}
      ${truck?.registrationNumber || ''} ${truck?.manufacturer || ''} ${truck?.model || ''}
      ${customer?.name || ''} ${customer?.companyName || ''}
      ${financePartner?.name || ''} ${financePartner?.contactPerson || ''}
    `.toLowerCase();
    
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    const matchesStatus = filters.status === 'All' || loan.status === filters.status;
    const matchesPartner = filters.financePartnerId === 'All' || loan.financePartnerId === filters.financePartnerId;

    return matchesQuery && matchesStatus && matchesPartner;
  });
};

export const getLoanById = (id: string) => {
  const l = loans.find(x => x.id === id);
  return l ? getLoanContext(l) : null;
};

export const getLoanActivities = (loanId: string): Activity[] => {
  return activities
    .filter(a => a.entityType === 'LOAN' && a.entityId === loanId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
