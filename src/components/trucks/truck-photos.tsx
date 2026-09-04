import { useState, useRef } from 'react';
import { ImagePlus, Trash2, Star, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import type { Truck, TruckPhoto } from '../../types';
import { getTruckPhotos, addTruckPhotos, removeTruckPhoto, setPrimaryTruckPhoto, movePhotoLeft, movePhotoRight } from '../../services/photo-service';
import { PhotoGalleryModal } from './photo-gallery-modal';
import { cn } from '../../utils/cn';

interface TruckPhotosProps {
  truck: Truck;
  onPhotosChanged?: () => void;
}

export function TruckPhotos({ truck, onPhotosChanged }: TruckPhotosProps) {
  const [photos, setPhotos] = useState<TruckPhoto[]>(() => getTruckPhotos(truck.id));
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryPhotoId, setGalleryPhotoId] = useState<string | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setPhotos(getTruckPhotos(truck.id));
    onPhotosChanged?.();
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    addTruckPhotos(truck.id, files);
    refresh();
    // Reset input so the same files can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (photoId: string) => {
    removeTruckPhoto(truck.id, photoId);
    setDeleteConfirm(null);
    refresh();
  };

  const handleSetPrimary = (photoId: string) => {
    setPrimaryTruckPhoto(truck.id, photoId);
    refresh();
  };

  const handleMoveLeft = (photoId: string) => {
    movePhotoLeft(truck.id, photoId);
    refresh();
  };

  const handleMoveRight = (photoId: string) => {
    movePhotoRight(truck.id, photoId);
    refresh();
  };

  const openGallery = (photoId?: string) => {
    setGalleryPhotoId(photoId);
    setGalleryOpen(true);
  };

  const primaryPhoto = photos.find(p => p.isPrimary) || photos[0];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-navy-900">Photos</h3>
          <span className="text-xs text-slate-400">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
        </div>
        <button
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
          onChange={handleAddPhotos}
          className="hidden"
        />
      </div>

      <div className="p-4">
        {photos.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 hover:bg-slate-50/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-sm text-slate-500">Click to add truck photos</span>
            <span className="text-xs text-slate-400 mt-1">The first photo will become the primary image</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary Photo Large */}
            {primaryPhoto && (
              <div
                className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openGallery(primaryPhoto.id)}
              >
                <img
                  src={primaryPhoto.url}
                  alt="Primary truck photo"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-semibold uppercase tracking-wider rounded">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Primary
                  </span>
                </div>
              </div>
            )}

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {photos.map((photo, idx) => (
                <div key={photo.id} className="relative group">
                  <div
                    className={cn(
                      "aspect-square rounded overflow-hidden cursor-pointer border-2 transition-all",
                      photo.isPrimary ? "border-amber-400" : "border-transparent hover:border-slate-300"
                    )}
                    onClick={() => openGallery(photo.id)}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-0.5">
                      {idx > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveLeft(photo.id); }}
                          className="p-1 bg-white/90 rounded hover:bg-white text-slate-700 transition-colors"
                          title="Move left"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                      {!photo.isPrimary && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSetPrimary(photo.id); }}
                          className="p-1 bg-white/90 rounded hover:bg-amber-100 text-amber-600 transition-colors"
                          title="Set as primary"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(photo.id); }}
                        className="p-1 bg-white/90 rounded hover:bg-red-100 text-red-500 transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      {idx < photos.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveRight(photo.id); }}
                          className="p-1 bg-white/90 rounded hover:bg-white text-slate-700 transition-colors"
                          title="Move right"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {photo.isPrimary && (
                    <div className="absolute top-0.5 left-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 drop-shadow" />
                    </div>
                  )}
                </div>
              ))}

              {/* Add More Button */}
              <div
                className="aspect-square rounded border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-5 h-5 text-slate-300" />
                <span className="text-[10px] text-slate-400 mt-0.5">Add</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5">
              <h3 className="text-sm font-bold text-navy-900 mb-2">Remove Photo?</h3>
              <p className="text-xs text-slate-600">
                This action cannot be undone. If this is the primary photo, the next photo will become primary.
              </p>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(deleteConfirm)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {galleryOpen && (
        <PhotoGalleryModal
          truck={truck}
          onClose={() => setGalleryOpen(false)}
          initialPhotoId={galleryPhotoId}
        />
      )}
    </div>
  );
}
