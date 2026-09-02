import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/format';

interface TruckDocumentsProps {
  documents: any[]; // using any since Document type isn't fully exported, we know the shape
}

export function TruckDocuments({ documents }: TruckDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-base font-semibold text-navy-900">Documents</h2>
        </div>
        <div className="p-6 text-center text-slate-500 text-sm">
          No documents uploaded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-base font-semibold text-navy-900">Documents</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {documents.map(doc => (
          <div key={doc.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
            <div className="mt-0.5">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium text-navy-900">{doc.name}</h4>
                {doc.status === 'AVAILABLE' ? (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" /> Valid
                  </span>
                ) : doc.status === 'EXPIRED' ? (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                    <AlertCircle className="w-3 h-3" /> Expired
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    <AlertCircle className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">Type: {doc.type}</div>
              <div className="text-xs text-slate-400 mt-1">Uploaded: {formatDate(doc.uploadedAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
