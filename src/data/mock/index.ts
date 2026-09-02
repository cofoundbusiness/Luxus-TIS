export * from './constants';
export * from './entities';
export * from './trucks';
export * from './deals';
export * from './loans';
export * from './commissions';
export * from './leads';
export * from './expenses';
export * from './documents';
export * from './activities';

// Selectors
import { trucks } from './trucks';
import { customers, brokers, financePartners } from './entities';
import { deals } from './deals';
import { loans } from './loans';
import { commissions } from './commissions';
import { leads } from './leads';
import { expenses } from './expenses';
import { documents } from './documents';

export const getTruckById = (id: string) => trucks.find(t => t.id === id);
export const getCustomerById = (id: string) => customers.find(c => c.id === id);
export const getBrokerById = (id: string) => brokers.find(b => b.id === id);
export const getDealById = (id: string) => deals.find(d => d.id === id);
export const getLoanById = (id: string) => loans.find(l => l.id === id);
export const getFinancePartnerById = (id: string) => financePartners.find(fp => fp.id === id);
export const getLeadsByTruckId = (id: string) => leads.filter(l => l.truckId === id);
export const getExpensesByTruckId = (id: string) => expenses.filter(e => e.truckId === id);
export const getExpensesByDealId = (id: string) => expenses.filter(e => e.dealId === id);
export const getCommissionsByDealId = (id: string) => commissions.filter(c => c.dealId === id);
export const getDocumentsByEntity = (type: string, id: string) => documents.filter(d => d.entityType === type && d.entityId === id);
