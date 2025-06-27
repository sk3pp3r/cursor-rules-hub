'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import { formatDate, formatFileSize } from '@/lib/utils';

interface Rule {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  source_repo: string;
  categories: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  rating: number;
  downloads: number;
  favorites: number;
  file_size: number;
  language_support: string[];
}

interface ApiResponse {
  success: boolean;
  data: {
    rules: Rule[];
    meta: {
      total_rules: number;
      filtered_count: number;
      returned_count: number;
      offset: number;
      limit: number;
    };
  };
}

export default function AdminPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [showCommunityOnly, setShowCommunityOnly] = useState(true);

  useEffect(() => {
    fetchRules();
  }, [showCommunityOnly]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const url = showCommunityOnly 
        ? '/api/rules?source=community-submission&limit=100'
        : '/api/rules?limit=100';
      
      const response = await fetch(url);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setRules(data.data.rules);
      } else {
        setError('Failed to fetch rules');
      }
    } catch (err) {
      setError('Error loading rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadRule = (rule: Rule) => {
    const blob = new Blob([rule.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rule.slug}.cursorrules`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading rules...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="cyber-card p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="cyber-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">Rules Management</h1>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={showCommunityOnly}
                    onChange={(e) => setShowCommunityOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span>Community submissions only</span>
                </label>
                
                <div className="text-sm text-slate-400">
                  {rules.length} rule{rules.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>

            {rules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">
                  {showCommunityOnly 
                    ? 'No community-submitted rules found. Submit the first one!' 
                    : 'No rules found in the database.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {rules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/30 border border-slate-600 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{rule.name}</h3>
                        <p className="text-slate-300 mb-3 line-clamp-2">{rule.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{rule.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(rule.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">Size:</span>
                            <span>{formatFileSize(rule.file_size)}</span>
                          </div>
                          {rule.source_repo === 'community-submission' && (
                            <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded text-green-300 text-xs">
                              Community
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedRule(rule)}
                          className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => downloadRule(rule)}
                          className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                          title="Download rule"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {rule.categories.map((category, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 text-xs">
                          {category}
                        </span>
                      ))}
                      {rule.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300 text-xs">
                          <Tag className="h-3 w-3 mr-1 inline" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Rule Detail Modal */}
      {selectedRule && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRule(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="cyber-card p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedRule.name}</h2>
                <p className="text-slate-300">{selectedRule.description}</p>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-400">Author:</span> <span className="text-white">{selectedRule.author}</span></div>
                  <div><span className="text-slate-400">Created:</span> <span className="text-white">{formatDate(selectedRule.created_at)}</span></div>
                  <div><span className="text-slate-400">Size:</span> <span className="text-white">{formatFileSize(selectedRule.file_size)}</span></div>
                  <div><span className="text-slate-400">Source:</span> <span className="text-white">{selectedRule.source_repo}</span></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Categories & Tags</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 text-sm block mb-1">Categories:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedRule.categories.map((category, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm block mb-1">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedRule.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Rule Content</h3>
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{selectedRule.content}</pre>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedRule(null)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => downloadRule(selectedRule)}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Rule
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 