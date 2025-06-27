import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { RuleSubmission, Rule } from '@/types/rule';
import { generateId, generateSlug } from '@/lib/utils';
import { TursoService } from '@/lib/turso-service';
import { tursoClient } from '@/lib/turso';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to submit a rule.' },
        { status: 401 }
      );
    }

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

    // Generate rule data with authenticated user information
    const now = new Date().toISOString();
    const ruleId = generateId();
    const baseSlug = generateSlug(submission.name);
    
    // Check if slug already exists and make it unique if needed
    let uniqueSlug = baseSlug;
    let counter = 2;
    
    while (await TursoService.getRuleBySlug(uniqueSlug) !== null) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const rule = {
      id: ruleId,
      name: submission.name.trim(),
      slug: uniqueSlug,
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
      language_support: extractLanguageSupport(submission.content, submission.tags),
    };

    // Insert the new rule into Turso database
    await tursoClient.execute({
      sql: `INSERT INTO cursor_rules (
        id, name, slug, description, content, author, source_repo, 
        categories, tags, created_at, updated_at, rating, downloads, 
        favorites, file_size, language_support
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        rule.id,
        rule.name,
        rule.slug,
        rule.description,
        rule.content,
        rule.author,
        rule.source_repo,
        JSON.stringify(rule.categories),
        JSON.stringify(rule.tags),
        rule.created_at,
        rule.updated_at,
        rule.rating,
        rule.downloads,
        rule.favorites,
        rule.file_size,
        JSON.stringify(rule.language_support)
      ]
    });

    // Update meta information
    const currentMeta = await TursoService.getMeta();
    if (currentMeta) {
      const newTotalRules = currentMeta.total_rules + 1;
      const sources = currentMeta.sources.includes('community-submission') 
        ? currentMeta.sources 
        : [...currentMeta.sources, 'community-submission'];

      await tursoClient.execute({
        sql: `UPDATE meta SET total_rules = ?, last_updated = ?, sources = ? WHERE id = 1`,
        args: [newTotalRules, now, JSON.stringify(sources)]
      });
    }

    console.log('Rule submission saved to Turso database:', {
      id: rule.id,
      name: rule.name,
      slug: rule.slug,
      author: rule.author,
      github_user: session.user.githubUsername,
      category: submission.category,
      tags: rule.tags,
      content_length: rule.content.length,
      usage_examples: submission.usage_examples || 'None provided',
      prerequisites: submission.prerequisites || 'None provided',
      compatibility_notes: submission.compatibility_notes || 'None provided',
      external_links: submission.external_links || [],
      submitted_by: {
        user_id: session.user.githubId,
        username: session.user.githubUsername,
        email: session.user.email,
        name: session.user.name
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Rule submitted successfully! It is now available in the rules database.',
      rule: {
        id: rule.id,
        name: rule.name,
        slug: rule.slug,
        author: rule.author,
        category: submission.category,
        github_user: session.user.githubUsername
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing rule submission:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
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
  if (contentLower.includes('node.js') || contentLower.includes('nodejs')) languages.add('Node.js');
  if (contentLower.includes('java') && !contentLower.includes('javascript')) languages.add('Java');
  if (contentLower.includes('golang') || contentLower.includes(' go ')) languages.add('Go');
  if (contentLower.includes('rust')) languages.add('Rust');
  if (contentLower.includes('php')) languages.add('PHP');
  if (contentLower.includes('c++') || contentLower.includes('cpp')) languages.add('C++');
  if (contentLower.includes('c#') || contentLower.includes('csharp')) languages.add('C#');
  if (contentLower.includes('swift')) languages.add('Swift');
  if (contentLower.includes('kotlin')) languages.add('Kotlin');

  return Array.from(languages);
} 