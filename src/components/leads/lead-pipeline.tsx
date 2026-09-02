interface LeadPipelineProps {
  counts: {
    NEW: number;
    CONTACTED: number;
    INTERESTED: number;
    NEGOTIATION: number;
    BOOKED: number;
    SOLD: number;
    LOST: number;
  };
}

export function LeadPipeline({ counts }: LeadPipelineProps) {
  const activeCount = counts.NEW + counts.CONTACTED + counts.INTERESTED + counts.NEGOTIATION + counts.BOOKED;

  const stages = [
    { key: 'NEW', label: 'New', count: counts.NEW, color: 'bg-blue-500' },
    { key: 'CONTACTED', label: 'Contacted', count: counts.CONTACTED, color: 'bg-indigo-500' },
    { key: 'INTERESTED', label: 'Interested', count: counts.INTERESTED, color: 'bg-purple-500' },
    { key: 'NEGOTIATION', label: 'Negotiation', count: counts.NEGOTIATION, color: 'bg-amber-500' },
    { key: 'BOOKED', label: 'Booked', count: counts.BOOKED, color: 'bg-green-500' },
  ];

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-navy-900">Active Pipeline</h3>
        <div className="flex gap-4 text-xs font-medium">
          <div className="text-slate-500">Active: <span className="text-navy-900">{activeCount}</span></div>
          <div className="text-emerald-600">Won: <span className="font-bold">{counts.SOLD}</span></div>
          <div className="text-slate-400">Lost: <span className="font-bold">{counts.LOST}</span></div>
        </div>
      </div>
      
      <div className="flex h-12 w-full rounded-md overflow-hidden bg-slate-100">
        {stages.map(stage => {
          const width = activeCount === 0 ? 0 : (stage.count / activeCount) * 100;
          if (width === 0) return null;
          return (
            <div 
              key={stage.key} 
              style={{ width: `${width}%` }} 
              className={`${stage.color} h-full transition-all duration-500 border-r border-white/20 last:border-0 relative group`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 text-white text-xs font-bold transition-opacity">
                {stage.count}
              </div>
            </div>
          );
        })}
        {activeCount === 0 && (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium">
            No active leads in pipeline
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-3 text-xs text-slate-500 font-medium px-1">
        {stages.map(stage => (
          <div key={stage.key} className="flex flex-col items-center flex-1">
            <span className="truncate w-full text-center">{stage.label}</span>
            <span className="text-navy-900 font-bold mt-0.5">{stage.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
