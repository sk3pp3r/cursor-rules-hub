import { NextRequest, NextResponse } from 'next/server';
import { TursoService } from '@/lib/turso-service';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const SORT_FIELDS = ['name', 'rating', 'created_at', 'downloads'] as const;

function clampInt(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = parseInt(value ?? '', 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limit = clampInt(searchParams.get('limit'), 50, 1, 1000);
    const offset = clampInt(searchParams.get('offset'), 0, 0, Number.MAX_SAFE_INTEGER);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const author = searchParams.get('author') || undefined;
    const sortByParam = searchParams.get('sortBy');
    const sortBy = SORT_FIELDS.find(field => field === sortByParam) ?? 'rating';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

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
        error: 'Failed to fetch rules'
      },
      { status: 500 }
    );
  }
} 