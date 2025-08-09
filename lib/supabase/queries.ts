import { createClient } from './server';
import type { LibraryFilterInput } from '@/lib/validations';
import type { Database } from '@/types/supabase';

type LibraryWithAuthor = Database['public']['Tables']['libraries']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null;
};

/**
 * Get paginated libraries with filters
 */
export async function getLibraries(filters: LibraryFilterInput) {
  const supabase = createClient();

  let query = supabase
    .from('libraries')
    .select(
      `
      *,
      profiles (
        full_name,
        username,
        avatar_url
      )
    `,
      { count: 'exact' }
    )
    .eq('published', true);

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.tier) {
    query = query.eq('tier_required', filters.tier);
  }

  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }

  if (filters.author) {
    query = query.eq('author_id', filters.author);
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      query = query.order('published_at', {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case 'oldest':
      query = query.order('published_at', {
        ascending: true,
        nullsFirst: false,
      });
      break;
    case 'popular':
      query = query.order('download_count', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const offset = (filters.page - 1) * filters.limit;
  query = query.range(offset, offset + filters.limit - 1);

  const { data: libraries, count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch libraries: ${error.message}`);
  }

  return {
    libraries: libraries as LibraryWithAuthor[],
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / filters.limit),
      hasNext: offset + filters.limit < (count || 0),
      hasPrev: filters.page > 1,
    },
  };
}

/**
 * Get a single library by slug with author info
 */
export async function getLibraryBySlug(slug: string) {
  const supabase = createClient();

  const { data: library, error } = await supabase
    .from('libraries')
    .select(
      `
      *,
      profiles (
        full_name,
        username,
        avatar_url,
        bio
      )
    `
    )
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    return null;
  }

  return library as LibraryWithAuthor;
}

/**
 * Get featured libraries for homepage
 */
export async function getFeaturedLibraries(limit = 6) {
  const supabase = createClient();

  const { data: libraries, error } = await supabase
    .from('libraries')
    .select(
      `
      *,
      profiles (
        full_name,
        username,
        avatar_url
      )
    `
    )
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch featured libraries: ${error.message}`);
  }

  return libraries as LibraryWithAuthor[];
}

/**
 * Get popular libraries
 */
export async function getPopularLibraries(limit = 10) {
  const supabase = createClient();

  const { data: libraries, error } = await supabase
    .from('libraries')
    .select(
      `
      *,
      profiles (
        full_name,
        username,
        avatar_url
      )
    `
    )
    .eq('published', true)
    .order('download_count', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch popular libraries: ${error.message}`);
  }

  return libraries as LibraryWithAuthor[];
}

/**
 * Get user's downloaded libraries
 */
export async function getUserDownloads(userId: string, page = 1, limit = 20) {
  const supabase = createClient();

  const offset = (page - 1) * limit;

  const {
    data: downloads,
    count,
    error,
  } = await supabase
    .from('downloads')
    .select(
      `
      *,
      libraries (
        *,
        profiles (
          full_name,
          username,
          avatar_url
        )
      )
    `,
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order('downloaded_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch user downloads: ${error.message}`);
  }

  return {
    downloads: downloads || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      hasNext: offset + limit < (count || 0),
      hasPrev: page > 1,
    },
  };
}

/**
 * Get library ratings
 */
export async function getLibraryRatings(
  libraryId: string,
  page = 1,
  limit = 20
) {
  const supabase = createClient();

  const offset = (page - 1) * limit;

  const {
    data: ratings,
    count,
    error,
  } = await supabase
    .from('library_ratings')
    .select(
      `
      *,
      profiles (
        full_name,
        username,
        avatar_url
      )
    `,
      { count: 'exact' }
    )
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch library ratings: ${error.message}`);
  }

  return {
    ratings: ratings || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      hasNext: offset + limit < (count || 0),
      hasPrev: page > 1,
    },
  };
}

/**
 * Get user's rating for a specific library
 */
export async function getUserLibraryRating(userId: string, libraryId: string) {
  const supabase = createClient();

  const { data: rating, error } = await supabase
    .from('library_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('library_id', libraryId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found"
    throw new Error(`Failed to fetch user rating: ${error.message}`);
  }

  return rating;
}

/**
 * Get library categories with counts
 */
export async function getLibraryCategories() {
  const supabase = createClient();

  const { data: categories, error } = await supabase
    .from('libraries')
    .select('category')
    .eq('published', true);

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  // Count categories
  const categoryCounts = categories.reduce(
    (acc, { category }) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return categoryCounts;
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
  const supabase = createClient();

  const [
    { count: totalUsers },
    { count: totalLibraries },
    { count: publishedLibraries },
    { count: totalDownloads },
    { count: activeSubscriptions },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('libraries').select('*', { count: 'exact', head: true }),
    supabase
      .from('libraries')
      .select('*', { count: 'exact', head: true })
      .eq('published', true),
    supabase.from('downloads').select('*', { count: 'exact', head: true }),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
  ]);

  // Get revenue estimate (active subscriptions)
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('status', 'active');

  const tierPricing = { basic: 9.95, pro: 19.95, enterprise: 39.95 };
  const monthlyRevenue =
    subscriptions?.reduce((total, sub) => {
      return total + tierPricing[sub.tier];
    }, 0) || 0;

  return {
    totalUsers: totalUsers || 0,
    totalLibraries: totalLibraries || 0,
    publishedLibraries: publishedLibraries || 0,
    totalDownloads: totalDownloads || 0,
    activeSubscriptions: activeSubscriptions || 0,
    monthlyRevenue,
  };
}
