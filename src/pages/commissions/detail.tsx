import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, Briefcase, Truck as TruckIcon, User, Handshake, Banknote, IndianRupee, CheckCircle, Clock, Percent, Activity as ActivityIcon } from 'lucide-react';
import { getCommissionById, getCommissionActivities } from '../../services/commissions/commission-service';
import { formatDate, formatINR } from '../../utils/format';
import { CommissionFormModal } from '../../components/commissions/commission-form-modal';
import type { Commission } from '../../types';

export default function CommissionDetailsPage() {
  const { commissionId } = useParams<{ commissionId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localCommissionOverride, setLocalCommissionOverride] = useState<Commission | null>(null);

  const baseContext = useMemo(() => {
    if (!commissionId) return null;
    return getCommissionById(commissionId);
  }, [commissionId]);

  const commissionContext = useMemo(() => {
    if (!baseContext) return null;
    if (localCommissionOverride) {
      return {
        ...baseContext,
        commission: localCommissionOverride,
      };
    }
    return baseContext;
  }, [baseContext, localCommissionOverride]);

  const activitiesList = useMemo(() => {
    if (!commissionId) return [];
    return getCommissionActivities(commissionId);
  }, [commissionId]);

  if (!commissionContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Commission not found</h1>
        <p className="text-slate-500 mb-6">The commission record you are looking for does not exist.</p>
        <Link to="/commissions" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Commissions
        </Link>
      </div>
    );
  }

  const { commission, deal, broker, loan, financePartner, customer, truck } = commissionContext;
  const isFinance = commission.type === 'FINANCE';

  const handleEditCommission = (updatedData: Partial<Commission>) => {
    setLocalCommissionOverride({ ...commission, ...updatedData } as Commission);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <Link to="/commissions" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Commissions
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-md">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900">{commission.id}</h1>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
              commission.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
              commission.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              commission.status === 'CANCELLED' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
              'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {commission.status}
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${commission.type === 'BROKER' ? 'bg-slate-100 text-slate-600' : 'bg-navy-50 text-navy-600'}`}>
              {commission.type}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600 ml-12">
            <span className="flex items-center gap-1.5">Amount: <strong className="text-navy-900 text-lg">{formatINR(commission.amount)}</strong></span>
            {commission.rate && <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Rate: {commission.rate}%</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" /> Edit Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Payment Details */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Payment Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Due Date</div>
                  <div className="font-medium text-navy-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {commission.dueDate ? formatDate(commission.dueDate) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Paid Date</div>
                  <div className="font-medium text-navy-900 flex items-center gap-1.5">
                    <CheckCircle className={`w-4 h-4 ${commission.paidDate ? 'text-emerald-500' : 'text-slate-300'}`} />
                    {commission.paidDate ? formatDate(commission.paidDate) : '—'}
                  </div>
                </div>
              </div>
              {commission.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Notes</div>
                  <div className="text-sm text-slate-700">{commission.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Recipient / Partner Details */}
          {isFinance ? (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" /> Finance Partner
                </h2>
                {financePartner && (
                  <Link to={`/finance-partners/${financePartner.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Profile
                  </Link>
                )}
              </div>
              <div className="p-5">
                {financePartner ? (
                  <div className="space-y-2">
                    <div className="font-medium text-navy-900">{financePartner.name}</div>
                    <div className="text-xs text-slate-500">{financePartner.phone || financePartner.email || 'No contact info'}</div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">Unknown Finance Partner</div>
                )}
              </div>
            </div>
          ) : (
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
                  <div className="space-y-2">
                    <div className="font-medium text-navy-900">{broker.name}</div>
                    {broker.companyName && <div className="text-xs text-slate-600">{broker.companyName}</div>}
                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">{broker.phone} {broker.email ? `• ${broker.email}` : ''}</div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic">Unknown Broker</div>
                )}
              </div>
            </div>
          )}
          
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
                <div className="text-center py-6 text-sm text-slate-500">No activity recorded for this commission.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Related Transaction details */}
          {isFinance && loan ? (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-slate-500" /> Associated Loan
                </h2>
                <Link to={`/loans/${loan.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                  View Loan
                </Link>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-bold text-navy-900 mb-1">{loan.id}</div>
                  <div className="text-xs text-slate-500 mb-3">Status: {loan.status}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loan Amount:</span>
                      <span className="font-medium">{formatINR(loan.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Comm:</span>
                      <span className="font-medium text-emerald-600">{formatINR(loan.expectedCommission)}</span>
                    </div>
                  </div>
                </div>
                {deal && (
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deal Context</div>
                    <div className="text-sm font-medium text-navy-900 flex justify-between items-center">
                      <span>{deal.id}</span>
                      <Link to={`/deals/${deal.id}`} className="text-xs text-navy-600 hover:underline">View Deal</Link>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Sale Price: {formatINR(deal.salePrice)}</div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Common Deal Context */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-slate-500" /> Associated Deal
              </h2>
              {deal && (
                <Link to={`/deals/${deal.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                  View Deal
                </Link>
              )}
            </div>
            <div className="p-6">
              {deal ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-navy-900">{deal.id}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Sale Date: {formatDate(deal.saleDate)}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">{deal.status}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer */}
                    <div className="border border-slate-100 rounded-md p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer</span>
                        {customer && <Link to={`/customers/${customer.id}`} className="text-[10px] text-navy-600 hover:underline">Profile</Link>}
                      </div>
                      {customer ? (
                        <>
                          <div className="text-sm font-medium text-navy-900">{customer.name}</div>
                          {customer.companyName && <div className="text-xs text-slate-600">{customer.companyName}</div>}
                        </>
                      ) : (
                        <div className="text-sm text-slate-500 italic">Unknown Customer</div>
                      )}
                    </div>

                    {/* Truck */}
                    <div className="border border-slate-100 rounded-md p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><TruckIcon className="w-3.5 h-3.5" /> Truck</span>
                        {truck && <Link to={`/inventory/${truck.id}`} className="text-[10px] text-navy-600 hover:underline">Inventory</Link>}
                      </div>
                      {truck ? (
                        <>
                          <div className="text-sm font-medium text-navy-900">{truck.registrationNumber}</div>
                          <div className="text-xs text-slate-600">{truck.manufacturer} {truck.model}</div>
                        </>
                      ) : (
                        <div className="text-sm text-slate-500 italic">Unknown Truck</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500 italic">Unknown Deal Context</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <CommissionFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditCommission}
          initialData={commission}
        />
      )}
    </div>
  );
}
