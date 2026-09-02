import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, User, Phone, Briefcase, Target } from 'lucide-react';
import { getLeadById, getLeadActivities, getRelatedLeads, getLeadDeal, getFollowUpStatus } from '../../services/leads/lead-service';
import { formatDate, formatINR } from '../../utils/format';
import { LeadStatusBadge, LeadFollowUpBadge } from '../../components/leads/lead-badges';
import { LeadFormModal } from '../../components/leads/lead-form-modal';
import type { Lead, Customer } from '../../types';

export default function LeadDetailsPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localLeadOverride, setLocalLeadOverride] = useState<Lead | null>(null);

  const baseLeadContext = useMemo(() => {
    if (!leadId) return null;
    return getLeadById(leadId);
  }, [leadId]);

  const activities = useMemo(() => {
    if (!leadId) return [];
    return getLeadActivities(leadId);
  }, [leadId]);

  const relatedLeads = useMemo(() => {
    if (!baseLeadContext) return [];
    return getRelatedLeads(baseLeadContext.lead.customerId, baseLeadContext.lead.id);
  }, [baseLeadContext]);

  const deal = useMemo(() => {
    if (!leadId) return null;
    return getLeadDeal(leadId);
  }, [leadId]);

  if (!baseLeadContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Lead not found</h1>
        <p className="text-slate-500 mb-6">The sales opportunity you are looking for does not exist.</p>
        <Link to="/leads" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </Link>
      </div>
    );
  }

  const ctx = baseLeadContext;
  const lead = localLeadOverride || ctx.lead;
  const followUpStatus = getFollowUpStatus(lead.nextFollowUp, lead.status);

  const handleEditLead = (updatedData: Partial<Lead>, _?: Partial<Customer>) => {
    setLocalLeadOverride({ ...lead, ...updatedData } as Lead);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/leads" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Leads
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-slate-400" />
                {lead.requirement}
              </h1>
              <LeadStatusBadge status={lead.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                {ctx.customerName}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-slate-400" />
                {ctx.customerPhone}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Budget:</span>
                <span className="font-semibold text-navy-900">{formatINR(lead.budget)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Next Follow-up:</span>
              <span className="text-sm font-medium text-navy-900">{lead.nextFollowUp ? formatDate(lead.nextFollowUp) : 'None'}</span>
              <LeadFollowUpBadge status={followUpStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-semibold text-navy-900">Lead Details</h2>
              <span className="text-xs text-slate-500">Created {formatDate(lead.createdAt)}</span>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Source</div>
                <div className="text-sm font-medium text-navy-900">{lead.source}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Probability</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${lead.probability >= 70 ? 'bg-green-500' : lead.probability >= 40 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${lead.probability}%` }} />
                  </div>
                  <span className="text-sm font-medium text-navy-900">{lead.probability}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Assigned To</div>
                <div className="text-sm font-medium text-navy-900">{lead.assignedTo || 'Unassigned'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Last Updated</div>
                <div className="text-sm font-medium text-navy-900">{formatDate(lead.updatedAt)}</div>
              </div>
              {lead.notes && (
                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Notes</div>
                  <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 whitespace-pre-wrap">{lead.notes}</div>
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
                <div className="space-y-4">
                  {activities.map((activity) => (
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
                <div className="text-center py-6 text-sm text-slate-500">No activity recorded for this lead.</div>
              )}
            </div>
          </div>
          
        </div>

        {/* Right Column: Context & Relationships */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-semibold text-navy-900">Customer Context</h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="font-medium text-navy-900">{ctx.customerName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Primary Contact</div>
                </div>
              </div>
              {ctx.customerCompany && (
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="text-slate-700">{ctx.customerCompany}</div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="text-slate-700">{ctx.customerPhone}</div>
              </div>
              
              <div className="pt-2 mt-2 border-t border-slate-100">
                <Link to={`/customers/${lead.customerId}`} className="text-navy-600 hover:text-navy-800 font-medium hover:underline flex items-center gap-1 text-xs">
                  View Full Profile &rarr;
                </Link>
              </div>
            </div>
          </div>

          {ctx.truckDetails && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm font-semibold text-navy-900">Target Truck</h2>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="font-medium text-navy-900">{ctx.truckDetails}</div>
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link to={`/inventory/${lead.truckId}`} className="text-navy-600 hover:text-navy-800 font-medium hover:underline flex items-center gap-1 text-xs">
                    View Truck Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {ctx.brokerName && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm font-semibold text-navy-900">Broker</h2>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="font-medium text-navy-900">{ctx.brokerName}</div>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link to="/brokers" className="text-navy-600 hover:text-navy-800 font-medium hover:underline flex items-center gap-1 text-xs">
                    Go to Brokers &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {deal && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden border-l-4 border-l-emerald-500">
              <div className="p-4 border-b border-slate-200 bg-emerald-50">
                <h2 className="text-sm font-semibold text-emerald-900">Associated Deal</h2>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="font-medium text-navy-900">Deal {deal.id}</div>
                <div className="text-slate-600">Sale Price: <span className="font-semibold text-navy-900">{formatINR(deal.salePrice)}</span></div>
                <div className="text-slate-600">Status: <span className="font-medium">{deal.status}</span></div>
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link to={`/deals/${deal.id}`} className="text-navy-600 hover:text-navy-800 font-medium hover:underline flex items-center gap-1 text-xs">
                    View Deal Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {relatedLeads.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-sm font-semibold text-navy-900">Related Customer Leads</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {relatedLeads.map(rl => (
                  <Link key={rl.lead.id} to={`/leads/${rl.lead.id}`} className="block p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-medium text-navy-900 truncate pr-2">{rl.lead.requirement}</div>
                      <LeadStatusBadge status={rl.lead.status} />
                    </div>
                    <div className="text-xs text-slate-500">{formatINR(rl.lead.budget)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {isEditModalOpen && (
        <LeadFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditLead}
          initialData={lead}
        />
      )}
    </div>
  );
}
