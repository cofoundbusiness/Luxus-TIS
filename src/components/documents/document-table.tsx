import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { DocumentStatusBadge } from './document-status-badge';
import type { DocumentContext } from '../../services/documents/document-service';

interface DocumentTableProps {
  documents: DocumentContext[];
}

type SortField = 'name' | 'uploadedAt' | 'status' | 'documentType';

export function DocumentTable({ documents }: DocumentTableProps) {
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field !== 'uploadedAt');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortAsc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const sorted = [...documents].sort((a, b) => {
    let valA: any = a.document[sortField];
    let valB: any = b.document[sortField];

    if (sortField === 'uploadedAt') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Document {getSortIcon('name')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('documentType')}>
                <div className="flex items-center gap-1">Type {getSortIcon('documentType')}</div>
              </th>
              <th className="px-4 py-3 font-medium">Entity Context</th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('uploadedAt')}>
                <div className="flex items-center gap-1">Uploaded {getSortIcon('uploadedAt')}</div>
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No documents found matching your criteria.
                </td>
              </tr>
            ) : (
              paginated.map(ctx => {
                const { document: doc, entityName, truckDetails } = ctx;
                const isAttention = doc.status === 'PENDING' || doc.status === 'EXPIRED';

                return (
                  <tr key={doc.id} className={`hover:bg-slate-50 transition-colors ${isAttention ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <Link to={`/documents/${doc.id}`} className="flex items-center gap-2 font-medium text-navy-900 hover:underline">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {doc.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{doc.documentType}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{entityName}</div>
                      {truckDetails && <div className="text-xs text-slate-500">{truckDetails}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <DocumentStatusBadge status={doc.status} />
                      {isAttention && (
                        <div className="text-[10px] text-red-600 mt-1">
                          {doc.status === 'PENDING' ? 'Document required' : 'Document expired'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{doc.uploadedAt ? formatDate(doc.uploadedAt) : '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/documents/${doc.id}`} className="text-navy-600 hover:text-navy-800 text-xs font-medium">
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-navy-900">{(page - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="font-medium text-navy-900">{Math.min(page * rowsPerPage, sorted.length)}</span> of{' '}
            <span className="font-medium text-navy-900">{sorted.length}</span> documents
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
