'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List,
  X,
  ChevronDown
} from 'lucide-react';
import Header from '@/components/Header';
import RuleCard from '@/components/RuleCard';
import { RuleService } from '@/lib/database';
import { Rule, SearchFilters, SortOption } from '@/types/rule';
import { debounce } from '@/lib/utils';

export default function RulesPage() {
  const ruleService = RuleService.getInstance();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>({
    field: 'rating',
    direction: 'desc',
    label: 'Highest Rated'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const allRules = ruleService.getAllRules();
  const categories = ruleService.getCategories();
  const tags = ruleService.getTags();

  const sortOptions: SortOption[] = [
    { field: 'rating', direction: 'desc', label: 'Highest Rated' },
    { field: 'downloads', direction: 'desc', label: 'Most Downloaded' },
    { field: 'updated_at', direction: 'desc', label: 'Recently Updated' },
    { field: 'name', direction: 'asc', label: 'Name A-Z' },
    { field: 'file_size', direction: 'asc', label: 'Smallest Size' },
  ];

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Filter and sort rules
  const filteredRules = useMemo(() => {
    let rules = searchQuery.trim() 
      ? ruleService.searchRules(searchQuery, filters)
      : ruleService.getAllRules();

    if (filters) {
      rules = rules.filter(rule => {
        if (filters.category && !rule.categories.includes(filters.category)) {
          return false;
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

    // Sort rules
    rules.sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortBy.direction === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortBy.direction === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

    return rules;
  }, [searchQuery, filters, sortBy, ruleService]);

  // Pagination
  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Browse Cursor Rules
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover {allRules.length} cursor rules from the community. Find the perfect rules for your development workflow.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search rules, descriptions, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                  isFilterOpen 
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 text-xs text-white flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 transition-all">
                  {sortBy.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  <span>{sortBy.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
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

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-slate-700 bg-slate-800/50 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="cyber-card p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
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
                      onChange={(e) => handleFilterChange('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  {/* Source Repository Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
                    <select
                      value={filters.source_repo || ''}
                      onChange={(e) => handleFilterChange('source_repo', e.target.value || undefined)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">All Sources</option>
                      <option value="PatrickJS/awesome-cursorrules">PatrickJS</option>
                      <option value="sk3pp3r/awesome-cursorrules">sk3pp3r</option>
                    </select>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
                    <input
                      type="text"
                      placeholder="Filter by author..."
                      value={filters.author || ''}
                      onChange={(e) => handleFilterChange('author', e.target.value || undefined)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Showing {paginatedRules.length} of {filteredRules.length} rules
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Rules Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {paginatedRules.map((rule) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <RuleCard 
                  rule={rule} 
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                  showPreview={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredRules.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No rules found</h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search query or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 mt-12"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    currentPage === page
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
} 