import { financePartners, loans, commissions, activities } from '../../data/mock';
import type { FinancePartner, Loan, Commission, Activity } from '../../types';

export interface FinancePartnerContext {
  partner: FinancePartner;
  activeLoansCount: number;
  disbursedLoansCount: number;
  totalLoanValue: number;
  expectedCommission: number;
  receivedCommission: number;
}

export const getFinancePartnerContext = (p: FinancePartner): FinancePartnerContext => {
  const partnerLoans = loans.filter(l => l.financePartnerId === p.id);
  
  const activeLoansCount = partnerLoans.filter(l => l.status === 'APPLICATION' || l.status === 'PROCESSING' || l.status === 'APPROVED').length;
  const disbursedLoansCount = partnerLoans.filter(l => l.status === 'DISBURSED').length;
  
  const totalLoanValue = partnerLoans.filter(l => l.status !== 'REJECTED').reduce((sum, l) => sum + l.loanAmount, 0);
  const expectedCommission = partnerLoans.reduce((sum, l) => sum + l.expectedCommission, 0);
  
  // Received commission could come from Loan records or Commission records.
  // We'll aggregate from actual Commission records linked to this partner's loans for accuracy if they exist.
  const partnerCommissions = commissions.filter(c => c.type === 'FINANCE' && partnerLoans.some(l => l.id === c.loanId));
  const receivedCommission = partnerCommissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);

  return { partner: p, activeLoansCount, disbursedLoansCount, totalLoanValue, expectedCommission, receivedCommission };
};

export const getFinancePartnerSummary = (currentPartners: FinancePartnerContext[]) => {
  const total = currentPartners.length;
  const active = currentPartners.filter(p => p.partner.status === 'ACTIVE').length;
  const inactive = currentPartners.filter(p => p.partner.status === 'INACTIVE').length;
  const withActiveLoans = currentPartners.filter(p => p.activeLoansCount > 0).length;
  const withDisbursedLoans = currentPartners.filter(p => p.disbursedLoansCount > 0).length;

  const totalLoanValue = currentPartners.reduce((sum, p) => sum + p.totalLoanValue, 0);
  const expectedCommission = currentPartners.reduce((sum, p) => sum + p.expectedCommission, 0);

  return { total, active, inactive, withActiveLoans, withDisbursedLoans, totalLoanValue, expectedCommission };
};

export const searchFinancePartners = (
  currentPartners: FinancePartnerContext[],
  query: string,
  filters: { status: string, performance: string }
): FinancePartnerContext[] => {
  return currentPartners.filter(ctx => {
    const { partner, activeLoansCount, disbursedLoansCount } = ctx;
    
    const searchString = `
      ${partner.name} ${partner.contactPerson || ''} ${partner.phone || ''} ${partner.email || ''}
    `.toLowerCase();
    
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    const matchesStatus = filters.status === 'All' || partner.status === filters.status;
    
    let matchesPerformance = true;
    if (filters.performance === 'Has Active Loans') matchesPerformance = activeLoansCount > 0;
    if (filters.performance === 'Has Disbursed Loans') matchesPerformance = disbursedLoansCount > 0;

    return matchesQuery && matchesStatus && matchesPerformance;
  });
};

export const getFinancePartnerById = (id: string) => {
  const p = financePartners.find(x => x.id === id);
  return p ? getFinancePartnerContext(p) : null;
};

export const getFinancePartnerLoans = (partnerId: string): Loan[] => {
  return loans.filter(l => l.financePartnerId === partnerId).sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
};

export const getFinancePartnerCommissions = (partnerId: string): Commission[] => {
  const pLoans = loans.filter(l => l.financePartnerId === partnerId).map(l => l.id);
  return commissions.filter(c => c.type === 'FINANCE' && c.loanId && pLoans.includes(c.loanId));
};

export const getFinancePartnerActivities = (partnerId: string): Activity[] => {
  return activities
    .filter(a => a.entityType === 'FINANCE_PARTNER' && a.entityId === partnerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
