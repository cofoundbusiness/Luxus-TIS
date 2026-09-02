import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, User, Phone, Mail, MapPin, Target, Briefcase, FileText, Clock } from 'lucide-react';
import { getCustomerById, getCustomerLeads, getCustomerDeals, getCustomerTrucks, getCustomerActivities } from '../../services/customers/customer-service';
import { formatDate, formatINR } from '../../utils/format';
import { CustomerFormModal } from '../../components/customers/customer-form-modal';
import { LeadStatusBadge } from '../../components/leads/lead-badges';
import type { Customer, Lead } from '../../types';
import { LeadFormModal } from '../../components/leads/lead-form-modal';
import { leads as mockLeads } from '../../data/mock';

export default function CustomerDetailsPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  
  const [localCustOverride, setLocalCustOverride] = useState<Customer | null>(null);
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);

  const baseCustContext = useMemo(() => {
    if (!customerId) return null;
    return getCustomerById(customerId);
  }, [customerId]);

  const baseLeads = useMemo(() => {
    if (!customerId) return [];
    return getCustomerLeads(customerId);
  }, [customerId]);

  const deals = useMemo(() => {
    if (!customerId) return [];
    return getCustomerDeals(customerId);
  }, [customerId]);

  const trucks = useMemo(() => {
    if (!customerId) return [];
    return getCustomerTrucks(customerId);
  }, [customerId]);

  const activities = useMemo(() => {
    if (!customerId) return [];
    return getCustomerActivities(customerId);
  }, [customerId]);

  if (!baseCustContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Customer not found</h1>
        <p className="text-slate-500 mb-6">The customer record you are looking for does not exist.</p>
        <Link to="/customers" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
      </div>
    );
  }

  const cust = localCustOverride || baseCustContext.customer;
  const currentLeads = [...localLeads, ...baseLeads]; // Merging local new leads on top

  const handleEditCustomer = (updatedData: Partial<Customer>) => {
    setLocalCustOverride({ ...cust, ...updatedData } as Customer);
    setIsEditModalOpen(false);
  };

  const handleAddLead = (newLeadData: Partial<Lead>) => {
    const newLead: Lead = {
      ...newLeadData,
      customerId: cust.id,
      id: `LD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Lead;
    
    mockLeads.push(newLead);
    setLocalLeads([newLead, ...localLeads]);
    setIsLeadModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Customers
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                <User className="w-6 h-6 text-slate-400" />
                {cust.name}
              </h1>
            </div>
            {cust.companyName && (
              <div className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                {cust.companyName}
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={() => setIsLeadModalOpen(true)}
              className="flex justify-center items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
            >
              <Target className="w-4 h-4" /> New Lead
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Contact & Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Contact Information</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Phone</div>
                  <div className="text-sm font-medium text-navy-900">{cust.phone}</div>
                </div>
              </div>
              
              {cust.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Email</div>
                    <div className="text-sm font-medium text-navy-900">{cust.email}</div>
                  </div>
                </div>
              )}

              {(cust.address || cust.city || cust.state) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Address</div>
                    <div className="text-sm font-medium text-navy-900 leading-tight">
                      {cust.address && <div>{cust.address}</div>}
                      <div>{[cust.city, cust.state].filter(Boolean).join(', ')}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {cust.notes && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Notes</div>
                    <div className="text-sm text-slate-700">{cust.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Activity History</h2>
            </div>
            <div className="p-5">
              {activities.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-6 pb-4 border-l border-slate-200 last:pb-0 last:border-transparent">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-navy-900">{activity.action}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{formatDate(activity.timestamp)}</span>
                        <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-slate-500">No activity available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Related Data */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-500" /> Lead History
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{currentLeads.length}</span>
            </div>
            {currentLeads.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {currentLeads.map(l => (
                  <div key={l.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link to={`/leads/${l.id}`} className="text-sm font-bold text-navy-900 hover:underline">
                          {l.requirement}
                        </Link>
                        <div className="text-xs text-slate-500 mt-1">Budget: {formatINR(l.budget)} • Prob: {l.probability}%</div>
                      </div>
                      <LeadStatusBadge status={l.status} />
                    </div>
                    {l.nextFollowUp && (
                      <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next follow-up: {formatDate(l.nextFollowUp)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500">No leads for this customer.</div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" /> Deal History
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{deals.length}</span>
            </div>
            {deals.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                {deals.map(d => {
                  const associatedTruck = trucks.find(t => t.id === d.truckId);
                  return (
                    <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-navy-900">
                          {associatedTruck ? `${associatedTruck.manufacturer} ${associatedTruck.model}` : `Deal ${d.id}`}
                        </div>
                        {associatedTruck && <div className="text-xs text-slate-500 mt-0.5">{associatedTruck.registrationNumber}</div>}
                        <div className="text-xs text-slate-400 mt-1">{formatDate(d.saleDate)}</div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${d.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {d.status}
                        </span>
                        <span className="text-sm font-bold text-navy-900">{formatINR(d.salePrice)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500">No deals recorded.</div>
            )}
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <CustomerFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditCustomer}
          initialData={cust}
        />
      )}

      {isLeadModalOpen && (
        <LeadFormModal 
          isOpen={isLeadModalOpen} 
          onClose={() => setIsLeadModalOpen(false)} 
          onSubmit={handleAddLead}
          initialData={{ customerId: cust.id } as Partial<Lead>}
        />
      )}
    </div>
  );
}
