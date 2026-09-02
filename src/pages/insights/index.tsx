import { useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { generateInsights } from '../../services/insights/insight-engine';
import type { Insight } from '../../services/insights/insight-engine';
import { AlertTriangle, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InsightsPage() {
  const insights = useMemo(() => generateInsights(), []);

  const getPriorityIcon = (priority: Insight['priority']) => {
    switch (priority) {
      case 'CRITICAL': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'ATTENTION': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'INFO': return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityBg = (priority: Insight['priority']) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-50 border-red-200';
      case 'ATTENTION': return 'bg-amber-50 border-amber-200';
      case 'INFO': return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <PageHeader 
        title="Management Insights" 
        description="Deterministic, data-driven intelligence based on current operational realities."
      />

      <div className="space-y-4">
        {insights.length > 0 ? (
          insights.map(insight => (
            <div key={insight.id} className={`p-5 rounded-lg border ${getPriorityBg(insight.priority)} flex flex-col md:flex-row md:items-start gap-4 transition-all shadow-sm`}>
              <div className="shrink-0 mt-0.5">
                {getPriorityIcon(insight.priority)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-navy-900">{insight.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/50 border border-slate-200 text-slate-600">
                    {insight.category}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-3">{insight.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs font-semibold text-slate-600 bg-white/60 px-2 py-1 rounded">
                    Metric: <span className="text-navy-900">{insight.metric}</span>
                  </div>
                  {insight.actionLink && insight.actionLabel && (
                    <Link to={insight.actionLink} className="inline-flex items-center gap-1.5 text-xs font-medium text-navy-700 hover:text-navy-900 bg-white px-3 py-1.5 rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                      {insight.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-navy-900 mb-1">No Active Insights</h3>
            <p className="text-sm text-slate-500">The business is operating normally with no outstanding attention required.</p>
          </div>
        )}
      </div>
    </div>
  );
}
