import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, Phone, Mail, FileText, Banknote, IndianRupee, CheckCircle, User } from 'lucide-react';
import { getFinancePartnerById, getFinancePartnerLoans, getFinancePartnerCommissions } from '../../services/finance-partners/finance-partner-service';
import { formatDate, formatINR } from '../../utils/format';
import { FinancePartnerFormModal } from '../../components/finance-partners/finance-partner-form-modal';
import { LoanStatusBadge } from '../../components/loans/loan-status-badge';
import type { FinancePartner } from '../../types';

export default function FinancePartnerDetailsPage() {
  const { financePartnerId } = useParams<{ financePartnerId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localPartnerOverride, setLocalPartnerOverride] = useState<FinancePartner | null>(null);

  const baseContext = useMemo(() => {
    if (!financePartnerId) return null;
    return getFinancePartnerById(financePartnerId);
  }, [financePartnerId]);

  const partnerContext = useMemo(() => {
    if (!baseContext) return null;
    if (localPartnerOverride) {
      return {
        ...baseContext,
        partner: localPartnerOverride,
      };
    }
    return baseContext;
  }, [baseContext, localPartnerOverride]);

  const loansList = useMemo(() => {
    if (!financePartnerId) return [];
    return getFinancePartnerLoans(financePartnerId);
  }, [financePartnerId]);

  const commissionsList = useMemo(() => {
    if (!financePartnerId) return [];
    return getFinancePartnerCommissions(financePartnerId);
  }, [financePartnerId]);

  if (!partnerContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Finance Partner not found</h1>
        <p className="text-slate-500 mb-6">The financing partner record you are looking for does not exist.</p>
        <Link to="/finance-partners" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Partners
        </Link>
      </div>
    );
  }

  const { partner, activeLoansCount, disbursedLoansCount, totalLoanValue, expectedCommission, receivedCommission } = partnerContext;
  const outstandingCommission = Math.max(0, expectedCommission - receivedCommission);

  const handleEditPartner = (updatedData: Partial<FinancePartner>) => {
    setLocalPartnerOverride({ ...partner, ...updatedData } as FinancePartner);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <Link to="/finance-partners" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Partners
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-navy-50 text-navy-600 rounded-md">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900">{partner.name}</h1>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${partner.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
              {partner.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600 ml-12">
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Standard Rate: <strong className="text-emerald-600">{partner.commissionRate}%</strong></span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" /> Edit Partner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Contact Details */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Contact Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Contact Person</div>
                <div className="font-medium text-navy-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {partner.contactPerson || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Phone Number</div>
                <div className="font-medium text-navy-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {partner.phone || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Email Address</div>
                <div className="font-medium text-navy-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {partner.email || '—'}
                </div>
              </div>
              {partner.notes && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Internal Notes</div>
                  <div className="text-sm text-slate-700">{partner.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Performance Summary</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Total Loans</div>
                  <div className="font-bold text-navy-900 text-lg">{loansList.length}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Active Loans</div>
                  <div className="font-bold text-blue-700 text-lg">{activeLoansCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Disbursed</div>
                  <div className="font-bold text-emerald-700 text-lg">{disbursedLoansCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Rejected</div>
                  <div className="font-bold text-red-700 text-lg">{loansList.filter(l => l.status === 'REJECTED').length}</div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-600">Total Loan Value</span>
                  <span className="font-bold text-navy-900">{formatINR(totalLoanValue)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-600">Expected Commission</span>
                  <span className="font-bold text-emerald-700">{formatINR(expectedCommission)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-600">Received Commission</span>
                  <span className="font-bold text-emerald-700">{formatINR(receivedCommission)}</span>
                </div>
                <div className="flex justify-between items-center py-2 mt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Outstanding</span>
                  {outstandingCommission > 0 ? (
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{formatINR(outstandingCommission)}</span>
                  ) : (
                    <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded"><CheckCircle className="w-3 h-3" /> Fully Settled</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Related Loans */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-slate-500" /> Related Loans
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{loansList.length}</span>
            </div>
            
            <div className="overflow-x-auto">
              {loansList.length > 0 ? (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Loan ID</th>
                      <th className="px-4 py-3 font-medium">Deal</th>
                      <th className="px-4 py-3 font-medium text-right">Loan Amount</th>
                      <th className="px-4 py-3 font-medium text-right">Exp. Comm</th>
                      <th className="px-4 py-3 font-medium text-right">Rcvd Comm</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loansList.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <Link to={`/loans/${l.id}`} className="text-navy-900 hover:underline">{l.id}</Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/deals/${l.dealId}`} className="text-navy-600 hover:underline">{l.dealId}</Link>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-navy-900">
                          {formatINR(l.loanAmount)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-600">
                          {formatINR(l.expectedCommission)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                          {formatINR(l.receivedCommission)}
                        </td>
                        <td className="px-4 py-3">
                          <LoanStatusBadge status={l.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">No loans associated with this partner.</div>
              )}
            </div>
          </div>

          {/* Related Commissions */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-slate-500" /> Finance Commissions
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{commissionsList.length}</span>
            </div>
            
            <div className="overflow-x-auto">
              {commissionsList.length > 0 ? (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Commission ID</th>
                      <th className="px-4 py-3 font-medium">Loan ID</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Due Date</th>
                      <th className="px-4 py-3 font-medium">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {commissionsList.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <Link to={`/commissions/${c.id}`} className="text-navy-900 hover:underline">{c.id}</Link>
                        </td>
                        <td className="px-4 py-3">
                          {c.loanId ? <Link to={`/loans/${c.loanId}`} className="text-navy-600 hover:underline">{c.loanId}</Link> : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-700">
                          {formatINR(c.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            c.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                            c.status === 'CANCELLED' ? 'bg-slate-200 text-slate-600' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {c.dueDate ? formatDate(c.dueDate) : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {c.paidDate ? formatDate(c.paidDate) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">No finance commissions recorded.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <FinancePartnerFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditPartner}
          initialData={partner}
        />
      )}
    </div>
  );
}
