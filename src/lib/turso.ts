import { createClient } from '@libsql/client';

export const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

// Database schema for cursor rules
export const initializeDatabase = async () => {
  // Create meta table
  await tursoClient.execute(`
    CREATE TABLE IF NOT EXISTS meta (
      id INTEGER PRIMARY KEY,
      version TEXT NOT NULL,
      total_rules INTEGER NOT NULL,
      last_updated TEXT NOT NULL,
      sources TEXT NOT NULL
    )
  `);

  // Create cursor_rules table
  await tursoClient.execute(`
    CREATE TABLE IF NOT EXISTS cursor_rules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      content TEXT NOT NULL,
      author TEXT,
      source_repo TEXT,
      categories TEXT, -- JSON array as text
      tags TEXT, -- JSON array as text
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      rating REAL DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      favorites INTEGER DEFAULT 0,
      file_size INTEGER DEFAULT 0,
      language_support TEXT -- JSON array as text
    )
  `);

  // Create indexes for better performance
  await tursoClient.execute(`
    CREATE INDEX IF NOT EXISTS idx_cursor_rules_slug ON cursor_rules(slug)
  `);
  
  await tursoClient.execute(`
    CREATE INDEX IF NOT EXISTS idx_cursor_rules_author ON cursor_rules(author)
  `);
  
  await tursoClient.execute(`
    CREATE INDEX IF NOT EXISTS idx_cursor_rules_source ON cursor_rules(source_repo)
  `);
  
  await tursoClient.execute(`
    CREATE INDEX IF NOT EXISTS idx_cursor_rules_rating ON cursor_rules(rating)
  `);

  console.log('Database initialized successfully!');
}; 