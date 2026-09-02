interface SalesPipelineProps {
  data: {
    NEW: number;
    CONTACTED: number;
    INTERESTED: number;
    NEGOTIATION: number;
    BOOKED: number;
    SOLD: number;
    LOST: number;
  };
}

export function SalesPipeline({ data }: SalesPipelineProps) {
  const activeCount = data.NEW + data.CONTACTED + data.INTERESTED + data.NEGOTIATION + data.BOOKED;

  const stages = [
    { label: 'New', count: data.NEW, color: 'bg-slate-200 text-slate-800' },
    { label: 'Contacted', count: data.CONTACTED, color: 'bg-blue-100 text-blue-800' },
    { label: 'Interested', count: data.INTERESTED, color: 'bg-indigo-100 text-indigo-800' },
    { label: 'Negotiation', count: data.NEGOTIATION, color: 'bg-purple-100 text-purple-800' },
    { label: 'Booked', count: data.BOOKED, color: 'bg-amber-100 text-amber-800' }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-navy-900">Active Pipeline</h2>
        <span className="text-sm font-medium text-navy-900 bg-slate-100 px-2 py-1 rounded">{activeCount} Total</span>
      </div>

      <div className="space-y-3">
        {stages.map(stage => (
          <div key={stage.label} className="flex items-center justify-between p-2 rounded-md border border-transparent hover:border-slate-100 transition-colors">
            <span className="text-sm font-medium text-slate-600">{stage.label}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stage.color}`}>
              {stage.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-slate-600">Won: <span className="font-semibold text-navy-900">{data.SOLD}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-slate-600">Lost: <span className="font-semibold text-navy-900">{data.LOST}</span></span>
        </div>
      </div>
    </div>
  );
}
