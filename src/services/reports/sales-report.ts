import { deals, trucks, expenses, commissions, brokers, customers } from '../../data/mock';
import { isDateInRange } from '../../utils/date-utils';
import type { DateRange } from '../../utils/date-utils';
import { calculateDealProfit } from '../../calculations/deal-profit';
import type { Deal, Truck, Broker, Customer } from '../../types';

export interface SalesReport {
  totalDeals: number;
  completedDeals: number;
  negotiationDeals: number;
  bookedDeals: number;
  cancelledDeals: number;
  
  totalSalesValue: number;
  averageSaleValue: number;
  
  totalRealizedProfit: number;
  averageDealProfit: number;
  averageProfitMargin: number;

  salesByManufacturer: Record<string, number>;
  salesByBroker: Record<string, number>;
  
  dealDetails: Array<{
    deal: Deal;
    truck: Truck | undefined;
    broker: Broker | undefined;
    customer: Customer | undefined;
    profit: number;
    margin: number;
  }>;
}

export function generateSalesReport(dateRange: DateRange): SalesReport {
  const filteredDeals = deals.filter(d => isDateInRange(d.saleDate, dateRange));

  const report: SalesReport = {
    totalDeals: filteredDeals.length,
    completedDeals: 0,
    negotiationDeals: 0,
    bookedDeals: 0,
    cancelledDeals: 0,
    totalSalesValue: 0,
    averageSaleValue: 0,
    totalRealizedProfit: 0,
    averageDealProfit: 0,
    averageProfitMargin: 0,
    salesByManufacturer: {},
    salesByBroker: {},
    dealDetails: []
  };

  filteredDeals.forEach(deal => {
    // Status counts
    if (deal.status === 'COMPLETED') report.completedDeals++;
    else if (deal.status === 'NEGOTIATION') report.negotiationDeals++;
    else if (deal.status === 'BOOKED') report.bookedDeals++;
    else if (deal.status === 'CANCELLED') report.cancelledDeals++;

    const truck = trucks.find(t => t.id === deal.truckId);
    const broker = brokers.find(b => b.id === deal.brokerId);
    const customer = customers.find(c => c.id === deal.customerId);
    
    let profit = 0;
    let margin = 0;

    // Only COMPLETED deals count for realized revenue and profit
    if (deal.status === 'COMPLETED') {
      report.totalSalesValue += deal.salePrice;

      if (truck) {
        // Collect related expenses and commissions
        const dealExpenses = expenses.filter(e => e.dealId === deal.id || e.truckId === truck.id);
        const brokerComms = commissions.filter(c => c.dealId === deal.id && c.type === 'BROKER');
        const financeComms = commissions.filter(c => c.dealId === deal.id && c.type === 'FINANCE');

        profit = calculateDealProfit(deal, truck, dealExpenses, brokerComms, financeComms);
        report.totalRealizedProfit += profit;
        
        if (deal.salePrice > 0) {
          margin = (profit / deal.salePrice) * 100;
        }

        // Breakdowns
        report.salesByManufacturer[truck.manufacturer] = (report.salesByManufacturer[truck.manufacturer] || 0) + 1;
        if (broker) {
          report.salesByBroker[broker.name] = (report.salesByBroker[broker.name] || 0) + 1;
        } else {
          report.salesByBroker['Direct'] = (report.salesByBroker['Direct'] || 0) + 1;
        }
      }
    }

    report.dealDetails.push({
      deal,
      truck,
      broker,
      customer,
      profit,
      margin
    });
  });

  if (report.completedDeals > 0) {
    report.averageSaleValue = report.totalSalesValue / report.completedDeals;
    report.averageDealProfit = report.totalRealizedProfit / report.completedDeals;
    if (report.totalSalesValue > 0) {
      report.averageProfitMargin = (report.totalRealizedProfit / report.totalSalesValue) * 100;
    }
  }

  // Sort details by completed first, then by date
  report.dealDetails.sort((a, b) => {
    if (a.deal.status === 'COMPLETED' && b.deal.status !== 'COMPLETED') return -1;
    if (a.deal.status !== 'COMPLETED' && b.deal.status === 'COMPLETED') return 1;
    return new Date(b.deal.saleDate).getTime() - new Date(a.deal.saleDate).getTime();
  });

  return report;
}
