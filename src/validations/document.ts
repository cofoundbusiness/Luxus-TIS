import { z } from 'zod';
import { DocumentStatus, EntityType } from '../types/enums';

export const documentSchema = z.object({
  id: z.string().optional(),
  entityType: z.nativeEnum(EntityType, {
    errorMap: () => ({ message: 'Invalid entity type' })
  } as any),
  entityId: z.string().min(1, 'Entity ID is required'),
  documentType: z.string().min(2, 'Document type is required'),
  name: z.string().min(3, 'Document name must be at least 3 characters'),
  fileUrl: z.string().optional(),
  status: z.nativeEnum(DocumentStatus, {
    errorMap: () => ({ message: 'Invalid document status' })
  } as any),
  uploadedAt: z.string().optional(),
});
