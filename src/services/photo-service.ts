import { trucks } from '../data/mock';
import type { TruckPhoto } from '../types';

export const getTruckPhotos = (truckId: string): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  return (truck?.photos || []).sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getPrimaryPhoto = (truckId: string): TruckPhoto | undefined => {
  const photos = getTruckPhotos(truckId);
  return photos.find(p => p.isPrimary) || photos[0];
};

export const addTruckPhotos = (truckId: string, files: File[]): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  if (!truck) return [];
  
  if (!truck.photos) truck.photos = [];
  const hasPhotos = truck.photos.length > 0;
  
  const newPhotos: TruckPhoto[] = files.map((file, index) => ({
    id: `PH-${Date.now()}-${index}`,
    url: URL.createObjectURL(file),
    isPrimary: !hasPhotos && index === 0,
    sortOrder: (truck.photos?.length || 0) + index,
    createdAt: new Date().toISOString()
  }));
  
  truck.photos.push(...newPhotos);
  truck.updatedAt = new Date().toISOString();
  return truck.photos;
};

export const removeTruckPhoto = (truckId: string, photoId: string): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  if (!truck || !truck.photos) return [];
  
  const removedPhoto = truck.photos.find(p => p.id === photoId);
  truck.photos = truck.photos.filter(p => p.id !== photoId);
  
  // If we removed the primary, make the first remaining photo primary
  if (removedPhoto?.isPrimary && truck.photos.length > 0) {
    truck.photos[0].isPrimary = true;
  }
  
  // Re-index sort order
  truck.photos.forEach((p, i) => { p.sortOrder = i; });
  truck.updatedAt = new Date().toISOString();
  return truck.photos;
};

export const setPrimaryTruckPhoto = (truckId: string, photoId: string): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  if (!truck || !truck.photos) return [];
  
  truck.photos.forEach(p => { p.isPrimary = p.id === photoId; });
  
  // Move primary to front
  const primary = truck.photos.find(p => p.isPrimary);
  if (primary) {
    truck.photos = [primary, ...truck.photos.filter(p => !p.isPrimary)];
    truck.photos.forEach((p, i) => { p.sortOrder = i; });
  }
  
  truck.updatedAt = new Date().toISOString();
  return truck.photos;
};

export const reorderTruckPhotos = (truckId: string, orderedPhotoIds: string[]): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  if (!truck || !truck.photos) return [];
  
  const reordered: TruckPhoto[] = [];
  orderedPhotoIds.forEach((id, i) => {
    const photo = truck.photos?.find(p => p.id === id);
    if (photo) {
      photo.sortOrder = i;
      reordered.push(photo);
    }
  });
  
  truck.photos = reordered;
  truck.updatedAt = new Date().toISOString();
  return truck.photos;
};

export const movePhotoLeft = (truckId: string, photoId: string): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  if (!truck || !truck.photos) return [];
  
  const sorted = [...truck.photos].sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sorted.findIndex(p => p.id === photoId);
  if (idx <= 0) return truck.photos;
  
  // Swap
  [sorted[idx - 1], sorted[idx]] = [sorted[idx], sorted[idx - 1]];
  sorted.forEach((p, i) => { p.sortOrder = i; });
  
  // Update primary: first photo is always primary
  sorted.forEach((p, i) => { p.isPrimary = i === 0; });
  
  truck.photos = sorted;
  truck.updatedAt = new Date().toISOString();
  return truck.photos;
};

export const movePhotoRight = (truckId: string, photoId: string): TruckPhoto[] => {
  const truck = trucks.find(t => t.id === truckId);
  if (!truck || !truck.photos) return [];
  
  const sorted = [...truck.photos].sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sorted.findIndex(p => p.id === photoId);
  if (idx < 0 || idx >= sorted.length - 1) return truck.photos;
  
  // Swap
  [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]];
  sorted.forEach((p, i) => { p.sortOrder = i; });
  
  // Update primary: first photo is always primary
  sorted.forEach((p, i) => { p.isPrimary = i === 0; });
  
  truck.photos = sorted;
  truck.updatedAt = new Date().toISOString();
  return truck.photos;
};
