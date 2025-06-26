'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Star, 
  Download, 
  Copy, 
  Heart, 
  Eye, 
  Calendar,
  User,
  FileText,
  Tag,
  ExternalLink
} from 'lucide-react';
import { Rule } from '@/types/rule';
import { 
  formatNumber, 
  formatFileSize, 
  formatRelativeTime, 
  copyToClipboard, 
  getCategoryColor,
  truncateText 
} from '@/lib/utils';
import toast from 'react-hot-toast';
import { useFavorites } from '@/contexts/FavoritesContext';

interface RuleCardProps {
  rule: Rule;
  variant?: 'default' | 'compact' | 'featured';
  showPreview?: boolean;
}

export default function RuleCard({ rule, variant = 'default', showPreview = false }: RuleCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();

  // Ensure hydration consistency
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopyRule = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const success = await copyToClipboard(rule.content);
    if (success) {
      toast.success('Rule copied to clipboard!');
    } else {
      toast.error('Failed to copy rule');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasAlreadyFavorited = isFavorited(rule.id);
    toggleFavorite(rule);
    toast.success(wasAlreadyFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const cardVariants = {
    default: 'cyber-card p-6',
    compact: 'cyber-card p-4',
    featured: 'cyber-card p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link href={`/rules/${rule.slug}`} className="block">
        <div className={`${cardVariants[variant]} transition-all duration-300 hover:border-blue-500/50`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                {rule.name}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2">
                {truncateText(rule.description, variant === 'compact' ? 100 : 150)}
              </p>
            </div>
            
            {variant === 'featured' && (
              <div className="ml-4 flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                <Star className="h-3 w-3 fill-current" />
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {rule.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            ))}
            {rule.tags.slice(0, variant === 'compact' ? 2 : 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{rule.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>{formatNumber(rule.downloads)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>{formatFileSize(rule.file_size)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(rule.updated_at)}</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">{rule.author}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500">{rule.source_repo}</span>
            </div>

            {/* Action Buttons - Only render on client to avoid hydration mismatch */}
            {isClient && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-lg transition-all ${
                    isFavorited(rule.id) 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-red-400'
                  }`}
                  title={isFavorited(rule.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-4 w-4 ${isFavorited(rule.id) ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleCopyRule}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-blue-400 transition-all"
                  title="Copy rule to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>

                {showPreview && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsPreviewOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-green-400 transition-all"
                    title="Preview rule"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                
                <Link
                  href={`/rules/${rule.slug}`}
                  className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                  title="View details"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>

      {/* Preview Modal - Only render on client */}
      {isClient && isPreviewOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[80vh] mx-4 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">
              <pre className="code-block text-sm whitespace-pre-wrap">{rule.content}</pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 