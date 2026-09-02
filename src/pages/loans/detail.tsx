import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Truck as TruckIcon, User, FileText, IndianRupee, Activity as ActivityIcon, CheckCircle, Building2, Handshake, Receipt } from 'lucide-react';
import { getLoanById, getLoanActivities } from '../../services/loans/loan-service';
import { formatDate, formatINR } from '../../utils/format';
import { LoanFormModal } from '../../components/loans/loan-form-modal';
import { LoanStatusBadge } from '../../components/loans/loan-status-badge';
import type { Loan } from '../../types';

export default function LoanDetailsPage() {
  const { loanId } = useParams<{ loanId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localLoanOverride, setLocalLoanOverride] = useState<Loan | null>(null);

  const baseContext = useMemo(() => {
    if (!loanId) return null;
    return getLoanById(loanId);
  }, [loanId]);

  const loanContext = useMemo(() => {
    if (!baseContext) return null;
    if (localLoanOverride) {
      return {
        ...baseContext,
        loan: localLoanOverride,
      };
    }
    return baseContext;
  }, [baseContext, localLoanOverride]);

  const activitiesList = useMemo(() => {
    if (!loanId) return [];
    return getLoanActivities(loanId);
  }, [loanId]);
  
  if (!loanContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Loan not found</h1>
        <p className="text-slate-500 mb-6">The financing record you are looking for does not exist.</p>
        <Link to="/loans" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Loans
        </Link>
      </div>
    );
  }

  const { loan, deal, customer, truck, financePartner, financeCommission } = loanContext;

  const handleEditLoan = (updatedData: Partial<Loan>) => {
    setLocalLoanOverride({ ...loan, ...updatedData } as Loan);
    setIsEditModalOpen(false);
  };

  const outstandingCommission = Math.max(0, loan.expectedCommission - loan.receivedCommission);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/loans" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Loans
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                Loan {loan.id}
              </h1>
              <LoanStatusBadge status={loan.status} />
            </div>
            <div className="text-sm font-medium text-slate-600 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-slate-400" /> Amount: <strong className="text-navy-900">{formatINR(loan.loanAmount)}</strong></span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Loan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Application Overview */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-semibold text-navy-900">Application Overview</h2>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Application Date</div>
                  <div className="font-medium text-navy-900">{formatDate(loan.applicationDate)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Approval Date</div>
                  <div className="font-medium text-navy-900">{loan.approvalDate ? formatDate(loan.approvalDate) : '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Disbursement Date</div>
                  <div className="font-medium text-navy-900">{loan.receivedDate ? formatDate(loan.receivedDate) : '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Commission Rate</div>
                  <div className="font-medium text-emerald-600">{loan.commissionRate}%</div>
                </div>
              </div>
              {loan.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Notes</div>
                  <div className="text-slate-700">{loan.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Deal & Customer Context */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-slate-500" /> Transaction
              </h2>
              {deal && (
                <Link to={`/deals/${deal.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                  View Deal
                </Link>
              )}
            </div>
            <div className="p-5 space-y-4">
              {deal ? (
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-900">{deal.id}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">{deal.status}</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Sale Price: {formatINR(deal.salePrice)} • {formatDate(deal.saleDate)}</div>
                  </div>
                  
                  {customer && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5"><User className="w-3 h-3" /> Customer</div>
                        <Link to={`/customers/${customer.id}`} className="text-xs text-navy-600 hover:underline">Profile</Link>
                      </div>
                      <div className="text-sm font-medium text-navy-900">{customer.name}</div>
                      {customer.companyName && <div className="text-xs text-slate-600">{customer.companyName}</div>}
                      <div className="text-xs text-slate-500 mt-1">{customer.phone} {customer.email ? `• ${customer.email}` : ''}</div>
                      <div className="text-xs text-slate-500">{customer.city}{customer.state ? `, ${customer.state}` : ''}</div>
                    </div>
                  )}

                  {truck && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5"><TruckIcon className="w-3 h-3" /> Truck</div>
                        <Link to={`/inventory/${truck.id}`} className="text-xs text-navy-600 hover:underline">Inventory</Link>
                      </div>
                      <div className="text-sm font-medium text-navy-900">{truck.registrationNumber}</div>
                      <div className="text-xs text-slate-600">{truck.manufacturer} {truck.model} {truck.year}</div>
                      <div className="text-xs text-slate-500 mt-1">Purchase: {formatINR(truck.purchasePrice)} • Listed: {formatINR(truck.sellingPrice)}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-sm text-slate-500 italic">Unknown Deal</div>
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
              <div className="max-w-md mx-auto space-y-3 mb-2 text-sm">
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-medium text-slate-700">Loan Amount</span>
                  <span className="font-bold text-lg text-navy-900">{formatINR(loan.loanAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Commission Rate</span>
                  <span className="font-medium text-emerald-600">{loan.commissionRate}%</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Expected Commission</span>
                  <span className="font-medium text-slate-700">{formatINR(loan.expectedCommission)}</span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="text-red-400 font-bold">−</span> Received Commission
                  </span>
                  <span className="font-medium text-slate-700">{formatINR(loan.receivedCommission)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-slate-200 mt-2">
                  <span className="font-bold text-navy-900 uppercase tracking-wide text-xs">Outstanding Comm.</span>
                  {outstandingCommission > 0 ? (
                    <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded">{formatINR(outstandingCommission)}</span>
                  ) : (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Fully Settled</span>
                  )}
                </div>

              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Finance Partner */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" /> Finance Partner
                </h2>
                {financePartner && (
                  <Link to={`/finance-partners/${financePartner.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Partner
                  </Link>
                )}
              </div>
              <div className="p-5 flex-1">
                {financePartner ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-bold text-navy-900">{financePartner.name}</div>
                        {financePartner.contactPerson && <div className="text-xs text-slate-600">Attn: {financePartner.contactPerson}</div>}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${financePartner.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{financePartner.status}</span>
                    </div>
                    <div className="text-sm pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500">Contact</div>
                      <div className="font-medium text-navy-900">{financePartner.phone || '—'}</div>
                      <div className="font-medium text-navy-900">{financePartner.email || '—'}</div>
                    </div>
                    <div className="text-sm pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Standard Commission Rate</div>
                      <div className="font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded">{financePartner.commissionRate}%</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-slate-500 italic">Unknown Finance Partner</div>
                )}
              </div>
            </div>

            {/* Commission Record */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-500" /> Finance Commission
                </h2>
                {financeCommission && (
                  <Link to={`/commissions/${financeCommission.id}`} className="text-xs font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Record
                  </Link>
                )}
              </div>
              <div className="p-5 flex-1">
                {financeCommission ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-bold text-navy-900">{financeCommission.id}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        financeCommission.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        financeCommission.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                        financeCommission.status === 'CANCELLED' ? 'bg-slate-200 text-slate-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {financeCommission.status}
                      </span>
                    </div>
                    <div className="text-sm pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Commission Amount</div>
                      <div className="font-bold text-lg text-emerald-700">{formatINR(financeCommission.amount)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-xs text-slate-500">Due Date</div>
                        <div className="font-medium text-slate-700">{financeCommission.dueDate ? formatDate(financeCommission.dueDate) : '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Paid Date</div>
                        <div className="font-medium text-slate-700">{financeCommission.paidDate ? formatDate(financeCommission.paidDate) : '—'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-300 mb-2">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <span className="text-sm">No finance commission recorded.</span>
                    <span className="text-xs mt-1 max-w-[200px]">Commission records are managed in the Commissions workspace.</span>
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
                <div className="text-center py-6 text-sm text-slate-500">No activity recorded for this loan.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <LoanFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditLoan}
          initialData={loan}
        />
      )}
    </div>
  );
}
