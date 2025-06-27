'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Code2, 
  Users, 
  Star,
  Download,
  TrendingUp,
  Shield,
  Sparkles,
  Search,
  BookOpen,
  Plus
} from 'lucide-react';
import RuleCard from '@/components/RuleCard';
import { RuleService } from '@/lib/database';

export default function HomePage() {
  const ruleService = RuleService.getInstance();
  const featuredRules = ruleService.getFeaturedRules(6);
  const stats = ruleService.getStatsOverview();
  const recentRules = ruleService.getRecentRules(4);

  const features = [
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Find the perfect rules with AI-powered semantic search and smart filtering.'
    },
    {
      icon: Code2,
      title: 'Syntax Highlighting',
      description: 'Beautiful code preview with syntax highlighting for all supported languages.'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Community-reviewed rules with ratings and feedback from developers.'
    },
    {
      icon: Zap,
      title: 'One-Click Copy',
      description: 'Instantly copy rules to your clipboard and integrate into your workflow.'
    },
    {
      icon: TrendingUp,
      title: 'Trending Rules',
      description: 'Discover the most popular and trending rules in the community.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by developers, for developers. Share your rules and help others.'
    }
  ];

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
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-lg animate-pulse"></div>
                  <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  AI-Powered IDE Rules
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                Cursor Rules Hub
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
                Discover, share, and manage the world's largest collection of 
                <span className="text-blue-400 font-semibold"> Cursor IDE rules</span> and configurations.
                <br />
                <span className="text-lg text-slate-400">
                  Enhance your coding experience with AI-powered development standards.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href="/rules"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Browse Rules</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </Link>

                <Link
                  href="/submit"
                  className="group inline-flex items-center justify-center px-8 py-4 font-medium text-blue-400 transition-all duration-300 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/50"
                >
                  <span className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Submit a Rule</span>
                  </span>
                </Link>
              </div>

              {/* Stats */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              >
                {[
                  { label: 'Total Rules', value: stats.totalRules, icon: Code2 },
                  { label: 'Categories', value: stats.totalCategories, icon: BookOpen },
                  { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: Star },
                  { label: 'Community', value: '10K+', icon: Users }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={item}
                    className="glow-border p-4 rounded-lg text-center group hover:scale-105 transition-transform"
                  >
                    <stat.icon className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:text-purple-400 transition-colors" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </section>

        {/* Featured Rules */}
        <section className="py-16 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured Rules
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Discover the most popular and highly-rated rules from our community of developers.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredRules.map((rule, index) => (
                <motion.div key={rule.id} variants={item}>
                  <RuleCard 
                    rule={rule} 
                    variant={index === 0 ? 'featured' : 'default'}
                    showPreview={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/rules"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <span>View all rules</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose Cursor Rules Hub?
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                The most comprehensive platform for Cursor IDE rules with advanced features and community support.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={item}
                  className="group relative"
                >
                  <div className="cyber-card p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Recent Rules */}
        <section className="py-16 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Recently Added
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Stay up to date with the latest rules added by the community.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {recentRules.map((rule) => (
                <motion.div key={rule.id} variants={item}>
                  <RuleCard rule={rule} variant="compact" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Enhance Your Coding Experience?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Join thousands of developers who are already using Cursor Rules Hub to improve their development workflow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/rules"
                  className="group inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Get Started</span>
                  </span>
                </Link>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center px-8 py-4 font-medium text-blue-400 transition-all duration-300 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/50"
                >
                  Contribute Rules
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        </section>
      </main>
    </div>
  );
} 