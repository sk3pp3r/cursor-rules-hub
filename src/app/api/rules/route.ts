import { NextRequest, NextResponse } from 'next/server';
import { TursoService } from '@/lib/turso-service';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const author = searchParams.get('author') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'name' | 'rating' | 'created_at' | 'downloads') || 'rating';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    // Get rules from Turso
    const rules = await TursoService.getAllRules({
      limit,
      offset,
      search,
      category,
      author,
      sortBy,
      sortOrder
    });

    // Get meta information
    const meta = await TursoService.getMeta();

    return NextResponse.json({
      success: true,
      data: {
        rules,
        meta,
        pagination: {
          limit,
          offset,
          count: rules.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch rules',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 