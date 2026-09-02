import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { documentSchema } from '../../validations/document';
import type { Document } from '../../types';
import { z } from 'zod';

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Document>) => void;
  initialData?: Document;
}

export function DocumentFormModal({ isOpen, onClose, onSubmit, initialData }: DocumentFormModalProps) {
  const [formData, setFormData] = useState<Partial<Document>>(initialData || {
    entityType: 'TRUCK',
    entityId: '',
    documentType: '',
    name: '',
    status: 'AVAILABLE',
    uploadedAt: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        fileUrl: formData.fileUrl || '/mock-file.pdf',
        uploadedAt: formData.uploadedAt || new Date().toISOString()
      };
      documentSchema.parse(payload);
      onSubmit(payload as Document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-navy-900">
            {initialData ? 'Edit Document' : 'Add New Document'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="document-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Entity Type</label>
                <select name="entityType" value={formData.entityType} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="TRUCK">Truck</option>
                  <option value="DEAL">Deal</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="BROKER">Broker</option>
                  <option value="LOAN">Loan</option>
                  <option value="FINANCE_PARTNER">Finance Partner</option>
                </select>
                {errors.entityType && <p className="text-red-500 text-xs mt-1">{errors.entityType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Entity ID</label>
                <input name="entityId" value={formData.entityId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. TRK-001" />
                {errors.entityId && <p className="text-red-500 text-xs mt-1">{errors.entityId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                <input name="documentType" value={formData.documentType || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. RC, Insurance" />
                {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. Original RC Book" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="AVAILABLE">Available</option>
                  <option value="PENDING">Pending</option>
                  <option value="EXPIRED">Expired</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Uploaded Date</label>
                <input type="date" name="uploadedAt" value={(formData.uploadedAt as string)?.split('T')[0] || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.uploadedAt && <p className="text-red-500 text-xs mt-1">{errors.uploadedAt}</p>}
              </div>
            </div>

            {/* Fake file upload UI */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">File Upload</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                <p className="text-xs text-amber-600 mt-3 italic max-w-xs">Note: File storage will be connected in the backend phase. This is currently a mockup.</p>
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="document-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Add Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
