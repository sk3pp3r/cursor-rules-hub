#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { join } from 'path';
import { tursoClient, initializeDatabase } from '../src/lib/turso';

interface DatabaseMeta {
  version: string;
  total_rules: number;
  last_updated: string;
  sources: string[];
}

interface CursorRule {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content: string;
  author?: string;
  source_repo?: string;
  categories: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  rating: number;
  downloads: number;
  favorites: number;
  file_size: number;
  language_support: string[];
}

interface DatabaseContent {
  meta: DatabaseMeta;
  rules: CursorRule[];
}

function makeSlugUnique(slug: string, existingSlugs: Set<string>): string {
  if (!existingSlugs.has(slug)) {
    return slug;
  }

  let counter = 2;
  let uniqueSlug = `${slug}-${counter}`;
  
  while (existingSlugs.has(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
  
  return uniqueSlug;
}

async function migrateDataFixed() {
  console.log('🚀 Starting FIXED migration from JSON to Turso...');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await tursoClient.execute('SELECT 1');
    console.log('✅ Database connection successful!');

    // Clear existing data for fresh migration
    console.log('🧹 Clearing existing data...');
    await tursoClient.execute('DELETE FROM cursor_rules');
    await tursoClient.execute('DELETE FROM meta');

    // Initialize database schema
    console.log('🏗️ Initializing database schema...');
    await initializeDatabase();

    // Read JSON data
    console.log('📖 Reading JSON database...');
    const jsonPath = join(process.cwd(), 'src/data/cursor_rules_database.json');
    const jsonData: DatabaseContent = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    console.log(`📊 Found ${jsonData.rules.length} rules to migrate`);

    // Process rules to handle duplicate slugs
    console.log('🔧 Processing duplicate slugs...');
    const processedRules: CursorRule[] = [];
    const usedSlugs = new Set<string>();
    const slugUpdates: { oldSlug: string; newSlug: string; id: string }[] = [];

    for (const rule of jsonData.rules) {
      const uniqueSlug = makeSlugUnique(rule.slug, usedSlugs);
      
      if (uniqueSlug !== rule.slug) {
        slugUpdates.push({
          oldSlug: rule.slug,
          newSlug: uniqueSlug,
          id: rule.id
        });
      }

      processedRules.push({
        ...rule,
        slug: uniqueSlug
      });
      
      usedSlugs.add(uniqueSlug);
    }

    console.log(`🔗 Made ${slugUpdates.length} slugs unique`);
    if (slugUpdates.length > 0) {
      console.log('Sample slug updates:');
      slugUpdates.slice(0, 5).forEach(update => {
        console.log(`   ${update.oldSlug} → ${update.newSlug} (ID: ${update.id})`);
      });
    }

    // Insert meta data
    console.log('💽 Inserting meta data...');
    await tursoClient.execute({
      sql: `INSERT OR REPLACE INTO meta (id, version, total_rules, last_updated, sources) 
            VALUES (1, ?, ?, ?, ?)`,
      args: [
        jsonData.meta.version,
        processedRules.length, // Use processed count
        jsonData.meta.last_updated,
        JSON.stringify(jsonData.meta.sources)
      ]
    });

    // Insert rules in batches
    console.log('📝 Migrating cursor rules...');
    const batchSize = 50;
    let migratedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < processedRules.length; i += batchSize) {
      const batch = processedRules.slice(i, i + batchSize);
      
      for (const rule of batch) {
        try {
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
              rule.description || '',
              rule.content,
              rule.author || '',
              rule.source_repo || '',
              JSON.stringify(rule.categories || []),
              JSON.stringify(rule.tags || []),
              rule.created_at,
              rule.updated_at,
              rule.rating || 0,
              rule.downloads || 0,
              rule.favorites || 0,
              rule.file_size || 0,
              JSON.stringify(rule.language_support || [])
            ]
          });
          migratedCount++;
        } catch (error) {
          console.error(`❌ Error migrating rule ${rule.id}: ${error}`);
          errorCount++;
        }
      }

      console.log(`⏳ Migrated ${Math.min(i + batchSize, processedRules.length)} / ${processedRules.length} rules`);
    }

    // Verify migration
    console.log('🔍 Verifying migration...');
    const countResult = await tursoClient.execute('SELECT COUNT(*) as count FROM cursor_rules');
    const dbCount = countResult.rows[0].count as number;
    
    console.log(`📊 Migration Summary:`);
    console.log(`   • Original JSON rules: ${jsonData.rules.length}`);
    console.log(`   • Processed rules: ${processedRules.length}`);
    console.log(`   • Successfully migrated: ${migratedCount}`);
    console.log(`   • Errors: ${errorCount}`);
    console.log(`   • Database rules: ${dbCount}`);
    console.log(`   • Slug conflicts resolved: ${slugUpdates.length}`);
    
    if (dbCount === processedRules.length) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️ Migration may have issues - counts don\'t match');
    }

    // Show sample data
    console.log('🔍 Sample of migrated data:');
    const sampleResult = await tursoClient.execute('SELECT id, name, author, rating FROM cursor_rules LIMIT 5');
    sampleResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.name} by ${row.author} (rating: ${row.rating})`);
    });

    // Show statistics
    console.log('📈 Database statistics:');
    const statsResult = await tursoClient.execute(`
      SELECT 
        COUNT(*) as total_rules,
        COUNT(DISTINCT author) as unique_authors,
        AVG(rating) as avg_rating,
        COUNT(CASE WHEN rating > 0 THEN 1 END) as rated_rules
      FROM cursor_rules
    `);
    
    const stats = statsResult.rows[0];
    console.log(`   • Total rules: ${stats.total_rules}`);
    console.log(`   • Unique authors: ${stats.unique_authors}`);
    console.log(`   • Average rating: ${Number(stats.avg_rating).toFixed(2)}`);
    console.log(`   • Rated rules: ${stats.rated_rules}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDataFixed()
    .then(() => {
      console.log('🎉 Migration process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

export { migrateDataFixed }; 