'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Tag, Search, Filter } from 'lucide-react';
import { RuleService } from '@/lib/database';
import { getCategoryColor } from '@/lib/utils';

export default function CategoriesPage() {
  const ruleService = RuleService.getInstance();
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ruleService.getCategories();
  const stats = ruleService.getStatsOverview();

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore cursor rules organized by categories. Find exactly what you need for your development workflow.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCategories.map((category) => {
            const categoryStats = stats.categoryStats.find(s => s.name === category);
            const count = categoryStats?.count || 0;
            
            return (
              <motion.div key={category} variants={item}>
                <Link
                  href={`/rules?category=${encodeURIComponent(category)}`}
                  className="cyber-card p-6 hover:border-blue-500/50 transition-all group h-full flex flex-col"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${getCategoryColor(category)}`}>
                      {category.includes('Language') ? (
                        <Code2 className="h-6 w-6 text-white" />
                      ) : (
                        <Tag className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                        {category}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {count} rule{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(category)} opacity-75`}
                        style={{ width: `${Math.min(100, (count / Math.max(...stats.categoryStats.map(s => s.count))) * 100)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="cyber-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
            <p className="text-slate-300 mb-6">
              Use our advanced search to find rules by keywords, tags, or content.
            </p>
            <Link
              href="/rules"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              <Code2 className="h-5 w-5" />
              <span>Browse All Rules</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 