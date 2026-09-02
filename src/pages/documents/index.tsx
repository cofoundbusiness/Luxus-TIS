import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/page-header';
import { DocumentSummary } from '../../components/documents/document-summary';
import { DocumentFilters } from '../../components/documents/document-filters';
import type { DocumentFilterState } from '../../components/documents/document-filters';
import { DocumentTable } from '../../components/documents/document-table';
import { getDocumentSummary, searchDocuments } from '../../services/documents/document-service';
import { documents as mockDocuments } from '../../data/mock';
import { Plus } from 'lucide-react';
import { DocumentFormModal } from '../../components/documents/document-form-modal';
import type { Document } from '../../types';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(mockDocuments);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DocumentFilterState>({
    status: 'All',
    documentType: 'All',
    truckId: 'All'
  });

  const summary = useMemo(() => getDocumentSummary(docs), [docs]);
  const filteredDocs = useMemo(() => searchDocuments(docs, searchQuery, filters), [docs, searchQuery, filters]);

  const handleAddDocument = (newDocData: Partial<Document>) => {
    const newDoc: Document = {
      ...newDocData,
      id: `DOC-${Date.now()}`,
    } as Document;
    
    setDocs([newDoc, ...docs]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Documents" 
        description="Track vehicle and transaction documentation."
        actions={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-md hover:bg-navy-800 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        }
      />

      <DocumentSummary summary={summary} />

      <DocumentFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        allDocuments={docs}
      />

      <DocumentTable documents={filteredDocs} />

      {isAddModalOpen && (
        <DocumentFormModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddDocument} 
        />
      )}
    </div>
  );
}
