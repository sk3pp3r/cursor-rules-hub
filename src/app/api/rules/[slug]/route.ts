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
          error: 'Rule not found',
          message: `No rule found with slug: ${slug}`
        },
        { status: 404 }
      );
    }

    // Increment download count
    await TursoService.incrementDownloadCount(rule.id);

    return NextResponse.json({
      success: true,
      data: {
        rule: {
          ...rule,
          downloads: rule.downloads + 1 // Reflect the increment
        }
      }
    });

  } catch (error) {
    console.error('Error fetching rule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch rule',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 