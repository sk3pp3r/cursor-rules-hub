'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Download, 
  Copy, 
  Heart, 
  Star, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Github,
  ExternalLink,
  Check,
  ArrowLeft,
  Share2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CursorRule } from '@/lib/turso-service';
import { Rule } from '@/types/rule';
import RuleCard from '@/components/RuleCard';
import { formatDate, formatFileSize, getCategoryColor, copyToClipboard, formatNumber, formatRelativeTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface RulePageProps {
  params: { slug: string };
}

export default function RulePage({ params }: RulePageProps) {
  const [rule, setRule] = useState<CursorRule | null>(null);
  const [relatedRules, setRelatedRules] = useState<CursorRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRuleData = async () => {
      try {
        // Fetch the rule by slug
        const ruleResponse = await fetch(`/api/rules/${params.slug}`);
        const ruleData = await ruleResponse.json();

        if (!ruleData.success) {
          if (ruleResponse.status === 404) {
            notFound();
            return;
          }
          throw new Error(ruleData.error || 'Failed to fetch rule');
        }

        setRule(ruleData.data.rule);

        // Fetch related rules if we have categories
        if (ruleData.data.rule.categories.length > 0) {
          const relatedResponse = await fetch(`/api/rules?category=${ruleData.data.rule.categories[0]}&limit=4`);
          const relatedData = await relatedResponse.json();
          
          if (relatedData.success) {
            // Filter out the current rule from related rules
            const filtered = relatedData.data.rules.filter((r: CursorRule) => r.id !== ruleData.data.rule.id);
            setRelatedRules(filtered.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error fetching rule:', err);
        setError('Failed to load rule. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRuleData();
  }, [params.slug]);

  const handleCopyRule = async () => {
    if (!rule) return;
    const success = await copyToClipboard(rule.content);
    if (success) {
      toast.success('Rule copied to clipboard!');
    } else {
      toast.error('Failed to copy rule');
    }
  };

  const handleDownload = async () => {
    if (!rule) return;

    try {
      // Track download by calling the POST endpoint
      await fetch(`/api/rules/${params.slug}`, { method: 'POST' });
      
      // Create and download file
      const blob = new Blob([rule.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${rule.slug}.cursorrules`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Rule downloaded successfully!');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download rule');
    }
  };

  // Convert CursorRule to Rule for compatibility with existing components
  const convertCursorRuleToRule = (cursorRule: CursorRule): Rule => ({
    ...cursorRule,
    description: cursorRule.description || '',
    source_repo: cursorRule.source_repo || '',
    author: cursorRule.author || '',
    language_support: cursorRule.language_support || [],
    github_user: undefined
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="text-slate-300">Loading rule...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Rule</h1>
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

  if (!rule) {
    notFound();
  }

  return (
    <div className="min-h-screen">
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
                {rule.description && (
                  <p className="text-lg text-slate-300 leading-relaxed">{rule.description}</p>
                )}
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
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopyRule}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Rule</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
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
                  {rule.source_repo && (
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">{rule.source_repo}</span>
                    </div>
                  )}
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
                  <button 
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Rule</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">
                    <Heart className="h-4 w-4" />
                    <span>Add to Favorites</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all">
                    <Share2 className="h-4 w-4" />
                    <span>Share Rule</span>
                  </button>
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
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Related Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRules.map((relatedRule) => (
                <RuleCard 
                  key={relatedRule.id} 
                  rule={convertCursorRuleToRule(relatedRule)} 
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 