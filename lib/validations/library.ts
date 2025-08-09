import { z } from 'zod';

export const libraryCategories = [
  'data_processing',
  'automation',
  'analysis',
  'integration',
  'communication',
  'utilities',
  'other',
] as const;

export const subscriptionTiers = ['basic', 'pro', 'enterprise'] as const;

export const librarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  long_description: z.string().nullable(),
  category: z.enum(libraryCategories),
  tier_required: z.enum(subscriptionTiers),
  version: z.string(),
  download_url: z.string().url(),
  file_size: z.number().int().positive().nullable(),
  tags: z.array(z.string()).default([]),
  author_id: z.string().uuid().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  download_count: z.number().int().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  rating_count: z.number().int().min(0).default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  published_at: z.string().datetime().nullable(),
});

export const createLibrarySchema = z.object({
  name: z
    .string()
    .min(1, 'Library name is required')
    .max(100, 'Library name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  long_description: z
    .string()
    .max(2000, 'Long description must be less than 2000 characters')
    .optional(),
  category: z.enum(libraryCategories, {
    message: 'Please select a category',
  }),
  tier_required: z.enum(subscriptionTiers, {
    message: 'Please select a tier',
  }),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format x.y.z (e.g., 1.0.0)'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
});

export const updateLibrarySchema = createLibrarySchema.extend({
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const libraryUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select a file to upload' })
    .refine(
      file => file.size <= 50 * 1024 * 1024, // 50MB
      'File size must be less than 50MB'
    )
    .refine(
      file => file.type === 'application/zip' || file.name.endsWith('.zip'),
      'File must be a ZIP archive'
    ),
});

export const libraryFilterSchema = z.object({
  category: z.enum(libraryCategories).optional(),
  tier: z.enum(subscriptionTiers).optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  author: z.string().uuid().optional(),
  sort: z
    .enum(['newest', 'oldest', 'popular', 'rating', 'name'])
    .default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const libraryRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z
    .string()
    .max(1000, 'Review must be less than 1000 characters')
    .optional(),
});

export type Library = z.infer<typeof librarySchema>;
export type CreateLibraryInput = z.infer<typeof createLibrarySchema>;
export type UpdateLibraryInput = z.infer<typeof updateLibrarySchema>;
export type LibraryUploadInput = z.infer<typeof libraryUploadSchema>;
export type LibraryFilterInput = z.infer<typeof libraryFilterSchema>;
export type LibraryRatingInput = z.infer<typeof libraryRatingSchema>;
export type LibraryCategory = (typeof libraryCategories)[number];
export type SubscriptionTier = (typeof subscriptionTiers)[number];
