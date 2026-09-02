import { useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { getDashboardData } from '../../services/dashboard-service';
import { KpiCard } from '../../components/dashboard/kpi-card';
import { InventorySummary } from '../../components/dashboard/inventory-summary';
import { SalesPipeline } from '../../components/dashboard/sales-pipeline';
import { FollowUpTable } from '../../components/dashboard/follow-up-table';
import { RecentDeals } from '../../components/dashboard/recent-deals';
import { OperationalAlerts } from '../../components/dashboard/operational-alerts';
import { FinanceSummary } from '../../components/dashboard/finance-summary';
import { DocumentSummary } from '../../components/dashboard/document-summary';
import { ProfitabilitySummary } from '../../components/dashboard/profitability-summary';
import { formatINR, formatDate } from '../../utils/format';
import { 
  Truck, CheckCircle, Clock, Banknote, Users, 
  Handshake, Wallet, AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  // Compute dashboard metrics from mock data
  const data = useMemo(() => getDashboardData(), []);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Business Overview" 
        description="Business overview and operational status."
        actions={
          <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            Reporting Date: <span className="font-medium text-navy-900">{formatDate(data.refDate)}</span>
          </div>
        }
      />

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard 
          label="Total Trucks" 
          value={data.kpis.totalTrucks} 
          context="All inventory units" 
          Icon={Truck} 
          linkTo="/inventory" 
        />
        <KpiCard 
          label="Available" 
          value={data.kpis.availableTrucks} 
          context="Ready for sale" 
          Icon={CheckCircle} 
          linkTo="/inventory" 
        />
        <KpiCard 
          label="Reserved" 
          value={data.kpis.reservedTrucks} 
          context="Active reservations" 
          Icon={Clock} 
          linkTo="/inventory" 
        />
        <KpiCard 
          label="Inventory Value" 
          value={formatINR(data.kpis.inventoryValue)} 
          context="Current acquisition value" 
          Icon={Banknote} 
        />
        <KpiCard 
          label="Estimated Profit" 
          value={formatINR(data.kpis.estimatedProfit)} 
          context="Current deal/inventory data" 
          Icon={Banknote} 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        <KpiCard 
          label="Active Leads" 
          value={data.kpis.activeLeads} 
          context="In sales pipeline" 
          Icon={Users} 
          linkTo="/leads"
        />
        <KpiCard 
          label="Active Deals" 
          value={data.kpis.activeDeals} 
          context="In negotiation/booked" 
          Icon={Handshake} 
          linkTo="/deals"
        />
        <KpiCard 
          label="Sold Trucks" 
          value={data.kpis.soldTrucks} 
          context="Completed sales" 
          Icon={CheckCircle} 
        />
        <KpiCard 
          label="Active Loans" 
          value={data.kpis.activeLoans} 
          context="In processing/approved" 
          Icon={Wallet} 
          linkTo="/loans"
        />
        <KpiCard 
          label="Pending Fin. Comm." 
          value={formatINR(data.kpis.pendingFinanceCommValue)} 
          context="Expected from partners" 
          Icon={AlertCircle} 
          linkTo="/commissions"
        />
      </div>

      {/* CHARTS / SUMMARIES ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InventorySummary data={data.inventory} totalValue={data.kpis.inventoryValue} />
        </div>
        <div className="lg:col-span-1">
          <SalesPipeline data={data.pipeline} />
        </div>
      </div>

      {/* TABLES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FollowUpTable data={data.followUps} />
        </div>
        <div className="lg:col-span-1">
          <OperationalAlerts alerts={data.alerts} />
        </div>
      </div>

      {/* FULL WIDTH TABLE */}
      <RecentDeals data={data.recentDeals} />

      {/* FINANCIALS & HEALTH ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfitabilitySummary data={data.profitability} />
        <FinanceSummary data={data.finance} />
        <DocumentSummary data={data.documents} />
      </div>
    </div>
  );
}
