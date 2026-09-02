import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Truck as TruckIcon, User, Briefcase, FileText, IndianRupee, Activity as ActivityIcon, CheckCircle, Clock, FileCheck, Ban, AlertTriangle } from 'lucide-react';
import { 
  getDealById, 
  getDealExpenses, 
  getDealLoans, 
  getDealCommissions, 
  getDealActivities 
} from '../../services/deals/deal-service';
import { formatDate, formatINR } from '../../utils/format';
import { DealFormModal } from '../../components/deals/deal-form-modal';
import { DealStatusBadge } from '../../components/deals/deal-status-badge';
import type { Deal } from '../../types';


export default function DealDetailsPage() {
  const { dealId } = useParams<{ dealId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localDealOverride, setLocalDealOverride] = useState<Deal | null>(null);

  const baseContext = useMemo(() => {
    if (!dealId) return null;
    return getDealById(dealId);
  }, [dealId]);

  const dealContext = useMemo(() => {
    if (!baseContext) return null;
    if (localDealOverride) {
      // Re-evaluate context with local override (mostly for updated realized profit)
      return {
        ...baseContext,
        deal: localDealOverride,
      };
    }
    return baseContext;
  }, [baseContext, localDealOverride]);

  const expensesList = useMemo(() => {
    if (!dealContext || !dealContext.truck) return [];
    return getDealExpenses(dealContext.deal.id, dealContext.truck.id);
  }, [dealContext]);

  const loansList = useMemo(() => {
    if (!dealId) return [];
    return getDealLoans(dealId);
  }, [dealId]);

  const commissionsList = useMemo(() => {
    if (!dealId) return [];
    return getDealCommissions(dealId);
  }, [dealId]);

  const activitiesList = useMemo(() => {
    if (!dealId) return [];
    return getDealActivities(dealId);
  }, [dealId]);
  


  if (!dealContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Deal not found</h1>
        <p className="text-slate-500 mb-6">The transaction record you are looking for does not exist.</p>
        <Link to="/deals" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Deals
        </Link>
      </div>
    );
  }

  const { deal, truck, customer, broker } = dealContext;

  const handleEditDeal = (updatedData: Partial<Deal>) => {
    setLocalDealOverride({ ...deal, ...updatedData } as Deal);
    setIsEditModalOpen(false);
  };

  // Profit Bridge Calculations
  const totalTruckExpenses = expensesList.filter(e => e.truckId === truck?.id && e.dealId !== deal.id).reduce((sum, e) => sum + e.amount, 0);
  const totalDealExpenses = expensesList.filter(e => e.dealId === deal.id).reduce((sum, e) => sum + e.amount, 0);
  const totalBrokerComm = commissionsList.filter(c => c.type === 'BROKER').reduce((sum, c) => sum + c.amount, 0);
  const totalFinanceComm = commissionsList.filter(c => c.type === 'FINANCE').reduce((sum, c) => sum + c.amount, 0);
  
  // Realized profit calculation mirroring calculateDealProfit for transparency bridge
  const isCompleted = deal.status === 'COMPLETED';
  const bridgeProfit = truck ? (deal.salePrice - truck.purchasePrice - totalTruckExpenses - totalDealExpenses - totalBrokerComm + totalFinanceComm) : 0;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/deals" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Deals
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                Deal {deal.id}
              </h1>
              <DealStatusBadge status={deal.status} />
            </div>
            <div className="text-sm font-medium text-slate-600 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-slate-400" /> Sale Price: <strong className="text-navy-900">{formatINR(deal.salePrice)}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Sale Date: {formatDate(deal.saleDate)}</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Deal
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Transaction Overview */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Transaction Overview</h2>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Created Date</div>
                  <div className="font-medium text-navy-900">{formatDate(deal.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Last Updated</div>
                  <div className="font-medium text-navy-900">{formatDate(deal.updatedAt)}</div>
                </div>
              </div>
              {deal.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Notes</div>
                  <div className="text-slate-700">{deal.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Truck Context */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-slate-500" /> Associated Truck
              </h2>
              {truck && (
                <Link to={`/inventory/${truck.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                  View Truck
                </Link>
              )}
            </div>
            <div className="p-5">
              {truck ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-navy-900">{truck.registrationNumber}</div>
                      <div className="text-xs text-slate-600">{truck.manufacturer} {truck.model} {truck.variant && `- ${truck.variant}`}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{truck.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm pt-3 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500">Year / Mileage</div>
                      <div className="font-medium text-navy-900">{truck.year} • {truck.mileage.toLocaleString()} km</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Location</div>
                      <div className="font-medium text-navy-900">{truck.location}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-slate-500 italic">Unknown Truck</div>
              )}
            </div>
          </div>

          {/* Customer Context */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" /> Customer
              </h2>
              {customer && (
                <Link to={`/customers/${customer.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                  View Profile
                </Link>
              )}
            </div>
            <div className="p-5">
              {customer ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-bold text-navy-900">{customer.name}</div>
                    {customer.companyName && <div className="text-xs text-slate-600">{customer.companyName}</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm pt-3 border-t border-slate-100">
                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">Contact</div>
                      <div className="font-medium text-navy-900">{customer.phone}</div>
                      {customer.email && <div className="font-medium text-navy-900">{customer.email}</div>}
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">Location</div>
                      <div className="font-medium text-navy-900">{customer.city}{customer.state ? `, ${customer.state}` : ''}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-slate-500 italic">Unknown Customer</div>
              )}
            </div>
          </div>

          {/* Broker Context */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" /> Broker
              </h2>
              {broker && (
                <Link to={`/brokers/${broker.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                  View Profile
                </Link>
              )}
            </div>
            <div className="p-5">
              {broker ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-navy-900">{broker.name}</div>
                      {broker.companyName && <div className="text-xs text-slate-600">{broker.companyName}</div>}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${broker.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{broker.status}</span>
                  </div>
                  <div className="text-sm pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">Contact</div>
                    <div className="font-medium text-navy-900">{broker.phone}</div>
                    {broker.email && <div className="font-medium text-navy-900">{broker.email}</div>}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-400 mb-2">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-navy-900">Direct Sale</div>
                  <div className="text-xs text-slate-500 mt-1">No broker associated with this transaction.</div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Financial Summary */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-semibold text-navy-900">Financial Summary</h2>
            </div>
            
            <div className="p-6">
              {/* Profit Bridge */}
              <div className="max-w-md mx-auto space-y-2 mb-6 text-sm">
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-slate-700">Sale Price</span>
                  <span className="font-bold text-navy-900">{formatINR(deal.salePrice)}</span>
                </div>
                
                {totalFinanceComm > 0 && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">+</span> Finance Commission
                    </span>
                    <span className="font-medium text-emerald-600">{formatINR(totalFinanceComm)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="text-red-400 font-bold">−</span> Purchase Price
                  </span>
                  <span className="font-medium text-slate-700">{formatINR(truck?.purchasePrice || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="text-red-400 font-bold">−</span> Truck/Deal Expenses
                  </span>
                  <span className="font-medium text-slate-700">{formatINR(totalTruckExpenses + totalDealExpenses)}</span>
                </div>
                
                {totalBrokerComm > 0 && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span className="text-red-400 font-bold">−</span> Broker Commission
                    </span>
                    <span className="font-medium text-slate-700">{formatINR(totalBrokerComm)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-t-2 border-navy-900 mt-2">
                  <span className="font-bold text-navy-900 uppercase tracking-wide">Net Profit</span>
                  {isCompleted ? (
                    <span className="font-bold text-lg text-emerald-700 bg-emerald-50 px-3 py-1 rounded">{formatINR(bridgeProfit)}</span>
                  ) : (
                    <span className="font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded">Unrealized ({formatINR(bridgeProfit)})</span>
                  )}
                </div>

              </div>

              {!isCompleted && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <p>Profit shown is projected. The transaction must be marked as <strong>COMPLETED</strong> to realize this profit on the dashboard.</p>
                </div>
              )}

            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> Transaction Expenses
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{expensesList.length}</span>
            </div>
            <div className="overflow-x-auto">
              {expensesList.length > 0 ? (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expensesList.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-navy-900">
                          {e.description}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{e.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          {e.dealId === deal.id ? (
                            <span className="text-xs text-blue-600 font-medium">Deal Expense</span>
                          ) : (
                            <span className="text-xs text-slate-500 font-medium">Truck Expense</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-navy-900">
                          {formatINR(e.amount)}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {formatDate(e.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500">No expenses recorded.</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financing */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-slate-500" /> Financing
                </h2>
              </div>
              <div className="p-4 flex-1">
                {loansList.length > 0 ? (
                  <div className="space-y-4">
                    {loansList.map(l => (
                      <div key={l.id} className="border border-slate-200 rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/loans/${l.id}`} className="font-medium text-navy-600 hover:underline">{l.id} ({l.financePartnerId})</Link>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${l.status === 'APPROVED' || l.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{l.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-xs text-slate-500">Loan Amount</div>
                            <div className="font-medium">{formatINR(l.loanAmount)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Commission</div>
                            <div className="font-medium text-emerald-600">{formatINR(l.expectedCommission)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                    <Ban className="w-8 h-8 text-slate-200 mb-2" />
                    <span className="text-sm">No financing records</span>
                  </div>
                )}
              </div>
            </div>

            {/* Commissions */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-slate-500" /> Commissions
                </h2>
              </div>
              <div className="p-4 flex-1">
                {commissionsList.length > 0 ? (
                  <div className="space-y-3">
                    {commissionsList.map(c => (
                      <div key={c.id} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <Link to={`/commissions/${c.id}`} className="font-medium text-sm text-navy-600 hover:underline">{formatINR(c.amount)}</Link>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">{c.type}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{c.status} • Due: {c.dueDate ? formatDate(c.dueDate) : 'Unknown'}</div>
                        </div>
                        {c.status === 'PAID' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                    <Ban className="w-8 h-8 text-slate-200 mb-2" />
                    <span className="text-sm">No commissions</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-slate-500" /> Activity History
              </h2>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {activitiesList.length > 0 ? (
                <div className="space-y-4">
                  {activitiesList.map((activity) => (
                    <div key={activity.id} className="relative pl-6 pb-4 border-l border-slate-200 last:pb-0 last:border-transparent">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-navy-900">{activity.action}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{formatDate(activity.timestamp)} • by {activity.performedBy}</span>
                        <p className="text-sm text-slate-700 mt-1.5 bg-slate-50 p-2 rounded border border-slate-100">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500">No activity recorded for this deal.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <DealFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditDeal}
          initialData={deal}
        />
      )}
    </div>
  );
}
