import { trucks } from '../../data/mock';
import { calculateDaysAgo, isDateInRange } from '../../utils/date-utils';
import type { DateRange } from '../../utils/date-utils';
import type { Truck } from '../../types';

export interface InventoryReport {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  preparationUnits: number;
  purchaseValue: number;
  expectedProfit: number;
  averageAge: number;
  ninetyPlusDays: number;
  byManufacturer: Record<string, number>;
  byStatus: Record<string, number>;
  byLocation: Record<string, number>;
  trucksDetails: Array<{
    truck: Truck;
    age: number;
    expectedProfit: number;
  }>;
}

export function generateInventoryReport(dateRange: DateRange): InventoryReport {
  // Inventory is generally current state, but if we need to filter by purchase date:
  const filteredTrucks = trucks.filter(t => isDateInRange(t.purchaseDate, dateRange));

  const report: InventoryReport = {
    totalUnits: filteredTrucks.length,
    availableUnits: 0,
    reservedUnits: 0,
    soldUnits: 0,
    preparationUnits: 0,
    purchaseValue: 0,
    expectedProfit: 0,
    averageAge: 0,
    ninetyPlusDays: 0,
    byManufacturer: {},
    byStatus: {},
    byLocation: {},
    trucksDetails: []
  };

  let totalAge = 0;

  filteredTrucks.forEach(t => {
    // Status counts
    report.byStatus[t.status] = (report.byStatus[t.status] || 0) + 1;
    if (t.status === 'AVAILABLE') report.availableUnits++;
    if (t.status === 'RESERVED') report.reservedUnits++;
    if (t.status === 'SOLD') report.soldUnits++;
    if (t.status === 'PENDING_DOCUMENTS' || t.status === 'UNDER_PREPARATION') report.preparationUnits++;

    // Value
    report.purchaseValue += t.purchasePrice;
    
    // Profit
    const profit = t.sellingPrice - t.purchasePrice;
    report.expectedProfit += profit;

    // Age
    const age = calculateDaysAgo(t.purchaseDate);
    totalAge += age;
    if (age >= 90) report.ninetyPlusDays++;

    // Breakdowns
    report.byManufacturer[t.manufacturer] = (report.byManufacturer[t.manufacturer] || 0) + 1;
    report.byLocation[t.location] = (report.byLocation[t.location] || 0) + 1;

    report.trucksDetails.push({
      truck: t,
      age,
      expectedProfit: profit
    });
  });

  if (report.totalUnits > 0) {
    report.averageAge = Math.round(totalAge / report.totalUnits);
  }

  // Sort details by age descending
  report.trucksDetails.sort((a, b) => b.age - a.age);

  return report;
}
