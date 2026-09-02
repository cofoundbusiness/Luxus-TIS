import { formatINR, formatDate } from '../../utils/format';

interface DealRow {
  id: string;
  truckModel: string;
  customerName: string;
  brokerName: string;
  salePrice: number;
  status: string;
  saleDate: string;
}

interface RecentDealsProps {
  data: DealRow[];
}

export function RecentDeals({ data }: RecentDealsProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-base font-semibold text-navy-900">Recent Deal Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Truck</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Broker</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(deal => (
              <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-navy-900">{deal.truckModel}</td>
                <td className="px-4 py-3 text-slate-600">{deal.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{deal.brokerName}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(deal.saleDate)}</td>
                <td className="px-4 py-3 font-medium text-navy-900 text-right">{formatINR(deal.salePrice)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    deal.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    deal.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {deal.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
