import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { customerSchema } from '../../validations/customer';
import type { Customer } from '../../types';
import { customers } from '../../data/mock';
import { z } from 'zod';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Customer>) => void;
  initialData?: Customer;
}

export function CustomerFormModal({ isOpen, onClose, onSubmit, initialData }: CustomerFormModalProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(initialData || {
    name: '',
    phone: '',
    email: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (duplicateWarning) setDuplicateWarning(null); // Clear warning on edit
  };

  const checkForDuplicates = (): string | null => {
    if (initialData) return null; // Don't warn on edit
    
    if (formData.phone) {
      const matchPhone = customers.find(c => c.phone === formData.phone);
      if (matchPhone) return `A customer with phone ${formData.phone} already exists (${matchPhone.name}).`;
    }
    
    if (formData.email && formData.email !== '') {
      const matchEmail = customers.find(c => c.email?.toLowerCase() === formData.email?.toLowerCase());
      if (matchEmail) return `A customer with email ${formData.email} already exists (${matchEmail.name}).`;
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent, ignoreWarning = false) => {
    e.preventDefault();
    
    if (!ignoreWarning) {
      const warning = checkForDuplicates();
      if (warning) {
        setDuplicateWarning(warning);
        return;
      }
    }

    try {
      // Zod validation
      const payload = {
        ...formData,
        email: formData.email || undefined
      };
      
      customerSchema.parse(payload);
      onSubmit(payload as Customer);
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
            {initialData ? 'Edit Customer' : 'New Customer'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {duplicateWarning && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Potential Duplicate Found</p>
                <p className="text-sm mb-3">{duplicateWarning}</p>
                <div className="flex gap-3">
                  <button onClick={() => setDuplicateWarning(null)} className="text-xs font-semibold text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded transition-colors">Fix Entry</button>
                  <button onClick={(e) => handleSubmit(e, true)} className="text-xs font-semibold text-amber-700 hover:text-amber-900 px-3 py-1.5">Continue Anyway</button>
                </div>
              </div>
            </div>
          )}

          <form id="customer-form" onSubmit={(e) => handleSubmit(e, false)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. John Doe" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. +91 9876543210" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Optional" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Company / Fleet Name</label>
                <input name="companyName" value={formData.companyName || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. ABC Logistics" />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Street address" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input name="city" value={formData.city || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input name="state" value={formData.state || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Additional customer details..." />
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
            form="customer-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}
