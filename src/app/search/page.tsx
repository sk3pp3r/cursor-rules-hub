'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import RuleCard from '@/components/RuleCard';
import { RuleService } from '@/lib/database';
import { Rule } from '@/types/rule';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ruleService = RuleService.getInstance();
    if (query) {
      const results = ruleService.searchRules(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setIsLoading(false);
  }, [query]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="cyber-card p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-full"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-semibold text-white mb-2">Start your search</h3>
        <p className="text-slate-400">
          Enter a search query to find cursor rules, configurations, and templates.
        </p>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No results found</h3>
        <p className="text-slate-400 mb-6">
          No rules found for "{query}". Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <p className="text-slate-400">
          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {searchResults.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RuleCard rule={rule} showPreview={true} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-lg animate-pulse"></div>
              <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Search Results
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Find the perfect cursor rules for your development workflow using our AI-powered search.
          </p>
        </motion.div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="cyber-card p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-full"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
} 