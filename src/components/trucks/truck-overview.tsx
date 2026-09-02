import type { Truck } from '../../types';

interface TruckOverviewProps {
  truck: Truck;
}

export function TruckOverview({ truck }: TruckOverviewProps) {
  const fields = [
    { label: 'Registration Number', value: truck.registrationNumber },
    { label: 'Chassis / VIN', value: truck.chassisNumber },
    { label: 'Manufacturer', value: truck.manufacturer },
    { label: 'Model', value: truck.model },
    { label: 'Variant', value: truck.variant },
    { label: 'Year', value: truck.year },
    { label: 'Mileage', value: `${truck.mileage.toLocaleString()} km` },
    { label: 'Fuel Type', value: truck.fuelType },
    { label: 'Transmission', value: truck.transmission },
    { label: 'Location', value: truck.location },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-base font-semibold text-navy-900">Vehicle Information</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          {fields.map(field => (
            <div key={field.label}>
              <div className="text-xs text-slate-500 mb-1">{field.label}</div>
              <div className="text-sm font-medium text-navy-900">{field.value || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
