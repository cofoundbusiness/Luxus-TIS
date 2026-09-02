import { trucks, expenses, leads, deals, activities, documents, MOCK_REFERENCE_DATE, customers, brokers } from '../data/mock';
import type { Truck } from '../types';
import { calculateTruckProfit } from '../calculations/truck-profit';
import { getDaysDifference } from '../utils/format';

export const getInventorySummary = (currentTrucks: Truck[]) => {
  const available = currentTrucks.filter(t => t.status === 'AVAILABLE').length;
  const reserved = currentTrucks.filter(t => t.status === 'RESERVED').length;
  const underPrep = currentTrucks.filter(t => t.status === 'UNDER_PREPARATION').length;
  const pendingDocs = currentTrucks.filter(t => t.status === 'PENDING_DOCUMENTS').length;
  const sold = currentTrucks.filter(t => t.status === 'SOLD').length;
  
  const unsold = currentTrucks.filter(t => t.status !== 'SOLD');
  const inventoryValue = unsold.reduce((sum, t) => sum + t.purchasePrice, 0);
  
  return {
    total: currentTrucks.length,
    available,
    reserved,
    underPrep,
    pendingDocs,
    sold,
    inventoryValue
  };
};

export const searchTrucks = (currentTrucks: Truck[], query: string, filters: { status: string, manufacturer: string, location: string, fuelType: string }) => {
  return currentTrucks.filter(t => {
    // Search
    const searchString = `${t.registrationNumber} ${t.manufacturer} ${t.model} ${t.variant} ${t.chassisNumber} ${t.location}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    
    // Filters
    const matchesStatus = filters.status === 'All' || t.status === filters.status;
    const matchesMfg = filters.manufacturer === 'All' || t.manufacturer === filters.manufacturer;
    const matchesLoc = filters.location === 'All' || t.location === filters.location;
    const matchesFuel = filters.fuelType === 'All' || t.fuelType === filters.fuelType;

    return matchesQuery && matchesStatus && matchesMfg && matchesLoc && matchesFuel;
  });
};

export const getTruckDetails = (truckId: string) => {
  return trucks.find(t => t.id === truckId);
};

export const getTruckExpenses = (truckId: string) => {
  return expenses.filter(e => e.truckId === truckId);
};

export const getTruckProfit = (truck: Truck) => {
  const truckExpenses = getTruckExpenses(truck.id);
  return calculateTruckProfit(truck, truckExpenses);
};

export const getTruckDocuments = (truckId: string) => {
  return documents.filter(d => d.entityType === 'TRUCK' && d.entityId === truckId);
};

export const getTruckLeads = (truckId: string) => {
  return leads.filter(l => l.truckId === truckId).map(l => ({
    ...l,
    customerName: customers.find(c => c.id === l.customerId)?.name || 'Unknown',
    brokerName: l.brokerId ? brokers.find(b => b.id === l.brokerId)?.name : 'Direct'
  }));
};

export const getTruckDeal = (truckId: string) => {
  const deal = deals.find(d => d.truckId === truckId);
  if (!deal) return null;
  return {
    ...deal,
    customerName: customers.find(c => c.id === deal.customerId)?.name || 'Unknown',
    brokerName: deal.brokerId ? brokers.find(b => b.id === deal.brokerId)?.name : 'Direct'
  };
};

export const getTruckActivities = (truckId: string) => {
  return activities
    .filter(a => a.entityType === 'TRUCK' && a.entityId === truckId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getInventoryAge = (purchaseDate: string) => {
  return getDaysDifference(purchaseDate, MOCK_REFERENCE_DATE);
};

export const checkDocumentWarning = (truck: Truck) => {
  if (truck.status === 'PENDING_DOCUMENTS') return true;
  const docs = getTruckDocuments(truck.id);
  return docs.some(d => d.status === 'PENDING' || d.status === 'EXPIRED');
};
