import { 
  MOCK_REFERENCE_DATE, 
  trucks, leads, deals, loans, commissions, documents, customers, brokers, expenses 
} from '../data/mock';
import { calculateDealProfit } from '../calculations/deal-profit';
import { getDaysDifference, isOverdue } from '../utils/format';
import type { AlertData } from '../components/dashboard/operational-alerts';

export const getDashboardData = () => {
  const refDate = MOCK_REFERENCE_DATE;

  // Inventory basic counts
  const availableTrucks = trucks.filter(t => t.status === 'AVAILABLE');
  const reservedTrucks = trucks.filter(t => t.status === 'RESERVED');
  const soldTrucks = trucks.filter(t => t.status === 'SOLD');
  const underPrepTrucks = trucks.filter(t => t.status === 'UNDER_PREPARATION');
  const pendingDocsTrucks = trucks.filter(t => t.status === 'PENDING_DOCUMENTS');

  const unsoldTrucks = trucks.filter(t => t.status !== 'SOLD');
  const inventoryValue = unsoldTrucks.reduce((sum, t) => sum + t.purchasePrice, 0);
  const estimatedInventoryProfit = unsoldTrucks.reduce((sum, t) => sum + t.expectedProfit, 0);

  // Completed Deals Profit
  const completedDeals = deals.filter(d => d.status === 'COMPLETED');
  const completedDealProfit = completedDeals.reduce((sum, deal) => {
    const truck = trucks.find(t => t.id === deal.truckId);
    if (!truck) return sum;
    const dealExpenses = expenses.filter(e => e.dealId === deal.id || e.truckId === truck.id);
    const brokerComms = commissions.filter(c => c.dealId === deal.id && c.type === 'BROKER');
    const financeComms = commissions.filter(c => c.dealId === deal.id && c.type === 'FINANCE');
    return sum + calculateDealProfit(deal, truck, dealExpenses, brokerComms, financeComms);
  }, 0);

  const completedDealRevenue = completedDeals.reduce((sum, d) => sum + d.salePrice, 0);

  // Leads
  const activeLeads = leads.filter(l => l.status !== 'SOLD' && l.status !== 'LOST');
  const pipeline = {
    NEW: leads.filter(l => l.status === 'NEW').length,
    CONTACTED: leads.filter(l => l.status === 'CONTACTED').length,
    INTERESTED: leads.filter(l => l.status === 'INTERESTED').length,
    NEGOTIATION: leads.filter(l => l.status === 'NEGOTIATION').length,
    BOOKED: leads.filter(l => l.status === 'BOOKED').length,
    SOLD: leads.filter(l => l.status === 'SOLD').length,
    LOST: leads.filter(l => l.status === 'LOST').length,
  };

  // Follow-ups
  const followUps = activeLeads
    .filter(l => l.nextFollowUp)
    .map(l => ({
      ...l,
      customerName: customers.find(c => c.id === l.customerId)?.name || 'Unknown',
      truckRef: l.truckId ? (trucks.find(t => t.id === l.truckId)?.model || l.truckId) : 'Any',
      brokerName: l.brokerId ? (brokers.find(b => b.id === l.brokerId)?.name || l.brokerId) : 'Direct',
      isOverdue: isOverdue(l.nextFollowUp!, refDate),
      isToday: getDaysDifference(refDate, l.nextFollowUp!) === 0
    }))
    .sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime());

  // Recent Deals
  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 5)
    .map(d => ({
      ...d,
      customerName: customers.find(c => c.id === d.customerId)?.name || 'Unknown',
      truckModel: trucks.find(t => t.id === d.truckId)?.model || 'Unknown',
      brokerName: d.brokerId ? (brokers.find(b => b.id === d.brokerId)?.name || 'Direct') : 'Direct'
    }));

  // Finance & Commissions
  const activeLoans = loans.filter(l => l.status !== 'DISBURSED' && l.status !== 'REJECTED');
  const pendingFinanceComms = commissions.filter(c => c.type === 'FINANCE' && c.status === 'PENDING');
  const pendingFinanceCommValue = pendingFinanceComms.reduce((sum, c) => sum + c.amount, 0);
  const receivedFinanceCommValue = commissions.filter(c => c.type === 'FINANCE' && c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);
  const brokerCommPaid = commissions.filter(c => c.type === 'BROKER' && c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);
  const brokerCommPending = commissions.filter(c => c.type === 'BROKER' && c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0);

  // Documents
  const pendingDocs = documents.filter(d => d.status === 'PENDING');
  const expiredDocs = documents.filter(d => d.status === 'EXPIRED');

  // Aging
  const aging = {
    '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0
  };
  unsoldTrucks.forEach(t => {
    const days = getDaysDifference(t.purchaseDate, refDate);
    if (days <= 30) aging['0-30']++;
    else if (days <= 60) aging['31-60']++;
    else if (days <= 90) aging['61-90']++;
    else aging['90+']++;
  });

  // Alerts
  const alerts: AlertData[] = [];
  
  if (aging['90+'] > 0) {
    alerts.push({ id: 'a1', severity: 'Warning', title: 'Aging Inventory', message: `${aging['90+']} trucks in stock for over 90 days.`, link: '/inventory' });
  }
  if (pendingDocs.length > 0) {
    alerts.push({ id: 'a2', severity: 'Attention', title: 'Pending Documents', message: `${pendingDocs.length} documents are missing.`, link: '/inventory' });
  }
  if (expiredDocs.length > 0) {
    alerts.push({ id: 'a3', severity: 'Critical', title: 'Expired Documents', message: `${expiredDocs.length} documents have expired.`, link: '/inventory' });
  }
  const overdueFollowUps = followUps.filter(f => f.isOverdue).length;
  if (overdueFollowUps > 0) {
    alerts.push({ id: 'a4', severity: 'Warning', title: 'Overdue Follow-ups', message: `${overdueFollowUps} leads require immediate attention.`, link: '/leads' });
  }
  if (pendingFinanceComms.length > 0) {
    alerts.push({ id: 'a5', severity: 'Info', title: 'Pending Finance Commission', message: `${pendingFinanceComms.length} payouts expected from partners.`, link: '/commissions' });
  }
  const cancelledDeals = deals.filter(d => d.status === 'CANCELLED');
  if (cancelledDeals.length > 0) {
    alerts.push({ id: 'a6', severity: 'Attention', title: 'Cancelled Deals', message: `${cancelledDeals.length} deals were recently cancelled.`, link: '/deals' });
  }
  const rejectedLoans = loans.filter(l => l.status === 'REJECTED');
  if (rejectedLoans.length > 0) {
    alerts.push({ id: 'a7', severity: 'Critical', title: 'Rejected Loans', message: `${rejectedLoans.length} loans rejected, blocking deals.`, link: '/loans' });
  }

  return {
    kpis: {
      totalTrucks: trucks.length,
      availableTrucks: availableTrucks.length,
      reservedTrucks: reservedTrucks.length,
      soldTrucks: soldTrucks.length,
      inventoryValue,
      estimatedProfit: estimatedInventoryProfit + completedDealProfit,
      activeLeads: activeLeads.length,
      activeDeals: deals.filter(d => d.status !== 'COMPLETED' && d.status !== 'CANCELLED').length,
      activeLoans: activeLoans.length,
      pendingFinanceCommValue
    },
    inventory: {
      available: availableTrucks.length,
      reserved: reservedTrucks.length,
      underPrep: underPrepTrucks.length,
      pendingDocs: pendingDocsTrucks.length,
      sold: soldTrucks.length,
      aging
    },
    pipeline,
    followUps,
    recentDeals,
    finance: {
      applications: loans.filter(l => l.status === 'APPLICATION').length,
      processingOrApproved: loans.filter(l => l.status === 'PROCESSING' || l.status === 'APPROVED').length,
      disbursed: loans.filter(l => l.status === 'DISBURSED').length,
      pendingCommValue: pendingFinanceCommValue,
      receivedCommValue: receivedFinanceCommValue
    },
    documents: {
      available: documents.filter(d => d.status === 'AVAILABLE').length,
      pending: pendingDocs.length,
      expired: expiredDocs.length
    },
    profitability: {
      currentInventoryCost: inventoryValue,
      estimatedInventoryGrossProfit: estimatedInventoryProfit,
      completedDealRevenue,
      completedDealProfit,
      financeCommissionReceived: receivedFinanceCommValue,
      brokerCommissionPaid: brokerCommPaid,
      brokerCommissionPending: brokerCommPending
    },
    alerts,
    refDate
  };
};
