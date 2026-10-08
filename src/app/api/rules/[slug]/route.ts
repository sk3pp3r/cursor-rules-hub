import { NextRequest, NextResponse } from 'next/server';
import { TursoService } from '@/lib/turso-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get rule from Turso
    const rule = await TursoService.getRuleBySlug(slug);

    if (!rule) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rule not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        rule
      }
    });

  } catch (error) {
    console.error('Error fetching rule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch rule'
      },
      { status: 500 }
    );
  }
}

// Track a download. Viewing a rule (GET) must not count as a download.
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const rule = await TursoService.getRuleBySlug(params.slug);

    if (!rule) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    await TursoService.incrementDownloadCount(rule.id);

    return NextResponse.json({
      success: true,
      data: { downloads: rule.downloads + 1 }
    });

  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
