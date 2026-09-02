import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/page-header';
import { ReportFilterBar } from '../../components/reports/report-filter-bar';
import { ReportTabs } from '../../components/reports/report-tabs';
import type { DateRange } from '../../utils/date-utils';

import { generateInventoryReport } from '../../services/reports/inventory-report';
import { generateSalesReport } from '../../services/reports/sales-report';
import { generateLeadReport, generateBrokerReport } from '../../services/reports/commercial-report';
import { generateFinanceReport, generateCommissionReport } from '../../services/reports/finance-report';
import { generateExpenseReport } from '../../services/reports/expense-report';

import { OverviewView } from '../../components/reports/views/overview-view';
import { SalesView } from '../../components/reports/views/sales-view';
import { InventoryView } from '../../components/reports/views/inventory-view';
import { LeadsView } from '../../components/reports/views/leads-view';
import { BrokersView } from '../../components/reports/views/brokers-view';
import { FinanceView } from '../../components/reports/views/finance-view';
import { CommissionsView } from '../../components/reports/views/commissions-view';
import { ExpensesView } from '../../components/reports/views/expenses-view';

export default function ReportsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';

  const [dateRange, setDateRange] = useState<DateRange>('ALL_TIME');

  const inventoryReport = useMemo(() => generateInventoryReport(dateRange), [dateRange]);
  const salesReport = useMemo(() => generateSalesReport(dateRange), [dateRange]);
  const leadReport = useMemo(() => generateLeadReport(dateRange), [dateRange]);
  const brokerReport = useMemo(() => generateBrokerReport(dateRange), [dateRange]);
  const financeReport = useMemo(() => generateFinanceReport(dateRange), [dateRange]);
  const commissionReport = useMemo(() => generateCommissionReport(dateRange), [dateRange]);
  const expenseReport = useMemo(() => generateExpenseReport(dateRange), [dateRange]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 pb-12">
      <PageHeader 
        title="Reports" 
        description="Analyze inventory, sales, profitability, leads, brokers, finance and operating performance."
      />

      <ReportTabs />
      <ReportFilterBar dateRange={dateRange} onDateRangeChange={setDateRange} />

      <div className="flex-1">
        {currentTab === 'overview' && (
          <OverviewView 
            inventory={inventoryReport} 
            sales={salesReport} 
            leads={leadReport} 
            expenses={expenseReport} 
          />
        )}
        
        {currentTab === 'sales' && <SalesView sales={salesReport} />}
        {currentTab === 'inventory' && <InventoryView inventory={inventoryReport} />}
        {currentTab === 'leads' && <LeadsView leads={leadReport} />}
        {currentTab === 'brokers' && <BrokersView brokersReport={brokerReport} />}
        {currentTab === 'finance' && <FinanceView finance={financeReport} />}
        {currentTab === 'commissions' && <CommissionsView commissions={commissionReport} />}
        {currentTab === 'expenses' && <ExpensesView expenses={expenseReport} />}
      </div>
    </div>
  );
}
