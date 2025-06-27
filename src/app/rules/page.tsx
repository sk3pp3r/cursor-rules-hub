'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import RuleCard from '@/components/RuleCard';
import { CursorRule } from '@/lib/turso-service';
import { Rule, SearchFilters, SortOption } from '@/types/rule';

export default function RulesPage() {
  const [allRules, setAllRules] = useState<CursorRule[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>({
    field: 'rating',
    direction: 'desc',
    label: 'Rating (High to Low)'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rulesResponse, statsResponse] = await Promise.all([
          fetch('/api/rules?limit=1000'), // Get all rules
          fetch('/api/stats')
        ]);

        const [rulesData, statsData] = await Promise.all([
          rulesResponse.json(),
          statsResponse.json()
        ]);

        if (rulesData.success) {
          setAllRules(rulesData.data.rules);
        }

        if (statsData.success) {
          // Extract categories from stats
          const categoryNames = statsData.data.topCategories.map((cat: any) => cat.category);
          setCategories(categoryNames);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load rules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort rules
  const filteredAndSortedRules = useMemo(() => {
    let rules = [...allRules];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      rules = rules.filter(rule =>
        rule.name.toLowerCase().includes(query) ||
        (rule.description?.toLowerCase().includes(query)) ||
        (rule.author?.toLowerCase().includes(query)) ||
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

    // Apply sorting
    rules.sort((a, b) => {
      const fieldName = sortBy.field as keyof CursorRule;
      const aValue = a[fieldName];
      const bValue = b[fieldName];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortBy.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortBy.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

    return rules;
  }, [allRules, searchQuery, filters, sortBy]);

  // Convert CursorRule to Rule for compatibility
  const convertCursorRuleToRule = (cursorRule: CursorRule): Rule => ({
    ...cursorRule,
    description: cursorRule.description || '',
    source_repo: cursorRule.source_repo || '',
    author: cursorRule.author || '',
    language_support: cursorRule.language_support || [],
    github_user: undefined
  });

  const sortOptions: SortOption[] = [
    { field: 'rating', direction: 'desc', label: 'Rating (High to Low)' },
    { field: 'rating', direction: 'asc', label: 'Rating (Low to High)' },
    { field: 'downloads', direction: 'desc', label: 'Downloads (Most)' },
    { field: 'name', direction: 'asc', label: 'Name (A-Z)' },
    { field: 'name', direction: 'desc', label: 'Name (Z-A)' },
    { field: 'created_at', direction: 'desc', label: 'Newest First' },
    { field: 'created_at', direction: 'asc', label: 'Oldest First' },
  ];

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
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cursor Rules Collection
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Browse through our comprehensive collection of {allRules.length} cursor rules.
              Find the perfect configurations for your development workflow.
            </p>
          </div>

          {/* Search and Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search rules by name, description, author, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                    showFilters
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                {/* Sort Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 transition-all">
                    {sortBy.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    <span>{sortBy.label}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.field}-${option.direction}`}
                        onClick={() => setSortBy(option)}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          sortBy.field === option.field && sortBy.direction === option.direction
                            ? 'text-blue-400 bg-slate-700'
                            : 'text-slate-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-6 bg-slate-800/30 border border-slate-700 rounded-lg"
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
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400">
              Showing {filteredAndSortedRules.length} of {allRules.length} rules
            </p>
            
            {(searchQuery || Object.keys(filters).length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Rules Grid */}
          {filteredAndSortedRules.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAndSortedRules.map((rule) => (
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
              className="text-center py-12"
            >
              <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No rules found</h3>
              <p className="text-slate-400 mb-4">
                No rules match your current search and filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 