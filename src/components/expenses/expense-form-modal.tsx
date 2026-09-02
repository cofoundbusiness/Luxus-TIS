import { useState } from 'react';
import { X } from 'lucide-react';
import { expenseSchema } from '../../validations/expense';
import type { Expense } from '../../types';
import { ExpenseCategory } from '../../types/enums';
import { z } from 'zod';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Expense>) => void;
  initialData?: Expense;
}

export function ExpenseFormModal({ isOpen, onClose, onSubmit, initialData }: ExpenseFormModalProps) {
  const [formData, setFormData] = useState<Partial<Expense>>(initialData || {
    category: 'OTHER',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    truckId: '',
    dealId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean up empty strings for optional IDs
      const payload = {
        ...formData,
        truckId: formData.truckId || undefined,
        dealId: formData.dealId || undefined,
      };
      expenseSchema.parse(payload);
      onSubmit(payload as Expense);
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
            {initialData ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="expense-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. Engine oil replacement" />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {Object.values(ExpenseCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" name="date" value={(formData.date as string)?.split('T')[0] || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Associated Truck ID (Optional)</label>
                <input name="truckId" value={formData.truckId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. TRK-001" />
                {errors.truckId && <p className="text-red-500 text-xs mt-1">{errors.truckId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Associated Deal ID (Optional)</label>
                <input name="dealId" value={formData.dealId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. DL-001" />
                {errors.dealId && <p className="text-red-500 text-xs mt-1">{errors.dealId}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Additional details..." />
                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
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
            form="expense-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
