import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const DATABASE_PATH = path.join(process.cwd(), 'src/data/cursor_rules_database.json');

interface Database {
  meta: {
    version: string;
    total_rules: number;
    last_updated: string;
    sources: string[];
  };
  rules: any[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceFilter = searchParams.get('source');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Load database
    const data = await fs.readFile(DATABASE_PATH, 'utf-8');
    const database: Database = JSON.parse(data);

    let rules = database.rules;

    // Filter by source if specified
    if (sourceFilter) {
      rules = rules.filter(rule => rule.source_repo === sourceFilter);
    }

    // Apply pagination
    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;
    const paginatedRules = rules.slice(offsetNum, offsetNum + limitNum);

    return NextResponse.json({
      success: true,
      data: {
        rules: paginatedRules,
        meta: {
          ...database.meta,
          filtered_count: rules.length,
          returned_count: paginatedRules.length,
          offset: offsetNum,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    );
  }
} 