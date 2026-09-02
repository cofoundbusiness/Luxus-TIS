import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, User, Phone, Mail, MapPin, Target, Briefcase, FileText, IndianRupee, PieChart, Activity as ActivityIcon, CheckCircle } from 'lucide-react';
import { 
  getBrokerById, 
  getBrokerPerformance, 
  getBrokerPipeline, 
  getBrokerLeads, 
  getBrokerCustomers, 
  getBrokerDeals, 
  getBrokerCommissions, 
  getBrokerActivities 
} from '../../services/brokers/broker-service';
import { formatDate, formatINR } from '../../utils/format';
import { BrokerFormModal } from '../../components/brokers/broker-form-modal';
import { LeadStatusBadge } from '../../components/leads/lead-badges';
import type { Broker } from '../../types';
import { trucks, customers } from '../../data/mock';

export default function BrokerDetailsPage() {
  const { brokerId } = useParams<{ brokerId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localBrokerOverride, setLocalBrokerOverride] = useState<Broker | null>(null);

  const baseBrokerContext = useMemo(() => {
    if (!brokerId) return null;
    return getBrokerById(brokerId);
  }, [brokerId]);

  const performance = useMemo(() => {
    if (!brokerId) return null;
    return getBrokerPerformance(brokerId);
  }, [brokerId]);

  const pipeline = useMemo(() => {
    if (!brokerId) return null;
    return getBrokerPipeline(brokerId);
  }, [brokerId]);

  const leadsList = useMemo(() => {
    if (!brokerId) return [];
    return getBrokerLeads(brokerId);
  }, [brokerId]);

  const relatedCustomers = useMemo(() => {
    if (!brokerId) return [];
    return getBrokerCustomers(brokerId);
  }, [brokerId]);

  const dealsList = useMemo(() => {
    if (!brokerId) return [];
    return getBrokerDeals(brokerId);
  }, [brokerId]);

  const commissionsList = useMemo(() => {
    if (!brokerId) return [];
    return getBrokerCommissions(brokerId);
  }, [brokerId]);

  const activitiesList = useMemo(() => {
    if (!brokerId) return [];
    return getBrokerActivities(brokerId);
  }, [brokerId]);

  if (!baseBrokerContext || !performance || !pipeline) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Broker not found</h1>
        <p className="text-slate-500 mb-6">The broker record you are looking for does not exist.</p>
        <Link to="/brokers" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Brokers
        </Link>
      </div>
    );
  }

  const broker = localBrokerOverride || baseBrokerContext.broker;

  const handleEditBroker = (updatedData: Partial<Broker>) => {
    setLocalBrokerOverride({ ...broker, ...updatedData } as Broker);
    setIsEditModalOpen(false);
  };

  const leadToDealConversion = performance.totalLeads > 0 
    ? Math.round((performance.completedDeals / performance.totalLeads) * 100) 
    : 0;

  const totalPaidCommission = commissionsList.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);
  const totalPendingCommission = commissionsList.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/brokers" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Brokers
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-slate-400" />
                {broker.name}
              </h1>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${broker.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {broker.status}
              </span>
            </div>
            {broker.companyName && (
              <div className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                {broker.companyName}
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contact, Performance, Pipeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Broker Overview</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Phone</div>
                  <div className="text-sm font-medium text-navy-900">{broker.phone}</div>
                </div>
              </div>
              
              {broker.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Email</div>
                    <div className="text-sm font-medium text-navy-900">{broker.email}</div>
                  </div>
                </div>
              )}

              {broker.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">City</div>
                    <div className="text-sm font-medium text-navy-900">{broker.city}</div>
                  </div>
                </div>
              )}
              
              {broker.notes && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Notes</div>
                    <div className="text-sm text-slate-700">{broker.notes}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500">Created</div>
                <div className="text-xs font-medium text-navy-900 mt-0.5">{formatDate(broker.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Updated</div>
                <div className="text-xs font-medium text-navy-900 mt-0.5">{formatDate(broker.updatedAt)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-semibold text-navy-900">Performance Summary</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Total Leads</div>
                  <div className="text-xl font-bold text-navy-900">{performance.totalLeads}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Active Leads</div>
                  <div className="text-xl font-bold text-navy-600">{performance.activeLeads}</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <div className="text-xs text-emerald-700 mb-1">Won Leads (Sold)</div>
                  <div className="text-xl font-bold text-emerald-800">{performance.wonLeads}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Lost Leads</div>
                  <div className="text-xl font-bold text-slate-700">{performance.lostLeads}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Total Deals</div>
                  <div className="text-lg font-bold text-navy-900">{performance.totalDeals}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Completed Deals</div>
                  <div className="text-lg font-bold text-emerald-700">{performance.completedDeals}</div>
                </div>
              </div>

              {performance.totalLeads >= 3 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Lead-to-Deal Conversion</span>
                    <span className="text-sm font-bold text-navy-900">{leadToDealConversion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-navy-600 rounded-full" style={{ width: `${leadToDealConversion}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Lead Pipeline</h2>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {[
                  { label: 'New', count: pipeline.NEW, color: 'bg-blue-500' },
                  { label: 'Contacted', count: pipeline.CONTACTED, color: 'bg-indigo-500' },
                  { label: 'Interested', count: pipeline.INTERESTED, color: 'bg-purple-500' },
                  { label: 'Negotiation', count: pipeline.NEGOTIATION, color: 'bg-amber-500' },
                  { label: 'Booked', count: pipeline.BOOKED, color: 'bg-green-500' },
                  { label: 'Sold', count: pipeline.SOLD, color: 'bg-emerald-500' },
                  { label: 'Lost', count: pipeline.LOST, color: 'bg-slate-400' },
                ].map(stage => {
                  if (stage.count === 0) return null;
                  const percent = Math.round((stage.count / performance.totalLeads) * 100) || 0;
                  return (
                    <div key={stage.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{stage.label}</span>
                        <span className="font-bold text-navy-900">{stage.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${stage.color} rounded-full`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Tables */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leads */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-500" /> Related Leads
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{leadsList.length}</span>
            </div>
            <div className="overflow-x-auto">
              {leadsList.length > 0 ? (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Customer / Truck</th>
                      <th className="px-4 py-3 font-medium">Stage</th>
                      <th className="px-4 py-3 font-medium">Budget</th>
                      <th className="px-4 py-3 font-medium">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leadsList.map(l => {
                      const c = customers.find(x => x.id === l.customerId);
                      const t = l.truckId ? trucks.find(x => x.id === l.truckId) : null;
                      return (
                        <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <Link to={`/leads/${l.id}`} className="font-medium text-navy-900 hover:underline block truncate max-w-[200px]">
                              {c ? c.name : 'Unknown Customer'}
                            </Link>
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">
                              {t ? `${t.manufacturer} ${t.model}` : l.requirement}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <LeadStatusBadge status={l.status} />
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {formatINR(l.budget)}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            {l.nextFollowUp ? formatDate(l.nextFollowUp) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">No leads associated with this broker.</div>
              )}
            </div>
          </div>

          {/* Deals */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-slate-500" /> Completed Deals
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{dealsList.length}</span>
            </div>
            <div className="overflow-x-auto">
              {dealsList.length > 0 ? (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Deal / Truck</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium text-right">Sale Price</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dealsList.map(d => {
                      const c = customers.find(x => x.id === d.customerId);
                      const t = trucks.find(x => x.id === d.truckId);
                      return (
                        <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <Link to={`/deals/${d.id}`} className="font-medium text-navy-900 hover:underline">
                              Deal {d.id}
                            </Link>
                            <div className="text-xs text-slate-500">
                              {t ? `${t.manufacturer} ${t.model}` : 'Unknown Truck'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700 text-sm">
                            {c ? c.name : 'Unknown'}
                          </td>
                          <td className="px-4 py-3 font-medium text-navy-900 text-right">
                            {formatINR(d.salePrice)}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            {formatDate(d.saleDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">No deals associated with this broker.</div>
              )}
            </div>
          </div>

          {/* Commissions */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-slate-500" /> Broker Commissions
              </h2>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-4 bg-white border-b border-slate-100">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md">
                <div className="text-xs text-emerald-800 mb-1">Total Paid</div>
                <div className="text-xl font-bold text-emerald-900">{formatINR(totalPaidCommission)}</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                <div className="text-xs text-amber-800 mb-1">Total Pending</div>
                <div className="text-xl font-bold text-amber-900">{formatINR(totalPendingCommission)}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {commissionsList.length > 0 ? (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Deal Ref</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {commissionsList.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link to={`/deals/${c.dealId}`} className="font-medium text-navy-900 hover:underline">
                            Deal {c.dealId}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/commissions/${c.id}`} className="font-medium text-emerald-700 hover:underline">
                            {formatINR(c.amount)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            c.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                            c.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {c.dueDate ? formatDate(c.dueDate) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">No commissions recorded.</div>
              )}
            </div>
          </div>

          {/* Customers Context */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" /> Introduced Customers
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{relatedCustomers.length}</span>
            </div>
            <div className="p-4">
              {relatedCustomers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {relatedCustomers.map(c => (
                    <Link key={c.id} to={`/customers/${c.id}`} className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-navy-300 hover:bg-navy-50 rounded-md text-sm text-navy-900 transition-colors">
                      {c.name} {c.companyName ? <span className="text-xs text-slate-500">({c.companyName})</span> : ''}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-slate-500">No customers introduced yet.</div>
              )}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900 flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-slate-500" /> Activity History
              </h2>
            </div>
            <div className="p-5 max-h-[300px] overflow-y-auto">
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
                <div className="text-center py-6 text-sm text-slate-500">No activity recorded for this broker.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {isEditModalOpen && (
        <BrokerFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditBroker}
          initialData={broker}
        />
      )}
    </div>
  );
}
// Note: We used a fake CheckCircle import from lucide-react above, we should import CheckCircle
