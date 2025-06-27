import { NextResponse } from 'next/server';
import { TursoService } from '@/lib/turso-service';

export async function GET() {
  try {
    // Get statistics from Turso
    const stats = await TursoService.getStatistics();
    const meta = await TursoService.getMeta();

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        meta
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 