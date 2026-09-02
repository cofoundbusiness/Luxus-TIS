import { leads, brokers, deals, customers } from '../../data/mock';
import { isDateInRange, getReferenceDate } from '../../utils/date-utils';
import type { DateRange } from '../../utils/date-utils';
import type { Lead, Broker } from '../../types';

export interface LeadReport {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  interestedLeads: number;
  negotiationLeads: number;
  bookedLeads: number;
  soldLeads: number;
  lostLeads: number;
  
  activeLeads: number;
  overdueFollowUps: number;
  upcomingFollowUps: number;
  
  conversionRate: number;
  leadsBySource: Record<string, { count: number; sold: number; conversion: number }>;
  
  leadsDetails: Array<{
    lead: Lead;
    customerName: string;
    brokerName: string;
    isOverdue: boolean;
  }>;
}

export interface BrokerReport {
  brokersDetails: Array<{
    broker: Broker;
    activeLeads: number;
    totalLeads: number;
    soldLeads: number;
    lostLeads: number;
    totalDeals: number;
    completedDeals: number;
    salesValue: number;
    conversionRate: number;
  }>;
}

export function generateLeadReport(dateRange: DateRange): LeadReport {
  // Using createdAt as the primary filter for leads
  const filteredLeads = leads.filter(l => isDateInRange(l.createdAt, dateRange));
  const refDate = getReferenceDate().getTime();

  const report: LeadReport = {
    totalLeads: filteredLeads.length,
    newLeads: 0,
    contactedLeads: 0,
    interestedLeads: 0,
    negotiationLeads: 0,
    bookedLeads: 0,
    soldLeads: 0,
    lostLeads: 0,
    activeLeads: 0,
    overdueFollowUps: 0,
    upcomingFollowUps: 0,
    conversionRate: 0,
    leadsBySource: {},
    leadsDetails: []
  };

  filteredLeads.forEach(lead => {
    // Stage counts
    if (lead.status === 'NEW') report.newLeads++;
    else if (lead.status === 'CONTACTED') report.contactedLeads++;
    else if (lead.status === 'INTERESTED') report.interestedLeads++;
    else if (lead.status === 'NEGOTIATION') report.negotiationLeads++;
    else if (lead.status === 'BOOKED') report.bookedLeads++;
    else if (lead.status === 'SOLD') report.soldLeads++;
    else if (lead.status === 'LOST') report.lostLeads++;

    // Active
    const isActive = lead.status !== 'SOLD' && lead.status !== 'LOST';
    if (isActive) report.activeLeads++;

    // Follow-ups
    let isOverdue = false;
    if (isActive && lead.nextFollowUp) {
      const followUpTime = new Date(lead.nextFollowUp).getTime();
      if (followUpTime < refDate) {
        report.overdueFollowUps++;
        isOverdue = true;
      } else {
        report.upcomingFollowUps++;
      }
    }

    // Source breakdown
    const source = lead.source || 'Unknown';
    if (!report.leadsBySource[source]) {
      report.leadsBySource[source] = { count: 0, sold: 0, conversion: 0 };
    }
    report.leadsBySource[source].count++;
    if (lead.status === 'SOLD') {
      report.leadsBySource[source].sold++;
    }

    const customer = customers.find(c => c.id === lead.customerId);
    const broker = brokers.find(b => b.id === lead.brokerId);

    report.leadsDetails.push({
      lead,
      customerName: customer ? customer.name : 'Unknown',
      brokerName: broker ? broker.name : 'Direct',
      isOverdue
    });
  });

  // Calculate conversions
  if (report.totalLeads > 0) {
    report.conversionRate = (report.soldLeads / report.totalLeads) * 100;
  }
  Object.keys(report.leadsBySource).forEach(source => {
    const s = report.leadsBySource[source];
    if (s.count > 0) {
      s.conversion = (s.sold / s.count) * 100;
    }
  });

  return report;
}

export function generateBrokerReport(dateRange: DateRange): BrokerReport {
  // Brokers are global, their performance metrics are filtered by dateRange of Deals/Leads
  const report: BrokerReport = {
    brokersDetails: []
  };

  brokers.forEach(broker => {
    const brokerLeads = leads.filter(l => l.brokerId === broker.id && isDateInRange(l.createdAt, dateRange));
    const brokerDeals = deals.filter(d => d.brokerId === broker.id && isDateInRange(d.saleDate, dateRange));

    let activeLeads = 0;
    let soldLeads = 0;
    let lostLeads = 0;

    brokerLeads.forEach(l => {
      if (l.status === 'SOLD') soldLeads++;
      else if (l.status === 'LOST') lostLeads++;
      else activeLeads++;
    });

    let completedDeals = 0;
    let salesValue = 0;

    brokerDeals.forEach(d => {
      if (d.status === 'COMPLETED') {
        completedDeals++;
        salesValue += d.salePrice;
      }
    });

    const conversionRate = brokerLeads.length > 0 ? (soldLeads / brokerLeads.length) * 100 : 0;

    report.brokersDetails.push({
      broker,
      activeLeads,
      totalLeads: brokerLeads.length,
      soldLeads,
      lostLeads,
      totalDeals: brokerDeals.length,
      completedDeals,
      salesValue,
      conversionRate
    });
  });

  // Sort by completed deals desc, then sales value desc
  report.brokersDetails.sort((a, b) => {
    if (b.completedDeals !== a.completedDeals) return b.completedDeals - a.completedDeals;
    return b.salesValue - a.salesValue;
  });

  return report;
}
