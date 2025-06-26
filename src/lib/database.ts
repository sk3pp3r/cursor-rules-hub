import { Rule, RuleDatabase, SearchFilters } from '@/types/rule';
import Fuse, { FuseResult } from 'fuse.js';
import ruleData from '@/data/cursor_rules_database.json';

export class RuleService {
  private static instance: RuleService;
  private database: RuleDatabase;
  private fuse: Fuse<Rule>;

  private constructor() {
    this.database = ruleData as RuleDatabase;
    
    // Initialize Fuse.js for fuzzy searching
    this.fuse = new Fuse(this.database.rules, {
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'categories', weight: 0.15 },
        { name: 'author', weight: 0.1 },
        { name: 'content', weight: 0.05 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
    });
  }

  public static getInstance(): RuleService {
    if (!RuleService.instance) {
      RuleService.instance = new RuleService();
    }
    return RuleService.instance;
  }

  public getAllRules(): Rule[] {
    return this.database.rules;
  }

  public getRuleById(id: string): Rule | undefined {
    return this.database.rules.find(rule => rule.id === id);
  }

  public getRuleBySlug(slug: string): Rule | undefined {
    return this.database.rules.find(rule => rule.slug === slug);
  }

  public getCategories(): string[] {
    return this.database.categories;
  }

  public getTags(): string[] {
    return this.database.tags;
  }

  public getMeta() {
    return this.database.meta;
  }

  public searchRules(query: string, filters?: SearchFilters): Rule[] {
    let rules = this.database.rules;

    // Apply filters first
    if (filters) {
      rules = this.applyFilters(rules, filters);
    }

    // If no query, return filtered results
    if (!query.trim()) {
      return rules;
    }

    // Create a new Fuse instance with filtered rules for searching
    const filteredFuse = new Fuse(rules, {
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'categories', weight: 0.15 },
        { name: 'author', weight: 0.1 },
        { name: 'content', weight: 0.05 }
      ],
      threshold: 0.4,
      includeScore: true,
    });

    const results = filteredFuse.search(query);
    return results.map((result: FuseResult<Rule>) => result.item);
  }

  private applyFilters(rules: Rule[], filters: SearchFilters): Rule[] {
    return rules.filter(rule => {
      if (filters.category && !rule.categories.includes(filters.category)) {
        return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          rule.tags.some(ruleTag => ruleTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      if (filters.rating && rule.rating < filters.rating) {
        return false;
      }

      if (filters.author && !rule.author.toLowerCase().includes(filters.author.toLowerCase())) {
        return false;
      }

      if (filters.source_repo && rule.source_repo !== filters.source_repo) {
        return false;
      }

      return true;
    });
  }

  public getRulesByCategory(category: string): Rule[] {
    return this.database.rules.filter(rule => 
      rule.categories.includes(category)
    );
  }

  public getRulesByTag(tag: string): Rule[] {
    return this.database.rules.filter(rule => 
      rule.tags.some(ruleTag => ruleTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  public getPopularRules(limit: number = 10): Rule[] {
    return [...this.database.rules]
      .sort((a, b) => (b.rating * b.downloads) - (a.rating * a.downloads))
      .slice(0, limit);
  }

  public getRecentRules(limit: number = 10): Rule[] {
    return [...this.database.rules]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
  }

  public getFeaturedRules(limit: number = 6): Rule[] {
    // Get rules with high ratings and good descriptions
    return [...this.database.rules]
      .filter(rule => rule.rating >= 4.0 && rule.description.length > 50)
      .sort((a, b) => (b.rating * b.favorites) - (a.rating * a.favorites))
      .slice(0, limit);
  }

  public getStatsOverview() {
    const rules = this.database.rules;
    const categoryStats = this.database.categories.map(category => ({
      name: category,
      count: rules.filter(rule => rule.categories.includes(category)).length
    }));

    const languageStats = this.database.tags
      .filter(tag => ['typescript', 'javascript', 'python', 'react', 'vue', 'angular'].includes(tag))
      .map(lang => ({
        name: lang,
        count: rules.filter(rule => rule.tags.includes(lang)).length
      }));

    return {
      totalRules: rules.length,
      totalCategories: this.database.categories.length,
      totalTags: this.database.tags.length,
      avgRating: rules.reduce((sum, rule) => sum + rule.rating, 0) / rules.length,
      categoryStats: categoryStats.sort((a, b) => b.count - a.count),
      languageStats: languageStats.sort((a, b) => b.count - a.count),
    };
  }
} 