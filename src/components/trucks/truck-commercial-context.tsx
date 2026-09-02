import { formatDate, formatINR } from '../../utils/format';

interface TruckCommercialContextProps {
  leads: any[];
  deal: any | null;
}

export function TruckCommercialContext({ leads, deal }: TruckCommercialContextProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-base font-semibold text-navy-900">Commercial Context</h2>
      </div>
      
      {/* Deal Section */}
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Associated Deal</h3>
        {deal ? (
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-navy-900">{deal.customerName}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-800">
                {deal.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>
                <span className="text-slate-500 text-xs block">Broker</span>
                <span className="font-medium text-slate-700">{deal.brokerName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs block">Sale Price</span>
                <span className="font-medium text-slate-700">{formatINR(deal.salePrice)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 text-xs block">Sale Date</span>
                <span className="font-medium text-slate-700">{formatDate(deal.saleDate)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">No deal associated with this truck.</div>
        )}
      </div>

      {/* Leads Section */}
      <div className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Active Leads</h3>
        {leads.length > 0 ? (
          <div className="space-y-3">
            {leads.map(lead => (
              <div key={lead.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div>
                  <div className="text-sm font-medium text-navy-900">{lead.customerName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{lead.brokerName}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700">
                    {lead.status}
                  </span>
                  {lead.nextFollowUp && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      F/U: {formatDate(lead.nextFollowUp)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">No active leads for this truck.</div>
        )}
      </div>
    </div>
  );
}
