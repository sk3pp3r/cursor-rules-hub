'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import RuleCard from '@/components/RuleCard';
import { CursorRule } from '@/lib/turso-service';
import { Rule, SearchFilters } from '@/types/rule';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [allRules, setAllRules] = useState<CursorRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('/api/rules?limit=1000');
        const data = await response.json();

        if (data.success) {
          setAllRules(data.data.rules);
        } else {
          throw new Error(data.error || 'Failed to fetch rules');
        }
      } catch (err) {
        console.error('Error fetching rules:', err);
        setError('Failed to load rules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // Search and filter logic
  const filteredRules = useMemo(() => {
    let rules = [...allRules];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      rules = rules.filter(rule =>
        rule.name.toLowerCase().includes(query) ||
        (rule.description?.toLowerCase().includes(query)) ||
        (rule.author?.toLowerCase().includes(query)) ||
        rule.content.toLowerCase().includes(query) ||
        rule.tags.some(tag => tag.toLowerCase().includes(query)) ||
        rule.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.category) {
      rules = rules.filter(rule => rule.categories.includes(filters.category!));
    }

    if (filters.rating) {
      rules = rules.filter(rule => rule.rating >= filters.rating!);
    }

    if (filters.author) {
      rules = rules.filter(rule =>
        rule.author?.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    return rules;
  }, [allRules, searchQuery, filters]);

  // Convert CursorRule to Rule for compatibility
  const convertCursorRuleToRule = (cursorRule: CursorRule): Rule => ({
    ...cursorRule,
    description: cursorRule.description || '',
    source_repo: cursorRule.source_repo || '',
    author: cursorRule.author || '',
    language_support: cursorRule.language_support || [],
    github_user: undefined
  });

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="text-slate-300">Loading rules...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Rules</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Search Cursor Rules
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Find the perfect cursor rules for your development workflow. Search by name, content, tags, or author.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search rules by name, content, tags, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-12 pr-12 py-4 text-lg placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-4xl mx-auto p-6 bg-slate-800/30 border border-slate-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">All Categories</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Database">Database</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Rating</label>
                    <select
                      value={filters.rating || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
                    <input
                      type="text"
                      placeholder="Filter by author..."
                      value={filters.author || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value || undefined }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Rules'}
              </h2>
              <p className="text-slate-400">
                {filteredRules.length} rule{filteredRules.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {(searchQuery || Object.keys(filters).length > 0) && (
              <button
                onClick={clearSearch}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Results */}
          {filteredRules.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRules.map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RuleCard rule={convertCursorRuleToRule(rule)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="h-16 w-16 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">No rules found</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `No rules match your search for "${searchQuery}". Try different keywords or remove some filters.`
                  : 'No rules match your current filters. Try adjusting your search criteria.'
                }
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear Search</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 