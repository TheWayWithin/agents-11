import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { canAccessLibrary } from '@/lib/supabase/auth-helpers';
import { z } from 'zod';

const downloadParamsSchema = z.object({
  libraryId: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { libraryId: string } }
) {
  try {
    // Validate parameters
    const { libraryId } = downloadParamsSchema.parse(params);

    // Get authenticated user
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user can access this library
    const hasAccess = await canAccessLibrary(libraryId);
    if (!hasAccess) {
      return NextResponse.json(
        {
          error:
            'Access denied. Upgrade your subscription to access this library.',
        },
        { status: 403 }
      );
    }

    // Get library information
    const { data: library, error: libraryError } = await supabase
      .from('libraries')
      .select('*')
      .eq('id', libraryId)
      .eq('published', true)
      .single();

    if (libraryError || !library) {
      return NextResponse.json({ error: 'Library not found' }, { status: 404 });
    }

    // Record the download
    const { error: downloadError } = await supabase.from('downloads').insert({
      user_id: user.id,
      library_id: libraryId,
      ip_address:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    if (downloadError) {
      console.error('Failed to record download:', downloadError);
      // Continue with download even if recording fails
    }

    // In a real implementation, you would:
    // 1. Generate a secure, temporary download URL (e.g., signed S3 URL)
    // 2. Or stream the file directly through this API
    // For now, we'll return a mock download URL

    // Mock implementation - in production, use actual file storage
    const mockDownloadData = {
      'agent-11': {
        filename: 'agent-11-v2.1.0.zip',
        url: '/downloads/agent-11-v2.1.0.zip', // This would be a signed URL in production
        size: 45.2 * 1024 * 1024, // 45.2 MB in bytes
      },
      'empire-11': {
        filename: 'empire-11-v1.3.0.zip',
        url: '/downloads/empire-11-v1.3.0.zip', // This would be a signed URL in production
        size: 127.8 * 1024 * 1024, // 127.8 MB in bytes
      },
    };

    const downloadData =
      mockDownloadData[library.slug as keyof typeof mockDownloadData];

    if (!downloadData) {
      return NextResponse.json(
        { error: 'Download not available' },
        { status: 404 }
      );
    }

    // Update download count
    await supabase
      .from('libraries')
      .update({
        download_count: library.download_count + 1,
      })
      .eq('id', libraryId);

    return NextResponse.json({
      download_url: downloadData.url,
      filename: downloadData.filename,
      size: downloadData.size,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
    });
  } catch (error) {
    console.error('Download failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Download failed. Please try again.' },
      { status: 500 }
    );
  }
}
