export interface Rule {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  source_repo: string;
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

export interface RuleDatabase {
  meta: {
    version: string;
    total_rules: number;
    last_updated: string;
    sources: string[];
  };
  rules: Rule[];
  categories: string[];
  tags: string[];
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  rating?: number;
  author?: string;
  source_repo?: string;
}

export interface SortOption {
  field: keyof Rule;
  direction: 'asc' | 'desc';
  label: string;
}

export interface RuleSubmission {
  name: string;
  category: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  usage_examples?: string;
  prerequisites?: string;
  compatibility_notes?: string;
  external_links?: string[];
} 