// Re-export all validation schemas and types
export * from './auth';
export * from './profile';
export * from './library';
export * from './subscription';
export * from './download';
export * from './stripe';

// Common validation utilities
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  filters: z.record(z.string(), z.any()).optional(),
});

export const responseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

export const paginatedResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortOrder = z.infer<typeof sortOrderSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type Response<T> = z.infer<ReturnType<typeof responseSchema<T>>>;
export type PaginatedResponse<T> = z.infer<
  ReturnType<typeof paginatedResponseSchema<T>>
>;
