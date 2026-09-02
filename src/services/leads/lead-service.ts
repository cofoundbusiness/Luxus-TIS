import { leads, customers, trucks, brokers, deals, activities, MOCK_REFERENCE_DATE } from '../../data/mock';
import type { Lead, Deal, Activity } from '../../types';

export interface LeadContext {
  lead: Lead;
  customerName: string;
  customerCompany?: string;
  customerPhone: string;
  truckDetails?: string;
  brokerName?: string;
}

export const getLeadContext = (ld: Lead): LeadContext => {
  const customer = customers.find(c => c.id === ld.customerId);
  const truck = ld.truckId ? trucks.find(t => t.id === ld.truckId) : undefined;
  const broker = ld.brokerId ? brokers.find(b => b.id === ld.brokerId) : undefined;

  return {
    lead: ld,
    customerName: customer?.name || 'Unknown',
    customerCompany: customer?.companyName,
    customerPhone: customer?.phone || '',
    truckDetails: truck ? `${truck.manufacturer} ${truck.model} (${truck.registrationNumber})` : undefined,
    brokerName: broker?.name
  };
};

export const getLeadSummary = (currentLeads: Lead[]) => {
  const total = currentLeads.length;
  const activeLeads = currentLeads.filter(l => l.status !== 'SOLD' && l.status !== 'LOST');
  
  const newCount = currentLeads.filter(l => l.status === 'NEW').length;
  const negotiationCount = currentLeads.filter(l => l.status === 'NEGOTIATION').length;
  const bookedCount = currentLeads.filter(l => l.status === 'BOOKED').length;

  const refTime = new Date(MOCK_REFERENCE_DATE).getTime();
  const overdueCount = activeLeads.filter(l => {
    if (!l.nextFollowUp) return false;
    return new Date(l.nextFollowUp).getTime() < refTime;
  }).length;

  return {
    total,
    activeCount: activeLeads.length,
    newCount,
    negotiationCount,
    bookedCount,
    overdueCount
  };
};

export const getLeadPipeline = (currentLeads: Lead[]) => {
  const counts = {
    NEW: 0,
    CONTACTED: 0,
    INTERESTED: 0,
    NEGOTIATION: 0,
    BOOKED: 0,
    SOLD: 0,
    LOST: 0
  };

  currentLeads.forEach(l => {
    if (counts[l.status as keyof typeof counts] !== undefined) {
      counts[l.status as keyof typeof counts]++;
    }
  });

  return counts;
};

export const searchLeads = (
  currentLeads: Lead[],
  query: string,
  filters: { status: string, source: string, brokerId: string, truckId: string, assignedTo: string }
) => {
  const mapped = currentLeads.map(getLeadContext);

  return mapped.filter(ctx => {
    const { lead, customerName, customerCompany, customerPhone, truckDetails, brokerName } = ctx;

    const searchString = `${customerName} ${customerCompany || ''} ${customerPhone} ${truckDetails || ''} ${brokerName || ''} ${lead.requirement} ${lead.source} ${lead.notes || ''}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());

    const matchesStatus = filters.status === 'All' || lead.status === filters.status;
    const matchesSource = filters.source === 'All' || lead.source === filters.source;
    const matchesBroker = filters.brokerId === 'All' || lead.brokerId === filters.brokerId;
    const matchesTruck = filters.truckId === 'All' || lead.truckId === filters.truckId;
    const matchesAssigned = filters.assignedTo === 'All' || lead.assignedTo === filters.assignedTo;

    return matchesQuery && matchesStatus && matchesSource && matchesBroker && matchesTruck && matchesAssigned;
  });
};

export const getLeadById = (id: string) => {
  const ld = leads.find(l => l.id === id);
  return ld ? getLeadContext(ld) : null;
};

export const getFollowUpStatus = (nextFollowUp: string | undefined, status: string): 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'NONE' => {
  if (!nextFollowUp) return 'NONE';
  if (status === 'SOLD' || status === 'LOST') return 'NONE'; // terminal states don't have active followups typically

  const followUpTime = new Date(nextFollowUp).getTime();
  const refTime = new Date(MOCK_REFERENCE_DATE).getTime();
  
  // To check if it's "TODAY", we compare just the YYYY-MM-DD parts
  const followUpDateStr = new Date(nextFollowUp).toISOString().split('T')[0];
  const refDateStr = new Date(MOCK_REFERENCE_DATE).toISOString().split('T')[0];

  if (followUpDateStr === refDateStr) return 'TODAY';
  if (followUpTime < refTime) return 'OVERDUE';
  return 'UPCOMING';
};

export const getLeadActivities = (leadId: string): Activity[] => {
  return activities.filter(a => a.entityType === 'LEAD' && a.entityId === leadId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getRelatedLeads = (customerId: string, excludeLeadId: string): LeadContext[] => {
  return leads
    .filter(l => l.customerId === customerId && l.id !== excludeLeadId)
    .map(getLeadContext);
};

export const getLeadDeal = (leadId: string): Deal | undefined => {
  // Try to find if a deal exists loosely connected. In TiS, Deals have customerId and truckId.
  // There is no strict deal.leadId right now, but if the lead is SOLD, check if there's a deal with same customer and truck.
  const ld = leads.find(l => l.id === leadId);
  if (!ld || !ld.truckId) return undefined;
  return deals.find(d => d.customerId === ld.customerId && d.truckId === ld.truckId);
};
