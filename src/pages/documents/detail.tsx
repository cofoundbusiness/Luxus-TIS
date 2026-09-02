import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, FileText, Download } from 'lucide-react';
import { getDocumentById } from '../../services/documents/document-service';
import { formatDate } from '../../utils/format';
import { DocumentStatusBadge } from '../../components/documents/document-status-badge';
import { DocumentFormModal } from '../../components/documents/document-form-modal';
import type { Document } from '../../types';

export default function DocumentDetailsPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localDocOverride, setLocalDocOverride] = useState<Document | null>(null);

  const baseDocContext = useMemo(() => {
    if (!documentId) return null;
    return getDocumentById(documentId);
  }, [documentId]);

  if (!baseDocContext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-navy-900 mb-2">Document not found</h1>
        <p className="text-slate-500 mb-6">The document you are looking for does not exist or has been removed.</p>
        <Link to="/documents" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Documents
        </Link>
      </div>
    );
  }

  // Merge context with local overrides
  const doc = localDocOverride || baseDocContext.document;
  const { entityName, truckDetails } = baseDocContext;

  const handleEditDocument = (updatedData: Partial<Document>) => {
    setLocalDocOverride({ ...doc, ...updatedData } as Document);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Link to="/documents" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Documents
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-slate-400" />
                {doc.name}
              </h1>
              <DocumentStatusBadge status={doc.status} />
            </div>
            <p className="text-slate-600">{doc.documentType} • {entityName}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-base font-semibold text-navy-900">Document Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Document Name</div>
              <div className="text-sm font-medium text-navy-900">{doc.name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Type</div>
              <div className="text-sm font-medium text-navy-900">{doc.documentType}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Status</div>
              <div className="mt-1"><DocumentStatusBadge status={doc.status} /></div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Uploaded On</div>
              <div className="text-sm font-medium text-navy-900">{doc.uploadedAt ? formatDate(doc.uploadedAt) : '-'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">Entity Context</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Associated With</div>
                <div className="text-sm font-medium text-navy-900">{doc.entityType} ({doc.entityId})</div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 mb-1">Resolved Entity</div>
                <div className="text-sm font-medium text-navy-900">{entityName}</div>
                {truckDetails && (
                  <div className="text-xs text-slate-500 mt-0.5">{truckDetails}</div>
                )}
              </div>

              {doc.entityType === 'TRUCK' && (
                <div className="pt-2">
                  <Link to={`/inventory/${doc.entityId}`} className="text-sm font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Truck Profile &rarr;
                  </Link>
                </div>
              )}
              {doc.entityType === 'DEAL' && (
                <div className="pt-2">
                  <Link to={`/deals/${doc.entityId}`} className="text-sm font-medium text-navy-600 hover:text-navy-800 hover:underline">
                    View Deal Details &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-semibold text-navy-900">File Reference</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-navy-900 truncate max-w-[200px]">{doc.fileUrl.split('/').pop() || 'document.pdf'}</span>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-navy-600 transition-colors" title="Download placeholder">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 italic">Actual file storage is mocked in Phase 6.</p>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <DocumentFormModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditDocument}
          initialData={doc}
        />
      )}
    </div>
  );
}
