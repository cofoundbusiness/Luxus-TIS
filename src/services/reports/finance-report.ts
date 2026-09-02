import { loans, commissions, financePartners } from '../../data/mock';
import { isDateInRange, getReferenceDate } from '../../utils/date-utils';
import type { DateRange } from '../../utils/date-utils';
import type { FinancePartner, Commission } from '../../types';

export interface FinanceReport {
  totalLoans: number;
  applications: number;
  processing: number;
  approved: number;
  rejected: number;
  disbursed: number;
  
  totalLoanValue: number;
  expectedCommission: number;
  receivedCommission: number;
  outstandingCommission: number;

  partnerDetails: Array<{
    partner: FinancePartner;
    totalLoans: number;
    activeLoans: number;
    approved: number;
    rejected: number;
    disbursed: number;
    loanValue: number;
    expectedCommission: number;
    receivedCommission: number;
  }>;
}

export interface CommissionReport {
  totalCommissions: number;
  brokerCommissionTotal: number;
  financeCommissionTotal: number;

  pendingValue: number;
  paidValue: number;
  
  pendingCount: number;
  partialCount: number;
  paidCount: number;
  cancelledCount: number;
  
  overdueCount: number;
  dueSoonCount: number;

  commissionDetails: Array<{
    commission: Commission;
    isOverdue: boolean;
    isDueSoon: boolean;
  }>;
}

export function generateFinanceReport(dateRange: DateRange): FinanceReport {
  const filteredLoans = loans.filter(l => isDateInRange(l.applicationDate, dateRange));

  const report: FinanceReport = {
    totalLoans: filteredLoans.length,
    applications: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
    totalLoanValue: 0,
    expectedCommission: 0,
    receivedCommission: 0,
    outstandingCommission: 0,
    partnerDetails: []
  };

  financePartners.forEach(partner => {
    const partnerLoans = filteredLoans.filter(l => l.financePartnerId === partner.id);
    
    let activeLoans = 0;
    let approved = 0;
    let rejected = 0;
    let disbursed = 0;
    let loanValue = 0;
    let expected = 0;
    let received = 0;

    partnerLoans.forEach(l => {
      // Global counts
      if (l.status === 'APPLICATION') report.applications++;
      else if (l.status === 'PROCESSING') report.processing++;
      else if (l.status === 'APPROVED') { report.approved++; approved++; activeLoans++; }
      else if (l.status === 'REJECTED') { report.rejected++; rejected++; }
      else if (l.status === 'DISBURSED') { report.disbursed++; disbursed++; activeLoans++; }

      if (l.status === 'APPLICATION' || l.status === 'PROCESSING') activeLoans++;

      // Global values
      if (l.status !== 'REJECTED') {
        report.totalLoanValue += l.loanAmount;
        report.expectedCommission += l.expectedCommission;
        report.receivedCommission += l.receivedCommission;
        
        loanValue += l.loanAmount;
        expected += l.expectedCommission;
        received += l.receivedCommission;
      }
    });

    report.partnerDetails.push({
      partner,
      totalLoans: partnerLoans.length,
      activeLoans,
      approved,
      rejected,
      disbursed,
      loanValue,
      expectedCommission: expected,
      receivedCommission: received
    });
  });

  report.outstandingCommission = Math.max(0, report.expectedCommission - report.receivedCommission);

  // Sort partners by disbursed descending
  report.partnerDetails.sort((a, b) => b.disbursed - a.disbursed);

  return report;
}

export function generateCommissionReport(dateRange: DateRange): CommissionReport {
  // Use dueDate or paidDate if available, fallback to true if no strict date matches
  const filteredComms = commissions.filter(c => {
    if (c.dueDate && isDateInRange(c.dueDate, dateRange)) return true;
    if (c.paidDate && isDateInRange(c.paidDate, dateRange)) return true;
    return false;
  });

  const refTime = getReferenceDate().getTime();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const report: CommissionReport = {
    totalCommissions: filteredComms.length,
    brokerCommissionTotal: 0,
    financeCommissionTotal: 0,
    pendingValue: 0,
    paidValue: 0,
    pendingCount: 0,
    partialCount: 0,
    paidCount: 0,
    cancelledCount: 0,
    overdueCount: 0,
    dueSoonCount: 0,
    commissionDetails: []
  };

  filteredComms.forEach(c => {
    if (c.type === 'BROKER') report.brokerCommissionTotal += c.amount;
    else if (c.type === 'FINANCE') report.financeCommissionTotal += c.amount;

    if (c.status === 'PENDING') {
      report.pendingCount++;
      report.pendingValue += c.amount;
    } else if (c.status === 'PARTIAL') {
      report.partialCount++;
      report.pendingValue += c.amount; // simplification: partial still counts towards pending pipeline entirely for this basic view, or we could have a paidAmount field
    } else if (c.status === 'PAID') {
      report.paidCount++;
      report.paidValue += c.amount;
    } else if (c.status === 'CANCELLED') {
      report.cancelledCount++;
    }

    let isOverdue = false;
    let isDueSoon = false;

    if (c.dueDate && (c.status === 'PENDING' || c.status === 'PARTIAL')) {
      const dueTime = new Date(c.dueDate).getTime();
      if (dueTime < refTime) {
        isOverdue = true;
        report.overdueCount++;
      } else if (dueTime <= refTime + SEVEN_DAYS_MS) {
        isDueSoon = true;
        report.dueSoonCount++;
      }
    }

    report.commissionDetails.push({
      commission: c,
      isOverdue,
      isDueSoon
    });
  });

  report.commissionDetails.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return (a.commission.dueDate ? new Date(a.commission.dueDate).getTime() : 0) - 
           (b.commission.dueDate ? new Date(b.commission.dueDate).getTime() : 0);
  });

  return report;
}
