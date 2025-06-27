import { tursoClient } from './turso';

export interface CursorRule {
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

export interface DatabaseMeta {
  version: string;
  total_rules: number;
  last_updated: string;
  sources: string[];
}

export class TursoService {
  // Get all cursor rules with optional filtering
  static async getAllRules(options?: {
    limit?: number;
    offset?: number;
    search?: string;
    category?: string;
    author?: string;
    sortBy?: 'name' | 'rating' | 'created_at' | 'downloads';
    sortOrder?: 'asc' | 'desc';
  }): Promise<CursorRule[]> {
    const {
      limit = 50,
      offset = 0,
      search,
      category,
      author,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = options || {};

    let sql = 'SELECT * FROM cursor_rules WHERE 1=1';
    const args: any[] = [];

    // Add search filter
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR content LIKE ?)';
      const searchPattern = `%${search}%`;
      args.push(searchPattern, searchPattern, searchPattern);
    }

    // Add category filter
    if (category) {
      sql += ' AND categories LIKE ?';
      args.push(`%"${category}"%`);
    }

    // Add author filter
    if (author) {
      sql += ' AND author = ?';
      args.push(author);
    }

    // Add sorting
    sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Add pagination
    sql += ' LIMIT ? OFFSET ?';
    args.push(limit, offset);

    const result = await tursoClient.execute({ sql, args });
    
    return result.rows.map(row => this.mapRowToRule(row));
  }

  // Get a single rule by ID
  static async getRuleById(id: string): Promise<CursorRule | null> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM cursor_rules WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRule(result.rows[0]);
  }

  // Get a single rule by slug
  static async getRuleBySlug(slug: string): Promise<CursorRule | null> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM cursor_rules WHERE slug = ?',
      args: [slug]
    });

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRule(result.rows[0]);
  }

  // Get rules by category
  static async getRulesByCategory(category: string, limit: number = 20): Promise<CursorRule[]> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM cursor_rules WHERE categories LIKE ? ORDER BY rating DESC LIMIT ?',
      args: [`%"${category}"%`, limit]
    });

    return result.rows.map(row => this.mapRowToRule(row));
  }

  // Get popular rules (by rating/downloads)
  static async getPopularRules(limit: number = 10): Promise<CursorRule[]> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM cursor_rules WHERE rating > 0 ORDER BY rating DESC, downloads DESC LIMIT ?',
      args: [limit]
    });

    return result.rows.map(row => this.mapRowToRule(row));
  }

  // Get recent rules
  static async getRecentRules(limit: number = 10): Promise<CursorRule[]> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM cursor_rules ORDER BY created_at DESC LIMIT ?',
      args: [limit]
    });

    return result.rows.map(row => this.mapRowToRule(row));
  }

  // Get rules by author
  static async getRulesByAuthor(author: string, limit: number = 20): Promise<CursorRule[]> {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM cursor_rules WHERE author = ? ORDER BY rating DESC LIMIT ?',
      args: [author, limit]
    });

    return result.rows.map(row => this.mapRowToRule(row));
  }

  // Search rules with full-text search capabilities
  static async searchRules(query: string, limit: number = 50): Promise<CursorRule[]> {
    const searchPattern = `%${query}%`;
    const result = await tursoClient.execute({
      sql: `
        SELECT * FROM cursor_rules 
        WHERE name LIKE ? OR description LIKE ? OR content LIKE ? OR author LIKE ?
        ORDER BY 
          CASE 
            WHEN name LIKE ? THEN 1
            WHEN description LIKE ? THEN 2
            WHEN author LIKE ? THEN 3
            ELSE 4
          END,
          rating DESC
        LIMIT ?
      `,
      args: [
        searchPattern, searchPattern, searchPattern, searchPattern,
        searchPattern, searchPattern, searchPattern, limit
      ]
    });

    return result.rows.map(row => this.mapRowToRule(row));
  }

  // Get all categories
  static async getAllCategories(): Promise<string[]> {
    const result = await tursoClient.execute(
      'SELECT DISTINCT categories FROM cursor_rules WHERE categories IS NOT NULL AND categories != ""'
    );

    const allCategories = new Set<string>();
    
    result.rows.forEach(row => {
      try {
        const categories = JSON.parse(row.categories as string) as string[];
        categories.forEach(cat => allCategories.add(cat));
      } catch (e) {
        // Ignore invalid JSON
      }
    });

    return Array.from(allCategories).sort();
  }

  // Get all authors
  static async getAllAuthors(): Promise<string[]> {
    const result = await tursoClient.execute(
      'SELECT DISTINCT author FROM cursor_rules WHERE author IS NOT NULL AND author != "" ORDER BY author'
    );

    return result.rows.map(row => row.author as string);
  }

  // Get database meta information
  static async getMeta(): Promise<DatabaseMeta | null> {
    const result = await tursoClient.execute('SELECT * FROM meta WHERE id = 1');

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      version: row.version as string,
      total_rules: row.total_rules as number,
      last_updated: row.last_updated as string,
      sources: JSON.parse(row.sources as string)
    };
  }

  // Get statistics
  static async getStatistics(): Promise<{
    totalRules: number;
    totalAuthors: number;
    averageRating: number;
    topCategories: { category: string; count: number }[];
  }> {
    const statsResult = await tursoClient.execute(`
      SELECT 
        COUNT(*) as total_rules,
        COUNT(DISTINCT author) as total_authors,
        AVG(rating) as avg_rating
      FROM cursor_rules
    `);

    const stats = statsResult.rows[0];

    // Get top categories
    const categoriesResult = await tursoClient.execute(
      'SELECT categories FROM cursor_rules WHERE categories IS NOT NULL AND categories != ""'
    );

    const categoryCount = new Map<string, number>();
    
    categoriesResult.rows.forEach(row => {
      try {
        const categories = JSON.parse(row.categories as string) as string[];
        categories.forEach(cat => {
          categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
        });
      } catch (e) {
        // Ignore invalid JSON
      }
    });

    const topCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRules: stats.total_rules as number,
      totalAuthors: stats.total_authors as number,
      averageRating: Number(stats.avg_rating) || 0,
      topCategories
    };
  }

  // Update rule download count
  static async incrementDownloadCount(id: string): Promise<void> {
    await tursoClient.execute({
      sql: 'UPDATE cursor_rules SET downloads = downloads + 1 WHERE id = ?',
      args: [id]
    });
  }

  // Helper method to map database row to CursorRule object
  private static mapRowToRule(row: any): CursorRule {
    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      description: row.description as string || '',
      content: row.content as string,
      author: row.author as string || '',
      source_repo: row.source_repo as string || '',
      categories: this.parseJsonField(row.categories as string, []),
      tags: this.parseJsonField(row.tags as string, []),
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      rating: Number(row.rating) || 0,
      downloads: Number(row.downloads) || 0,
      favorites: Number(row.favorites) || 0,
      file_size: Number(row.file_size) || 0,
      language_support: this.parseJsonField(row.language_support as string, []),
    };
  }

  // Helper method to safely parse JSON fields
  private static parseJsonField<T>(value: string | null | undefined, defaultValue: T): T {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }
} 