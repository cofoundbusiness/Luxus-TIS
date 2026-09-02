import { trucks, leads, commissions, loans, deals, expenses } from '../../data/mock';
import { calculateDaysAgo, getReferenceDate } from '../../utils/date-utils';
import { calculateDealProfit } from '../../calculations/deal-profit';
import { formatINR } from '../../utils/format';

export type InsightPriority = 'INFO' | 'ATTENTION' | 'CRITICAL';
export type InsightCategory = 'INVENTORY' | 'SALES' | 'PROFITABILITY' | 'LEADS' | 'BROKERS' | 'FINANCE' | 'COMMISSIONS' | 'EXPENSES';

export interface Insight {
  id: string;
  title: string;
  description: string;
  metric: string;
  priority: InsightPriority;
  category: InsightCategory;
  actionLink?: string;
  actionLabel?: string;
  timestamp: string;
}

export function generateInsights(): Insight[] {
  const insights: Insight[] = [];
  const refTime = getReferenceDate().getTime();
  const nowStr = new Date(refTime).toISOString();

  // 1. INVENTORY: 90+ Day Aging
  const agingTrucks = trucks.filter(t => t.status === 'AVAILABLE' && calculateDaysAgo(t.purchaseDate) >= 90);
  if (agingTrucks.length > 0) {
    insights.push({
      id: `ins-inv-age`,
      title: '90+ Day Inventory Requires Review',
      description: `${agingTrucks.length} available trucks have been in stock for over 90 days, tying up capital.`,
      metric: `${agingTrucks.length} Trucks`,
      priority: 'ATTENTION',
      category: 'INVENTORY',
      actionLink: '/reports',
      actionLabel: 'View Inventory Report',
      timestamp: nowStr
    });
  }

  // 2. LEADS: Overdue Follow-ups
  const overdueLeads = leads.filter(l => 
    l.status !== 'SOLD' && 
    l.status !== 'LOST' && 
    l.nextFollowUp && 
    new Date(l.nextFollowUp).getTime() < refTime
  );
  if (overdueLeads.length > 0) {
    insights.push({
      id: `ins-lead-overdue`,
      title: 'Overdue Lead Follow-ups',
      description: `${overdueLeads.length} active leads have missed their scheduled follow-up dates.`,
      metric: `${overdueLeads.length} Leads`,
      priority: overdueLeads.length > 5 ? 'CRITICAL' : 'ATTENTION',
      category: 'LEADS',
      actionLink: '/leads',
      actionLabel: 'Review Leads Pipeline',
      timestamp: nowStr
    });
  }

  // 3. COMMISSIONS: Pending Receivables / Payables
  const pendingComms = commissions.filter(c => c.status === 'PENDING' || c.status === 'PARTIAL');
  const overdueComms = pendingComms.filter(c => c.dueDate && new Date(c.dueDate).getTime() < refTime);
  
  if (overdueComms.length > 0) {
    const overdueValue = overdueComms.reduce((sum, c) => sum + c.amount, 0);
    insights.push({
      id: `ins-comm-overdue`,
      title: 'Overdue Commissions',
      description: `There are ${overdueComms.length} commissions past their due date requiring settlement.`,
      metric: formatINR(overdueValue),
      priority: 'ATTENTION',
      category: 'COMMISSIONS',
      actionLink: '/commissions',
      actionLabel: 'Review Commissions',
      timestamp: nowStr
    });
  }

  // 4. EXPENSES: High Expense Trucks
  const truckExpenses = expenses.reduce((acc, exp) => {
    if (exp.truckId) {
      acc[exp.truckId] = (acc[exp.truckId] || 0) + exp.amount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  let maxExpenseTruckId: string | null = null;
  let maxExpenseAmount = 0;
  Object.keys(truckExpenses).forEach(truckId => {
    if (truckExpenses[truckId] > maxExpenseAmount) {
      maxExpenseAmount = truckExpenses[truckId];
      maxExpenseTruckId = truckId;
    }
  });

  if (maxExpenseTruckId && maxExpenseAmount > 50000) { // arbitrary threshold for insight surfacing just for demo purposes if high
    const t = trucks.find(x => x.id === maxExpenseTruckId);
    if (t) {
      insights.push({
        id: `ins-exp-high`,
        title: 'Highest Recorded Truck Expense',
        description: `${t.registrationNumber} (${t.manufacturer}) has incurred significant operational expenses.`,
        metric: formatINR(maxExpenseAmount),
        priority: 'INFO',
        category: 'EXPENSES',
        actionLink: `/inventory/${t.id}`,
        actionLabel: 'View Truck',
        timestamp: nowStr
      });
    }
  }

  // 5. FINANCE: Rejected Loans
  const rejectedLoans = loans.filter(l => l.status === 'REJECTED');
  if (rejectedLoans.length > 0) {
    insights.push({
      id: `ins-fin-rejected`,
      title: 'Rejected Loan Applications',
      description: `${rejectedLoans.length} financing applications have been rejected by partners. Deal structures may need revision.`,
      metric: `${rejectedLoans.length} Loans`,
      priority: 'ATTENTION',
      category: 'FINANCE',
      actionLink: '/loans',
      actionLabel: 'View Loans',
      timestamp: nowStr
    });
  }

  // 6. PROFITABILITY: Top Profitable Deal
  let topDealId: string | null = null;
  let topProfit = 0;
  
  deals.filter(d => d.status === 'COMPLETED').forEach(deal => {
    const truck = trucks.find(t => t.id === deal.truckId);
    if (truck) {
      const dealExpenses = expenses.filter(e => e.dealId === deal.id || e.truckId === truck.id);
      const brokerComms = commissions.filter(c => c.dealId === deal.id && c.type === 'BROKER');
      const financeComms = commissions.filter(c => c.dealId === deal.id && c.type === 'FINANCE');
      
      const profit = calculateDealProfit(deal, truck, dealExpenses, brokerComms, financeComms);
      if (profit > topProfit) {
        topProfit = profit;
        topDealId = deal.id;
      }
    }
  });

  if (topDealId && topProfit > 0) {
    insights.push({
      id: `ins-prof-top`,
      title: 'Highest Realized Profit',
      description: `Deal ${topDealId} generated the highest net contribution among completed sales.`,
      metric: formatINR(topProfit),
      priority: 'INFO',
      category: 'PROFITABILITY',
      actionLink: `/deals/${topDealId}`,
      actionLabel: 'View Deal',
      timestamp: nowStr
    });
  }

  // Sort by priority (CRITICAL -> ATTENTION -> INFO)
  const priorityScore = { CRITICAL: 3, ATTENTION: 2, INFO: 1 };
  insights.sort((a, b) => priorityScore[b.priority] - priorityScore[a.priority]);

  return insights;
}
