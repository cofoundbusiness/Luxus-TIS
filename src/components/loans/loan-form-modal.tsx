import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { loanSchema } from '../../validations/loan';
import type { Loan } from '../../types';
import { LoanStatus } from '../../types/enums';
import { deals, customers, trucks, financePartners } from '../../data/mock';
import { z } from 'zod';
import { formatINR } from '../../utils/format';

interface LoanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Loan>) => void;
  initialData?: Loan;
}

export function LoanFormModal({ isOpen, onClose, onSubmit, initialData }: LoanFormModalProps) {
  const [formData, setFormData] = useState<Partial<Loan>>(initialData || {
    dealId: '',
    customerId: '',
    truckId: '',
    financePartnerId: '',
    loanAmount: 0,
    commissionRate: 0,
    expectedCommission: 0,
    receivedCommission: 0,
    status: 'APPLICATION',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-resolve customer and truck when deal changes
  useEffect(() => {
    if (formData.dealId && !initialData) {
      const deal = deals.find(d => d.id === formData.dealId);
      if (deal) {
        setFormData(prev => ({
          ...prev,
          customerId: deal.customerId,
          truckId: deal.truckId,
          // Pre-fill loan amount to sale price as a convenience, though user should edit
          loanAmount: prev.loanAmount ? prev.loanAmount : deal.salePrice
        }));
      }
    }
  }, [formData.dealId, initialData]);

  // Auto-resolve commission rate when partner changes
  useEffect(() => {
    if (formData.financePartnerId) {
      const fp = financePartners.find(p => p.id === formData.financePartnerId);
      if (fp && (!initialData || initialData.financePartnerId !== formData.financePartnerId)) {
        setFormData(prev => {
          const rate = fp.commissionRate;
          const expected = prev.loanAmount ? (prev.loanAmount * rate) / 100 : 0;
          return {
            ...prev,
            commissionRate: rate,
            expectedCommission: expected
          };
        });
      }
    }
  }, [formData.financePartnerId, initialData]);

  // Recalculate expected commission if amount or rate changes manually
  const updateExpectedCommission = (amount: number, rate: number) => {
    return (amount * rate) / 100;
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => {
      const next = { ...prev, [name]: parsedValue };
      
      if (name === 'loanAmount') {
        next.expectedCommission = updateExpectedCommission(parsedValue, prev.commissionRate || 0);
      } else if (name === 'commissionRate') {
        next.expectedCommission = updateExpectedCommission(prev.loanAmount || 0, parsedValue);
      }

      return next;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = { ...formData };
      
      // Handle Date padding for zod datetime validation
      if (payload.applicationDate && !payload.applicationDate.includes('T')) {
        payload.applicationDate = `${payload.applicationDate}T12:00:00Z`;
      }
      if (payload.approvalDate && !payload.approvalDate.includes('T')) {
        payload.approvalDate = `${payload.approvalDate}T12:00:00Z`;
      } else if (!payload.approvalDate) {
        delete payload.approvalDate;
      }
      
      if (payload.receivedDate && !payload.receivedDate.includes('T')) {
        payload.receivedDate = `${payload.receivedDate}T12:00:00Z`;
      } else if (!payload.receivedDate) {
        delete payload.receivedDate;
      }

      loanSchema.parse(payload);
      onSubmit(payload as Loan);
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

  // Derive display values for read-only contextual fields
  const selectedDeal = deals.find(d => d.id === formData.dealId);
  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedTruck = trucks.find(t => t.id === formData.truckId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-navy-900">
            {initialData ? 'Edit Loan Application' : 'New Loan Application'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="loan-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
              <h3 className="text-sm font-semibold text-navy-900 mb-2 border-b border-slate-200 pb-2">Transaction Context</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Deal *</label>
                <select name="dealId" value={formData.dealId || ''} onChange={handleChange} disabled={!!initialData} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 disabled:bg-slate-100 disabled:text-slate-500">
                  <option value="" disabled>Select a deal...</option>
                  {deals.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} - Sale Price: {formatINR(d.salePrice)}
                    </option>
                  ))}
                </select>
                {errors.dealId && <p className="text-red-500 text-xs mt-1">{errors.dealId}</p>}
                {!initialData && <p className="text-xs text-slate-500 mt-1">Customer and Truck will automatically resolve from the selected deal.</p>}
              </div>

              {selectedDeal && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Customer</label>
                    <div className="text-sm font-medium text-slate-800">{selectedCustomer?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Truck</label>
                    <div className="text-sm font-medium text-slate-800">{selectedTruck?.registrationNumber || 'Unknown'} - {selectedTruck?.manufacturer} {selectedTruck?.model}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Finance Partner *</label>
                <select name="financePartnerId" value={formData.financePartnerId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="" disabled>Select a partner...</option>
                  {financePartners.filter(fp => fp.status === 'ACTIVE' || fp.id === initialData?.financePartnerId).map(fp => (
                    <option key={fp.id} value={fp.id}>
                      {fp.name} (Base Rate: {fp.commissionRate}%)
                    </option>
                  ))}
                </select>
                {errors.financePartnerId && <p className="text-red-500 text-xs mt-1">{errors.financePartnerId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (₹) *</label>
                <input type="number" name="loanAmount" value={formData.loanAmount || ''} onChange={handleChange} min="0" className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Commission Rate (%) *</label>
                <input type="number" name="commissionRate" value={formData.commissionRate || ''} onChange={handleChange} min="0" max="100" step="0.01" className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.commissionRate && <p className="text-red-500 text-xs mt-1">{errors.commissionRate}</p>}
              </div>

              <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 p-3 rounded-md flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-800">Expected Finance Commission:</span>
                <span className="text-lg font-bold text-emerald-700">{formatINR(formData.expectedCommission || 0)}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {Object.values(LoanStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application Date *</label>
                <input type="date" name="applicationDate" value={formData.applicationDate ? (formData.applicationDate as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.applicationDate && <p className="text-red-500 text-xs mt-1">{errors.applicationDate}</p>}
              </div>

              {(formData.status === 'APPROVED' || formData.status === 'DISBURSED') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Approval Date</label>
                  <input type="date" name="approvalDate" value={formData.approvalDate ? (formData.approvalDate as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </div>
              )}

              {formData.status === 'DISBURSED' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Disbursement Date</label>
                  <input type="date" name="receivedDate" value={formData.receivedDate ? (formData.receivedDate as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Special terms, contingencies..." />
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
            form="loan-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Loan'}
          </button>
        </div>
      </div>
    </div>
  );
}
