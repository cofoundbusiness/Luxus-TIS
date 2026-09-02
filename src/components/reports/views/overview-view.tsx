import { formatINR } from '../../../utils/format';
import type { InventoryReport } from '../../../services/reports/inventory-report';
import type { SalesReport } from '../../../services/reports/sales-report';
import type { LeadReport } from '../../../services/reports/commercial-report';
import type { ExpenseReport } from '../../../services/reports/expense-report';
import { Truck, Users, Activity, TrendingUp, IndianRupee, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OverviewViewProps {
  inventory: InventoryReport;
  sales: SalesReport;
  leads: LeadReport;
  expenses: ExpenseReport;
}

export function OverviewView({ inventory, sales, leads, expenses }: OverviewViewProps) {
  return (
    <div className="p-6 space-y-6">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Sales</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-1">{formatINR(sales.totalSalesValue)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium text-navy-900">{sales.completedDeals}</span> completed deals
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Profit</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-1">{formatINR(sales.totalRealizedProfit)}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Avg margin: <span className="font-medium text-navy-900">{sales.averageProfitMargin.toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Inventory Value</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-1">{formatINR(inventory.purchaseValue)}</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium text-navy-900">{inventory.availableUnits}</span> units available
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Expenses</p>
              <h3 className="text-2xl font-bold text-navy-900 mt-1">{formatINR(expenses.totalExpenseValue)}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Across <span className="font-medium text-navy-900">{expenses.totalExpenses}</span> records
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Inventory Quick Status */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-500" /> Inventory Health
            </h2>
            <Link to="/reports?tab=inventory" className="text-xs font-medium text-navy-600 hover:underline">View All</Link>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <div className="text-xs text-slate-500 mb-1">Average Age</div>
              <div className="text-lg font-bold text-navy-900">{inventory.averageAge} days</div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
              <div className="text-xs text-amber-800 mb-1">90+ Day Stock</div>
              <div className="text-lg font-bold text-amber-900 flex items-center gap-1.5">
                {inventory.ninetyPlusDays} units
                {inventory.ninetyPlusDays > 0 && <AlertCircle className="w-4 h-4 text-amber-500" />}
              </div>
            </div>
            <div className="col-span-2 text-sm text-slate-600 pt-2">
              <div className="flex justify-between items-center mb-1">
                <span>Available: {inventory.availableUnits}</span>
                <span>Reserved/Booked: {inventory.reservedUnits}</span>
                <span>Sold: {inventory.soldUnits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" /> Pipeline & Conversion
            </h2>
            <Link to="/reports?tab=leads" className="text-xs font-medium text-navy-600 hover:underline">View All</Link>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
             <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <div className="text-xs text-slate-500 mb-1">Active Leads</div>
              <div className="text-lg font-bold text-navy-900">{leads.activeLeads}</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
              <div className="text-xs text-slate-500 mb-1">Conversion Rate</div>
              <div className="text-lg font-bold text-navy-900">{leads.conversionRate.toFixed(1)}%</div>
            </div>
            <div className="col-span-2 mt-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${(leads.newLeads / leads.totalLeads) * 100}%` }} className="bg-blue-300 h-full"></div>
                <div style={{ width: `${((leads.contactedLeads + leads.interestedLeads + leads.negotiationLeads) / leads.totalLeads) * 100}%` }} className="bg-amber-400 h-full"></div>
                <div style={{ width: `${(leads.soldLeads / leads.totalLeads) * 100}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${(leads.lostLeads / leads.totalLeads) * 100}%` }} className="bg-slate-300 h-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 uppercase font-medium">
                <span>New</span>
                <span>Working</span>
                <span className="text-emerald-600">Won</span>
                <span>Lost</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
