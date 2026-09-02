interface DocumentSummaryProps {
  data: {
    available: number;
    pending: number;
    expired: number;
  };
}

export function DocumentSummary({ data }: DocumentSummaryProps) {
  const needsAttention = data.pending + data.expired;
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-navy-900">Document Health</h2>
        {needsAttention > 0 && (
          <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
            {needsAttention} Action Req.
          </span>
        )}
      </div>

      <div className="space-y-4 mt-auto">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 font-medium">Available</span>
            <span className="text-navy-900 font-semibold">{data.available}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 font-medium">Pending</span>
            <span className="text-amber-600 font-semibold">{data.pending}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 font-medium">Expired</span>
            <span className="text-red-600 font-semibold">{data.expired}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
