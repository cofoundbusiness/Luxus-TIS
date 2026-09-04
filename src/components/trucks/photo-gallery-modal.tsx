import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Truck } from '../../types';
import { getTruckPhotos } from '../../services/photo-service';
import { cn } from '../../utils/cn';

interface PhotoGalleryModalProps {
  truck: Truck;
  onClose: () => void;
  initialPhotoId?: string;
}

export function PhotoGalleryModal({ truck, onClose, initialPhotoId }: PhotoGalleryModalProps) {
  const photos = getTruckPhotos(truck.id);
  const initialIndex = initialPhotoId ? photos.findIndex(p => p.id === initialPhotoId) : 0;
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, initialIndex));

  const currentPhoto = photos[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  if (photos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="text-white">
          <span className="text-sm font-medium">{truck.manufacturer} {truck.model}</span>
          <span className="text-xs text-slate-400 ml-2">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 relative flex items-center justify-center min-h-0 px-12">
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentPhoto.url}
          alt={`${truck.manufacturer} ${truck.model} - Photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded"
        />

        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto justify-center py-1 no-scrollbar">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "relative w-16 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all",
                  idx === currentIndex
                    ? "border-white ring-1 ring-white/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={photo.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {photo.isPrimary && (
                  <div className="absolute top-0.5 left-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {currentPhoto.isPrimary && (
            <div className="text-center mt-1">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-medium">Primary Photo</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
