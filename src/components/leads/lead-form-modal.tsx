import { useState } from 'react';
import { X } from 'lucide-react';
import { leadSchema } from '../../validations/lead';
import type { Lead, Customer } from '../../types';
import { LeadStatus } from '../../types/enums';
import { customers, trucks, brokers } from '../../data/mock';
import { z } from 'zod';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Partial<Lead>, newCustomerData?: Partial<Customer>) => void;
  initialData?: Partial<Lead>;
}

export function LeadFormModal({ isOpen, onClose, onSubmit, initialData }: LeadFormModalProps) {
  const [formData, setFormData] = useState<Partial<Lead>>(initialData || {
    customerId: '',
    truckId: '',
    brokerId: '',
    source: 'Walk-in',
    requirement: '',
    budget: 0,
    status: 'NEW',
    probability: 10,
    nextFollowUp: '',
    notes: '',
    assignedTo: 'USR-001'
  });

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerData, setCustomerData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    companyName: '',
    city: ''
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Cleanup empty IDs
      payload.truckId = payload.truckId || undefined;
      payload.brokerId = payload.brokerId || undefined;
      
      // Temporary ID for validation if new customer
      if (isNewCustomer) {
        payload.customerId = 'TEMP_CUST';
      }

      // Ensure nextFollowUp is ISO for zod, but allow blank
      if (payload.nextFollowUp) {
        if (!payload.nextFollowUp.includes('T')) {
          payload.nextFollowUp = `${payload.nextFollowUp}T12:00:00Z`;
        }
      } else {
        payload.nextFollowUp = undefined;
      }

      leadSchema.parse(payload);
      
      // If new customer, we expect the parent to validate the customer fields minimally
      onSubmit(payload as Lead, isNewCustomer ? customerData : undefined);
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-navy-900">
            {initialData ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Customer Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-navy-900">Customer Details</h3>
                {!initialData && (
                  <button 
                    type="button" 
                    onClick={() => setIsNewCustomer(!isNewCustomer)}
                    className="text-xs font-medium text-navy-600 hover:text-navy-800"
                  >
                    {isNewCustomer ? 'Select Existing Customer' : '+ Create New Customer'}
                  </button>
                )}
              </div>

              {!isNewCustomer ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Select Customer</label>
                  <select name="customerId" value={formData.customerId} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                    <option value="" disabled>Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.companyName ? `(${c.companyName})` : ''} - {c.phone}
                      </option>
                    ))}
                  </select>
                  {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name *</label>
                    <input name="name" value={customerData.name} onChange={handleCustomerChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" required={isNewCustomer} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                    <input name="phone" value={customerData.phone} onChange={handleCustomerChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" required={isNewCustomer} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                    <input name="companyName" value={customerData.companyName} onChange={handleCustomerChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                    <input name="city" value={customerData.city} onChange={handleCustomerChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Requirement *</label>
                <input name="requirement" value={formData.requirement || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. Needs 10-wheeler tipper" />
                {errors.requirement && <p className="text-red-500 text-xs mt-1">{errors.requirement}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Truck (Optional)</label>
                <select name="truckId" value={formData.truckId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="">None</option>
                  {trucks.map(t => (
                    <option key={t.id} value={t.id}>{t.manufacturer} {t.model} ({t.registrationNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Broker (Optional)</label>
                <select name="brokerId" value={formData.brokerId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="">Direct (No Broker)</option>
                  {brokers.map(b => (
                    <option key={b.id} value={b.id}>{b.name} {b.companyName ? `(${b.companyName})` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹)</label>
                <input type="number" name="budget" value={formData.budget || 0} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Probability (%)</label>
                <input type="number" name="probability" value={formData.probability || 0} min="0" max="100" onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.probability && <p className="text-red-500 text-xs mt-1">{errors.probability}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Next Follow-up</label>
                <input type="date" name="nextFollowUp" value={formData.nextFollowUp ? (formData.nextFollowUp as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                <input name="source" value={formData.source || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. Walk-in, Website, Referral" />
                {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Discussion details..." />
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
            form="lead-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
