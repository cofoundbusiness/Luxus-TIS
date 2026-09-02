import { documents, trucks, deals, loans } from '../../data/mock';
import type { Document } from '../../types';

export interface DocumentContext {
  document: Document;
  entityName: string;
  truckDetails?: string;
}

export const getDocumentContext = (doc: Document): DocumentContext => {
  let entityName = `${doc.entityType} (${doc.entityId})`;
  let truckDetails = undefined;

  if (doc.entityType === 'TRUCK') {
    const truck = trucks.find(t => t.id === doc.entityId);
    if (truck) {
      entityName = `${truck.manufacturer} ${truck.model}`;
      truckDetails = truck.registrationNumber;
    }
  } else if (doc.entityType === 'DEAL') {
    const deal = deals.find(d => d.id === doc.entityId);
    if (deal) {
      entityName = `Deal ${deal.id}`;
      const truck = trucks.find(t => t.id === deal.truckId);
      if (truck) {
        truckDetails = `${truck.manufacturer} ${truck.model} (${truck.registrationNumber})`;
      }
    }
  } else if (doc.entityType === 'LOAN') {
    const loan = loans.find(l => l.id === doc.entityId);
    if (loan) {
      entityName = `Loan ${loan.id}`;
      const truck = trucks.find(t => t.id === loan.truckId);
      if (truck) {
        truckDetails = `${truck.manufacturer} ${truck.model} (${truck.registrationNumber})`;
      }
    }
  }

  return { document: doc, entityName, truckDetails };
};

export const getDocumentSummary = (currentDocuments: Document[]) => {
  const total = currentDocuments.length;
  const available = currentDocuments.filter(d => d.status === 'AVAILABLE').length;
  const pending = currentDocuments.filter(d => d.status === 'PENDING').length;
  const expired = currentDocuments.filter(d => d.status === 'EXPIRED').length;

  return {
    total,
    available,
    pending,
    expired,
    attentionRequired: pending + expired
  };
};

export const searchDocuments = (currentDocuments: Document[], query: string, filters: { status: string, documentType: string, truckId: string }) => {
  const mapped = currentDocuments.map(getDocumentContext);

  return mapped.filter(ctx => {
    // Text search
    const searchString = `${ctx.document.name} ${ctx.document.documentType} ${ctx.entityName} ${ctx.truckDetails || ''}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());

    // Filters
    const matchesStatus = filters.status === 'All' || ctx.document.status === filters.status;
    const matchesType = filters.documentType === 'All' || ctx.document.documentType === filters.documentType;
    
    // Truck filter: if user selects a truck, it must either be the direct entity OR resolved through deal/loan
    let matchesTruck = true;
    if (filters.truckId !== 'All') {
      if (ctx.document.entityType === 'TRUCK') {
        matchesTruck = ctx.document.entityId === filters.truckId;
      } else if (ctx.document.entityType === 'DEAL') {
        const deal = deals.find(d => d.id === ctx.document.entityId);
        matchesTruck = deal?.truckId === filters.truckId;
      } else if (ctx.document.entityType === 'LOAN') {
        const loan = loans.find(l => l.id === ctx.document.entityId);
        matchesTruck = loan?.truckId === filters.truckId;
      } else {
        matchesTruck = false;
      }
    }

    return matchesQuery && matchesStatus && matchesType && matchesTruck;
  });
};

export const getDocumentById = (id: string) => {
  const doc = documents.find(d => d.id === id);
  return doc ? getDocumentContext(doc) : null;
};
