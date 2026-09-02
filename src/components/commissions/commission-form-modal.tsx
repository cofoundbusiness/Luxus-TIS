import { useState } from 'react';
import { X } from 'lucide-react';
import { commissionSchema } from '../../validations/commission';
import type { Commission } from '../../types';
import { CommissionStatus } from '../../types/enums';
import { deals, brokers, loans } from '../../data/mock';
import { z } from 'zod';
import { formatINR } from '../../utils/format';

interface CommissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Commission>) => void;
  initialData?: Commission;
}

export function CommissionFormModal({ isOpen, onClose, onSubmit, initialData }: CommissionFormModalProps) {
  const [formData, setFormData] = useState<Partial<Commission>>(initialData || {
    type: 'BROKER',
    dealId: '',
    brokerId: '',
    loanId: '',
    amount: 0,
    rate: 0,
    status: 'PENDING',
    dueDate: '',
    paidDate: '',
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

    setFormData(prev => {
      const next = { ...prev, [name]: parsedValue };
      
      // Auto-resolve dealId if loan is selected for finance commissions
      if (name === 'loanId' && parsedValue) {
        const loan = loans.find(l => l.id === parsedValue);
        if (loan) {
          next.dealId = loan.dealId;
          
          // Optionally prepopulate amount from loan's expected commission if currently 0
          if (!prev.amount) {
            next.amount = loan.expectedCommission;
          }
        }
      }

      // If switching type, clear irrelevant fields
      if (name === 'type') {
        if (parsedValue === 'BROKER') {
          next.loanId = '';
        } else {
          next.brokerId = '';
        }
      }

      return next;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = { ...formData };
      
      if (payload.dueDate && !payload.dueDate.includes('T')) {
        payload.dueDate = `${payload.dueDate}T12:00:00Z`;
      } else if (!payload.dueDate) {
        delete payload.dueDate;
      }

      if (payload.paidDate && !payload.paidDate.includes('T')) {
        payload.paidDate = `${payload.paidDate}T12:00:00Z`;
      } else if (!payload.paidDate) {
        delete payload.paidDate;
      }
      
      if (!payload.rate) {
        delete payload.rate;
      }
      if (!payload.brokerId) {
        delete payload.brokerId;
      }
      if (!payload.loanId) {
        delete payload.loanId;
      }

      commissionSchema.parse(payload);
      onSubmit(payload as Commission);
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
            {initialData ? 'Edit Commission' : 'New Commission'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="commission-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Commission Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="BROKER" checked={formData.type === 'BROKER'} onChange={handleChange} disabled={!!initialData} className="text-navy-600 focus:ring-navy-500" />
                    <span className="text-sm font-medium text-slate-700">Broker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="FINANCE" checked={formData.type === 'FINANCE'} onChange={handleChange} disabled={!!initialData} className="text-navy-600 focus:ring-navy-500" />
                    <span className="text-sm font-medium text-slate-700">Finance Partner</span>
                  </label>
                </div>
              </div>

              {formData.type === 'FINANCE' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Loan *</label>
                  <select name="loanId" value={formData.loanId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                    <option value="">Select a loan...</option>
                    {loans.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.id} - Exp. Comm: {formatINR(l.expectedCommission)} (Deal {l.dealId})
                      </option>
                    ))}
                  </select>
                  {errors.loanId && <p className="text-red-500 text-xs mt-1">{errors.loanId}</p>}
                </div>
              )}

              {formData.type === 'BROKER' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Broker *</label>
                  <select name="brokerId" value={formData.brokerId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                    <option value="">Select a broker...</option>
                    {brokers.filter(b => b.status === 'ACTIVE' || b.id === initialData?.brokerId).map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.companyName ? `(${b.companyName})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.brokerId && <p className="text-red-500 text-xs mt-1">{errors.brokerId}</p>}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Deal *</label>
                <select name="dealId" value={formData.dealId || ''} onChange={handleChange} disabled={formData.type === 'FINANCE'} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 disabled:bg-slate-100 disabled:text-slate-500">
                  <option value="" disabled>Select a deal...</option>
                  {deals.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} - Status: {d.status}
                    </option>
                  ))}
                </select>
                {errors.dealId && <p className="text-red-500 text-xs mt-1">{errors.dealId}</p>}
                {formData.type === 'FINANCE' && <p className="text-[10px] text-slate-500 mt-1">Deal is automatically resolved from the selected loan.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹) *</label>
                <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} min="0" className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rate (%) <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="number" name="rate" value={formData.rate || ''} onChange={handleChange} min="0" max="100" step="0.01" className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {Object.values(CommissionStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate ? (formData.dueDate as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paid Date</label>
                  <input type="date" name="paidDate" value={formData.paidDate ? (formData.paidDate as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Reference numbers, specific terms..." />
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
            form="commission-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Commission'}
          </button>
        </div>
      </div>
    </div>
  );
}
