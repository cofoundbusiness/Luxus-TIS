import { useState, useMemo } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { dealSchema } from '../../validations/deal';
import type { Deal } from '../../types';
import { DealStatus } from '../../types/enums';
import { trucks, customers, brokers, deals } from '../../data/mock';
import { z } from 'zod';
import { formatINR } from '../../utils/format';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Deal>) => void;
  initialData?: Deal;
}

export function DealFormModal({ isOpen, onClose, onSubmit, initialData }: DealFormModalProps) {
  const [formData, setFormData] = useState<Partial<Deal>>(initialData || {
    truckId: '',
    customerId: '',
    brokerId: '',
    salePrice: 0,
    saleDate: '',
    status: 'NEGOTIATION',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const availableTrucks = useMemo(() => {
    // Return all trucks, but we'll show warnings if they pick a SOLD/BOOKED one
    return trucks;
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => {
      const next = { ...prev, [name]: parsedValue };
      
      // Auto pre-fill selling price if truck changes and salePrice is currently 0
      if (name === 'truckId' && next.truckId) {
        const truck = trucks.find(t => t.id === next.truckId);
        if (truck && (!prev.salePrice || prev.salePrice === 0)) {
          next.salePrice = truck.sellingPrice || 0;
        }
      }
      return next;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (conflictWarning) setConflictWarning(null);
  };

  const checkForConflicts = (): string | null => {
    if (!formData.truckId) return null;

    const truck = trucks.find(t => t.id === formData.truckId);
    if (!truck) return null;

    if (truck.status === 'SOLD' && (!initialData || initialData.truckId !== formData.truckId)) {
      return `This truck (${truck.registrationNumber}) is already marked as SOLD in inventory. Creating an active deal may conflict with historical records.`;
    }

    // Check for other active deals on this truck
    const activeConflicts = deals.filter(d => 
      d.truckId === formData.truckId && 
      d.id !== initialData?.id && 
      (d.status === 'BOOKED' || d.status === 'NEGOTIATION')
    );

    if (activeConflicts.length > 0) {
      const conflictIds = activeConflicts.map(d => d.id).join(', ');
      return `This truck is currently associated with other active deals (${conflictIds}). Are you sure you want to create/update this deal?`;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent, ignoreWarning = false) => {
    e.preventDefault();
    
    if (!ignoreWarning) {
      const warning = checkForConflicts();
      if (warning) {
        setConflictWarning(warning);
        return;
      }
    }

    try {
      const payload = { ...formData };
      
      payload.brokerId = payload.brokerId || undefined;
      
      // Handle Date padding for zod datetime validation
      if (payload.saleDate && !payload.saleDate.includes('T')) {
        payload.saleDate = `${payload.saleDate}T12:00:00Z`;
      }

      dealSchema.parse(payload);
      onSubmit(payload as Deal);
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
            {initialData ? 'Edit Deal' : 'New Deal'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {conflictWarning && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Potential Conflict Detected</p>
                <p className="text-sm mb-3">{conflictWarning}</p>
                <div className="flex gap-3">
                  <button onClick={() => setConflictWarning(null)} className="text-xs font-semibold text-amber-900 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded transition-colors">Review Entry</button>
                  <button onClick={(e) => handleSubmit(e, true)} className="text-xs font-semibold text-amber-700 hover:text-amber-900 px-3 py-1.5">Proceed Anyway</button>
                </div>
              </div>
            </div>
          )}

          <form id="deal-form" onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Truck *</label>
                <select name="truckId" value={formData.truckId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="" disabled>Select a truck...</option>
                  {availableTrucks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.registrationNumber} - {t.manufacturer} {t.model} ({t.year}) - {formatINR(t.sellingPrice)}
                    </option>
                  ))}
                </select>
                {errors.truckId && <p className="text-red-500 text-xs mt-1">{errors.truckId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer *</label>
                <select name="customerId" value={formData.customerId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="" disabled>Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.companyName ? `(${c.companyName})` : ''}
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>}
                <div className="mt-1 text-right">
                  <span className="text-[10px] text-slate-500">Customer not listed? Navigate to Customers to add one.</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Broker (Optional)</label>
                <select name="brokerId" value={formData.brokerId || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="">No Broker / Direct Sale</option>
                  {brokers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.companyName ? `(${b.companyName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price (₹) *</label>
                <input type="number" name="salePrice" value={formData.salePrice || 0} onChange={handleChange} min="0" className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.salePrice && <p className="text-red-500 text-xs mt-1">{errors.salePrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sale Date *</label>
                <input type="date" name="saleDate" value={formData.saleDate ? (formData.saleDate as string).split('T')[0] : ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.saleDate && <p className="text-red-500 text-xs mt-1">{errors.saleDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deal Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {Object.values(DealStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Deal specific terms, contingencies..." />
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
            form="deal-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Deal'}
          </button>
        </div>
      </div>
    </div>
  );
}
