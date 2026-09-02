import { formatINR } from '../../../utils/format';
import type { InventoryReport } from '../../../services/reports/inventory-report';
import { Link } from 'react-router-dom';
import { Ban, AlertCircle, MapPin } from 'lucide-react';

interface InventoryViewProps {
  inventory: InventoryReport;
}

export function InventoryView({ inventory }: InventoryViewProps) {
  return (
    <div className="p-6 space-y-6">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Inventory</div>
          <div className="text-xl font-bold text-navy-900">{inventory.totalUnits} Units</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">{inventory.availableUnits} Available</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Purchase Value</div>
          <div className="text-xl font-bold text-navy-900">{formatINR(inventory.purchaseValue)}</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Average Age</div>
          <div className="text-xl font-bold text-navy-900">{inventory.averageAge} Days</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">90+ Day Aging</div>
          <div className={`text-xl font-bold ${inventory.ninetyPlusDays > 0 ? 'text-amber-600' : 'text-navy-900'} flex items-center gap-2`}>
            {inventory.ninetyPlusDays} Units
            {inventory.ninetyPlusDays > 0 && <AlertCircle className="w-5 h-5" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-sm text-navy-900">Status Distribution</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(inventory.byStatus).length > 0 ? (
              Object.entries(inventory.byStatus).sort((a,b) => b[1] - a[1]).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{status}</span>
                  <span className="font-bold text-navy-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>

        {/* Manufacturer Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-sm text-navy-900">Top Manufacturers</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(inventory.byManufacturer).length > 0 ? (
              Object.entries(inventory.byManufacturer).sort((a,b) => b[1] - a[1]).map(([mfg, count]) => (
                <div key={mfg} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{mfg}</span>
                  <span className="font-bold text-navy-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-sm text-navy-900">Locations</h3>
          </div>
          <div className="p-4 space-y-3">
            {Object.keys(inventory.byLocation).length > 0 ? (
              Object.entries(inventory.byLocation).sort((a,b) => b[1] - a[1]).map(([loc, count]) => (
                <div key={loc} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{loc}</span>
                  <span className="font-bold text-navy-900">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-slate-500">No data</div>
            )}
          </div>
        </div>

      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-sm text-navy-900">Inventory Details</h3>
        </div>
        <div className="overflow-x-auto">
          {inventory.trucksDetails.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Truck</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Age (Days)</th>
                  <th className="px-4 py-3 font-medium text-right">Purchase Price</th>
                  <th className="px-4 py-3 font-medium text-right">Selling Price</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.trucksDetails.map(({ truck, age }) => (
                  <tr key={truck.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/inventory/${truck.id}`} className="font-medium text-navy-900 hover:underline">
                        {truck.registrationNumber}
                      </Link>
                      <div className="text-xs text-slate-500">{truck.manufacturer} {truck.model}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        truck.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                        truck.status === 'SOLD' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {truck.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${age >= 90 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {age}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(truck.purchasePrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-navy-900">
                      {formatINR(truck.sellingPrice)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {truck.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-slate-500">
              <Ban className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No inventory matching the selected period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
