'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Category {
  category: string;
  count: number;
}

interface Stats {
  totalRules: number;
  totalAuthors: number;
  averageRating: number;
  topCategories: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch('/api/stats');
        const statsData = await statsResponse.json();

        if (statsData.success) {
          setStats(statsData.data);
          setCategories(statsData.data.topCategories);
        } else {
          throw new Error(statsData.error || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="text-slate-300">Loading categories...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Categories</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <Link
            href="/rules"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Rules
          </Link>
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"
            >
              <BookOpen className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Explore cursor rules organized by category. Find the perfect rules for your specific development needs.
            </p>
          </div>

          {/* Stats Overview */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="cyber-card p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalRules}</div>
                <div className="text-slate-400">Total Rules</div>
              </div>
              <div className="cyber-card p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{categories.length}</div>
                <div className="text-slate-400">Categories</div>
              </div>
              <div className="cyber-card p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{stats.averageRating.toFixed(1)}</div>
                <div className="text-slate-400">Avg Rating</div>
              </div>
            </motion.div>
          )}

          {/* Categories Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  href={`/rules?category=${encodeURIComponent(category.category)}`}
                  className="group cyber-card p-6 hover:border-blue-500/50 transition-all duration-300 block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {category.category}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {category.count} rule{category.count !== 1 ? 's' : ''}
                    </span>
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (category.count / Math.max(...categories.map(c => c.count))) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-400 mb-8">
              Browse all rules or submit your own to help the community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/rules"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Browse All Rules</span>
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <span>Submit a Rule</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 