import { NextRequest, NextResponse } from 'next/server';
import { RuleSubmission, Rule } from '@/types/rule';
import { generateId, generateSlug } from '@/lib/utils';
import fs from 'fs/promises';
import path from 'path';

// Database file path
const DATABASE_PATH = path.join(process.cwd(), 'src/data/cursor_rules_database.json');

interface Database {
  meta: {
    version: string;
    total_rules: number;
    last_updated: string;
    sources: string[];
  };
  rules: Rule[];
}

async function loadDatabase(): Promise<Database> {
  try {
    const data = await fs.readFile(DATABASE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading database:', error);
    throw new Error('Failed to load database');
  }
}

async function saveDatabase(database: Database): Promise<void> {
  try {
    await fs.writeFile(DATABASE_PATH, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
    throw new Error('Failed to save database');
  }
}

export async function POST(request: NextRequest) {
  try {
    const submission: RuleSubmission = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'description', 'content', 'author', 'tags'];
    const missingFields = requiredFields.filter(field => !submission[field as keyof RuleSubmission]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate minimum lengths
    if (submission.description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters long' },
        { status: 400 }
      );
    }

    if (submission.content.length < 100) {
      return NextResponse.json(
        { error: 'Rule content must be at least 100 characters long' },
        { status: 400 }
      );
    }

    if (submission.tags.length === 0) {
      return NextResponse.json(
        { error: 'At least one tag is required' },
        { status: 400 }
      );
    }

    // Load existing database
    const database = await loadDatabase();

    // Generate rule data
    const now = new Date().toISOString();
    const rule: Rule = {
      id: generateId(),
      name: submission.name.trim(),
      slug: generateSlug(submission.name),
      description: submission.description.trim(),
      content: submission.content.trim(),
      author: submission.author.trim(),
      source_repo: 'community-submission',
      categories: [submission.category],
      tags: submission.tags.map(tag => tag.toLowerCase().trim()),
      created_at: now,
      updated_at: now,
      rating: 0,
      downloads: 0,
      favorites: 0,
      file_size: new Blob([submission.content]).size,
      language_support: extractLanguageSupport(submission.content, submission.tags)
    };

    // Add the new rule to the database
    database.rules.unshift(rule); // Add to beginning of array
    database.meta.total_rules = database.rules.length;
    database.meta.last_updated = now;

    // Add community-submission to sources if not already present
    if (!database.meta.sources.includes('community-submission')) {
      database.meta.sources.push('community-submission');
    }

    // Save the updated database
    await saveDatabase(database);

    console.log('Rule submission saved to database:', {
      id: rule.id,
      name: rule.name,
      author: rule.author,
      category: submission.category,
      tags: rule.tags,
      content_length: rule.content.length,
      usage_examples: submission.usage_examples || 'None provided',
      prerequisites: submission.prerequisites || 'None provided',
      compatibility_notes: submission.compatibility_notes || 'None provided',
      external_links: submission.external_links || []
    });

    return NextResponse.json({
      success: true,
      message: 'Rule submitted successfully! It is now available in the rules database.',
      rule: {
        id: rule.id,
        name: rule.name,
        slug: rule.slug,
        author: rule.author,
        category: submission.category
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing rule submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractLanguageSupport(content: string, tags: string[]): string[] {
  const languages = new Set<string>();
  
  // Extract from tags
  tags.forEach(tag => {
    const languageTag = tag.toLowerCase();
    if (languageTag.includes('typescript') || languageTag.includes('ts')) languages.add('TypeScript');
    if (languageTag.includes('javascript') || languageTag.includes('js')) languages.add('JavaScript');
    if (languageTag.includes('python') || languageTag.includes('py')) languages.add('Python');
    if (languageTag.includes('react')) languages.add('React');
    if (languageTag.includes('vue')) languages.add('Vue');
    if (languageTag.includes('angular')) languages.add('Angular');
    if (languageTag.includes('node')) languages.add('Node.js');
    if (languageTag.includes('java')) languages.add('Java');
    if (languageTag.includes('go') || languageTag.includes('golang')) languages.add('Go');
    if (languageTag.includes('rust')) languages.add('Rust');
    if (languageTag.includes('php')) languages.add('PHP');
    if (languageTag.includes('c++') || languageTag.includes('cpp')) languages.add('C++');
    if (languageTag.includes('c#') || languageTag.includes('csharp')) languages.add('C#');
    if (languageTag.includes('swift')) languages.add('Swift');
    if (languageTag.includes('kotlin')) languages.add('Kotlin');
  });

  // Extract from content (basic keyword detection)
  const contentLower = content.toLowerCase();
  if (contentLower.includes('typescript') || contentLower.includes('.ts')) languages.add('TypeScript');
  if (contentLower.includes('javascript') || contentLower.includes('.js')) languages.add('JavaScript');
  if (contentLower.includes('python') || contentLower.includes('.py')) languages.add('Python');
  if (contentLower.includes('react')) languages.add('React');
  if (contentLower.includes('vue')) languages.add('Vue');
  if (contentLower.includes('angular')) languages.add('Angular');

  return Array.from(languages).length > 0 ? Array.from(languages) : ['General'];
} 