'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Copy, 
  Heart, 
  Calendar,
  User,
  FileText,
  Tag,
  ExternalLink,
  Github
} from 'lucide-react';
import Header from '@/components/Header';
import { RuleService } from '@/lib/database';
import { 
  formatNumber, 
  formatFileSize, 
  formatRelativeTime, 
  copyToClipboard, 
  getCategoryColor
} from '@/lib/utils';
import toast from 'react-hot-toast';

interface RulePageProps {
  params: {
    slug: string;
  };
}

export default function RulePage({ params }: RulePageProps) {
  const ruleService = RuleService.getInstance();
  const rule = ruleService.getRuleBySlug(params.slug);

  if (!rule) {
    notFound();
  }

  const handleCopyRule = async () => {
    const success = await copyToClipboard(rule.content);
    if (success) {
      toast.success('Rule copied to clipboard!');
    } else {
      toast.error('Failed to copy rule');
    }
  };

  const relatedRules = ruleService.getRulesByCategory(rule.categories[0]).filter(r => r.id !== rule.id).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/rules"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Rules</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cyber-card p-8"
            >
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">{rule.name}</h1>
                <p className="text-lg text-slate-300 leading-relaxed">{rule.description}</p>
              </div>

              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {rule.categories.map((category) => (
                  <span
                    key={category}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white ${getCategoryColor(category)}`}
                  >
                    {category}
                  </span>
                ))}
                {rule.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-slate-700 text-slate-300"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rule Content */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Rule Content</h2>
                  <button
                    onClick={handleCopyRule}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Rule</span>
                  </button>
                </div>
                <pre className="code-block text-sm whitespace-pre-wrap overflow-x-auto">
                  {rule.content}
                </pre>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Stats Card */}
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-slate-300">Rating</span>
                    </div>
                    <span className="text-white font-semibold">{rule.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Downloads</span>
                    </div>
                    <span className="text-white font-semibold">{formatNumber(rule.downloads)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-slate-300">Favorites</span>
                    </div>
                    <span className="text-white font-semibold">{formatNumber(rule.favorites)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300">Size</span>
                    </div>
                    <span className="text-white font-semibold">{formatFileSize(rule.file_size)}</span>
                  </div>
                </div>
              </div>

              {/* Author Card */}
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Author</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{rule.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Github className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{rule.source_repo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">Updated {formatRelativeTime(rule.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleCopyRule}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy to Clipboard</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                    <Heart className="h-4 w-4" />
                    <span>Add to Favorites</span>
                  </button>
                  <a
                    href={`https://github.com/${rule.source_repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Source</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Rules */}
        {relatedRules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Related Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedRules.map((relatedRule) => (
                <Link
                  key={relatedRule.id}
                  href={`/rules/${relatedRule.slug}`}
                  className="cyber-card p-4 hover:border-blue-500/50 transition-all group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {relatedRule.name}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                    {relatedRule.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{relatedRule.rating.toFixed(1)}</span>
                    </div>
                    <span>{relatedRule.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 