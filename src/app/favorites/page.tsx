'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Trash2,
  Download,
  Share2,
  SortAsc,
  SortDesc,
  Calendar,
  Star,
  Tag,
  Folder,
  AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import RuleCard from '@/components/RuleCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Rule } from '@/types/rule';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'date-added' | 'rating' | 'downloads';
type SortOrder = 'asc' | 'desc';

export default function FavoritesPage() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date-added');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Get unique categories and tags from favorites
  const categories = Array.from(new Set(favorites.flatMap(rule => rule.categories))).sort();
  const tags = Array.from(new Set(favorites.flatMap(rule => rule.tags))).sort();

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(rule => {
      const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           rule.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || rule.categories.includes(selectedCategory);
      const matchesTag = selectedTag === 'all' || rule.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date-added':
          // Since we don't track when added to favorites, use updated_at as proxy
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'downloads':
          comparison = a.downloads - b.downloads;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleClearAll = () => {
    clearFavorites();
    setShowClearConfirm(false);
    toast.success('All favorites cleared');
  };

  const handleExportFavorites = async () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      count: favorites.length,
      favorites: favorites.map(rule => ({
        id: rule.id,
        name: rule.name,
        slug: rule.slug,
        description: rule.description,
        categories: rule.categories,
        tags: rule.tags,
        rating: rule.rating,
        downloads: rule.downloads
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const success = await copyToClipboard(dataStr);
    
    if (success) {
      toast.success('Favorites list copied to clipboard');
    } else {
      // Fallback: create download link
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cursor-rules-favorites-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Favorites exported to file');
    }
  };

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
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 opacity-75 blur-sm"></div>
              <div className="relative rounded-lg bg-gradient-to-r from-red-600 to-pink-600 p-3">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              My Favorites
            </h1>
          </div>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-6">
            Your personally curated collection of cursor rules. 
            {favoritesCount > 0 
              ? `You have ${favoritesCount} favorite rule${favoritesCount === 1 ? '' : 's'} saved.`
              : 'Start building your collection by clicking the heart icon on any rule.'
            }
          </p>

          {/* Stats */}
          {favoritesCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="cyber-card p-4">
                <Heart className="h-6 w-6 text-red-400 mx-auto mb-2 fill-current" />
                <h3 className="font-semibold text-white">{favoritesCount}</h3>
                <p className="text-sm text-slate-300">Total Favorites</p>
              </div>
              <div className="cyber-card p-4">
                <Folder className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">{categories.length}</h3>
                <p className="text-sm text-slate-300">Categories</p>
              </div>
              <div className="cyber-card p-4">
                <Tag className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">{tags.length}</h3>
                <p className="text-sm text-slate-300">Unique Tags</p>
              </div>
              <div className="cyber-card p-4">
                <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">
                  {favorites.length > 0 ? (favorites.reduce((sum, rule) => sum + rule.rating, 0) / favorites.length).toFixed(1) : '0.0'}
                </h3>
                <p className="text-sm text-slate-300">Avg Rating</p>
              </div>
            </div>
          )}
        </motion.div>

        {favoritesCount === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="cyber-card p-12 max-w-lg mx-auto">
              <Heart className="h-16 w-16 text-slate-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Favorites Yet</h2>
              <p className="text-slate-400 mb-8">
                Start exploring our collection of cursor rules and save your favorites by clicking the heart icon.
              </p>
              <div className="space-y-4">
                <a
                  href="/rules"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                >
                  <Search className="h-5 w-5" />
                  <span>Browse Rules</span>
                </a>
                <div className="text-sm text-slate-500">
                  or explore by <a href="/categories" className="text-blue-400 hover:text-blue-300">categories</a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="cyber-card p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search favorites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Tags</option>
                    {tags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>

                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('-');
                      setSortBy(sort as SortOption);
                      setSortOrder(order as SortOrder);
                    }}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="date-added-desc">Newest First</option>
                    <option value="date-added-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="rating-asc">Lowest Rated</option>
                    <option value="downloads-desc">Most Downloaded</option>
                    <option value="downloads-asc">Least Downloaded</option>
                  </select>
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Grid view"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleExportFavorites}
                    className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"
                    title="Export favorites"
                  >
                    <Download className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    title="Clear all favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedCategory !== 'all' || selectedTag !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700">
                  <span className="text-sm text-slate-400">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-blue-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      Category: {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="ml-1 hover:text-purple-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedTag !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                      Tag: {selectedTag}
                      <button
                        onClick={() => setSelectedTag('all')}
                        className="ml-1 hover:text-green-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {filteredFavorites.length === favoritesCount 
                    ? `All Favorites (${favoritesCount})`
                    : `${filteredFavorites.length} of ${favoritesCount} favorites`
                  }
                </h2>
              </div>

              {filteredFavorites.length === 0 ? (
                <div className="cyber-card p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No matches found</h3>
                  <p className="text-slate-400">
                    Try adjusting your search or filter criteria to see more results.
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredFavorites.map((rule) => (
                    <motion.div key={rule.id} variants={item}>
                      <RuleCard 
                        rule={rule} 
                        variant={viewMode === 'list' ? 'compact' : 'default'}
                        showPreview={true}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 rounded-lg border border-slate-700 p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Clear All Favorites</h3>
              </div>
              
              <p className="text-slate-300 mb-6">
                Are you sure you want to remove all {favoritesCount} favorite rules? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 