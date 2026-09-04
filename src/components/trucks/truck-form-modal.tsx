import { useState, useRef, useEffect } from 'react';
import { truckSchema } from '../../validations/truck';
import { X, ImagePlus, Star, Trash2 } from 'lucide-react';
import type { Truck } from '../../types';
import { z } from 'zod';

interface TruckFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Truck>, photos?: File[]) => void;
  initialData?: Truck;
}

export function TruckFormModal({ isOpen, onClose, onSubmit, initialData }: TruckFormModalProps) {
  const [formData, setFormData] = useState<Partial<Truck>>(initialData || {
    status: 'AVAILABLE',
    location: 'Chennai Yard',
    manufacturer: '',
    model: '',
    variant: '',
    registrationNumber: '',
    chassisNumber: '',
    year: new Date().getFullYear(),
    mileage: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Create object URLs for previews
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    
    // Cleanup URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedDate = formData.purchaseDate as string;
      if (parsedDate && !parsedDate.includes('T')) {
        parsedDate = new Date(parsedDate).toISOString();
      }

      const payload = {
        ...formData,
        fuelType: formData.fuelType || 'DIESEL',
        transmission: formData.transmission || 'MANUAL',
        expectedProfit: (formData.sellingPrice || 0) - (formData.purchasePrice || 0),
        purchaseDate: parsedDate
      };

      truckSchema.parse(payload);
      onSubmit(payload as Truck, selectedFiles);
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-navy-900">
            {initialData ? 'Edit Truck' : 'Add New Truck'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="truck-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. Tata" />
                {errors.manufacturer && <p className="text-red-500 text-xs mt-1">{errors.manufacturer}</p>}
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input name="model" value={formData.model || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. Signa 4923" />
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
              </div>

              {/* Variant */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Variant</label>
                <input name="variant" value={formData.variant || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. 6x4 Heavy Duty" />
                {errors.variant && <p className="text-red-500 text-xs mt-1">{errors.variant}</p>}
              </div>

              {/* Registration */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                <input name="registrationNumber" value={formData.registrationNumber || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="e.g. TN-01-AB-1234" />
                {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
              </div>

              {/* Chassis Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chassis Number / VIN</label>
                <input name="chassisNumber" value={formData.chassisNumber || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="17-digit VIN" />
                {errors.chassisNumber && <p className="text-red-500 text-xs mt-1">{errors.chassisNumber}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <input type="number" name="year" value={formData.year || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mileage (km)</label>
                <input type="number" name="mileage" value={formData.mileage || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>}
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price (₹)</label>
                <input type="number" name="purchasePrice" value={formData.purchasePrice || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                <input type="number" name="sellingPrice" value={formData.sellingPrice || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
                <input type="date" name="purchaseDate" value={(formData.purchaseDate as string) || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.purchaseDate && <p className="text-red-500 text-xs mt-1">{errors.purchaseDate}</p>}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status || 'AVAILABLE'} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  <option value="AVAILABLE">Available</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="UNDER_PREPARATION">Under Prep</option>
                  <option value="PENDING_DOCUMENTS">Pending Docs</option>
                  <option value="SOLD">Sold</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>
            </div>

            {/* Optional Photos Section */}
            {!initialData && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700">Photos</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Optional. Add one or more truck photos. The first photo will be used as the primary image.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-900 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    Add Photos
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {previewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {previewUrls.map((url, idx) => (
                      <div key={url} className="relative group w-20 h-20 rounded-md border border-slate-200 overflow-hidden bg-slate-50">
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Remove Action */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1.5 bg-white text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Primary Badge */}
                        {idx === 0 && (
                          <div className="absolute top-1 left-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 drop-shadow-sm" />
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-md border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-400"
                    >
                      <ImagePlus className="w-5 h-5 mb-1" />
                      <span className="text-[10px]">Add</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
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
            form="truck-form"
            className="px-4 py-2 bg-navy-900 text-white rounded-md hover:bg-navy-800 text-sm font-medium transition-colors"
          >
            {initialData ? 'Save Changes' : 'Add Truck'}
          </button>
        </div>
      </div>
    </div>
  );
}
