import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck as TruckIcon, ImageIcon, MapPin, Calendar, Gauge } from 'lucide-react';
import type { Truck } from '../../types';
import { formatINR } from '../../utils/format';
import { TruckStatusBadge } from './truck-status-badge';
import { getTruckProfit, getInventoryAge } from '../../services/inventory-service';
import { getPrimaryPhoto } from '../../services/photo-service';
import { PhotoGalleryModal } from './photo-gallery-modal';

interface InventoryCardsProps {
  trucks: Truck[];
}

export function InventoryCards({ trucks }: InventoryCardsProps) {
  const [page, setPage] = useState(1);
  const [galleryTruck, setGalleryTruck] = useState<Truck | null>(null);
  const cardsPerPage = 12;

  const totalPages = Math.ceil(trucks.length / cardsPerPage);
  const paginatedTrucks = trucks.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  return (
    <>
      {paginatedTrucks.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 px-4 py-12 text-center text-slate-500 shadow-sm">
          No trucks found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedTrucks.map(truck => {
            const profit = getTruckProfit(truck);
            const age = getInventoryAge(truck.purchaseDate);
            const primaryPhoto = getPrimaryPhoto(truck.id);
            const photoCount = truck.photos?.length || 0;
            const isOver90Days = truck.status !== 'SOLD' && age > 90;

            return (
              <div
                key={truck.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
              >
                {/* Photo Area */}
                <div
                  className="relative aspect-[16/10] bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => photoCount > 0 ? setGalleryTruck(truck) : undefined}
                >
                  {primaryPhoto ? (
                    <img
                      src={primaryPhoto.url}
                      alt={`${truck.manufacturer} ${truck.model}`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <TruckIcon className="w-10 h-10 mb-1.5" />
                      <span className="text-xs text-slate-400">No photo available</span>
                    </div>
                  )}
                  {photoCount > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setGalleryTruck(truck); }}
                      className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-xs rounded backdrop-blur-sm hover:bg-black/75 transition-colors"
                    >
                      <ImageIcon className="w-3 h-3" />
                      {photoCount} Photo{photoCount !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-3">
                  <Link
                    to={`/inventory/${truck.id}`}
                    className="block hover:underline"
                  >
                    <h3 className="text-sm font-semibold text-navy-900 leading-tight">
                      {truck.manufacturer} {truck.model}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{truck.variant}</p>
                  </Link>

                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <div className="font-medium text-slate-700">{truck.registrationNumber}</div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {truck.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-slate-400" />
                        {truck.mileage.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {truck.location}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500">{formatINR(truck.purchasePrice)}</span>
                      <span className="text-sm font-semibold text-navy-900">{formatINR(truck.sellingPrice)}</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-0.5">
                      Profit {formatINR(profit)}
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <TruckStatusBadge status={truck.status} />
                    <span className={`text-[11px] font-medium ${isOver90Days ? 'text-red-600' : 'text-slate-400'}`}>
                      {truck.status !== 'SOLD' ? `${age}d` : 'Sold'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 px-4 py-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-sm">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-navy-900">{(page - 1) * cardsPerPage + 1}</span> to{' '}
            <span className="font-medium text-navy-900">{Math.min(page * cardsPerPage, trucks.length)}</span> of{' '}
            <span className="font-medium text-navy-900">{trucks.length}</span> trucks
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {galleryTruck && (
        <PhotoGalleryModal
          truck={galleryTruck}
          onClose={() => setGalleryTruck(null)}
        />
      )}
    </>
  );
}
