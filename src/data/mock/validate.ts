import { truckSchema, leadSchema, brokerSchema, dealSchema, loanSchema } from '../../validations';
import { trucks } from './trucks';
import { leads } from './leads';
import { brokers } from './entities';
import { deals } from './deals';
import { loans } from './loans';

/**
 * Validates the current mock dataset against Zod schemas.
 * Throws errors if data is invalid. 
 * This is useful during development to ensure mock data consistency.
 */
export const validateMockData = () => {
  let errors = 0;

  trucks.forEach(t => {
    const res = truckSchema.safeParse(t);
    if (!res.success) {
      console.error(`Validation error for Truck ${t.id}:`, res.error.format());
      errors++;
    }
  });

  leads.forEach(l => {
    const res = leadSchema.safeParse(l);
    if (!res.success) {
      console.error(`Validation error for Lead ${l.id}:`, res.error.format());
      errors++;
    }
  });

  brokers.forEach(b => {
    const res = brokerSchema.safeParse(b);
    if (!res.success) {
      console.error(`Validation error for Broker ${b.id}:`, res.error.format());
      errors++;
    }
  });

  deals.forEach(d => {
    const res = dealSchema.safeParse(d);
    if (!res.success) {
      console.error(`Validation error for Deal ${d.id}:`, res.error.format());
      errors++;
    }
  });

  loans.forEach(l => {
    const res = loanSchema.safeParse(l);
    if (!res.success) {
      console.error(`Validation error for Loan ${l.id}:`, res.error.format());
      errors++;
    }
  });

  if (errors > 0) {
    throw new Error(`Mock data validation failed with ${errors} errors. See console for details.`);
  }

  return true;
};
