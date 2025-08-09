import { z } from 'zod';

export const downloadSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  library_id: z.string().uuid(),
  downloaded_at: z.string().datetime(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
});

export const createDownloadSchema = z.object({
  library_id: z.string().uuid('Invalid library ID'),
});

export const downloadStatsSchema = z.object({
  total_downloads: z.number().int().min(0),
  downloads_this_month: z.number().int().min(0),
  downloads_today: z.number().int().min(0),
  popular_libraries: z.array(
    z.object({
      library_id: z.string().uuid(),
      library_name: z.string(),
      download_count: z.number().int().min(0),
    })
  ),
  recent_downloads: z.array(
    z.object({
      library_id: z.string().uuid(),
      library_name: z.string(),
      downloaded_at: z.string().datetime(),
    })
  ),
});

export const downloadFilterSchema = z.object({
  user_id: z.string().uuid().optional(),
  library_id: z.string().uuid().optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type Download = z.infer<typeof downloadSchema>;
export type CreateDownloadInput = z.infer<typeof createDownloadSchema>;
export type DownloadStats = z.infer<typeof downloadStatsSchema>;
export type DownloadFilterInput = z.infer<typeof downloadFilterSchema>;
