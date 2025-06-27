'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Star, 
  TrendingUp, 
  Award, 
  Calendar, 
  Github, 
  Mail,
  MapPin,
  ExternalLink,
  Heart,
  BookOpen,
  Plus,
  Target,
  ChevronRight,
  Trophy,
  Clock,
  AlertCircle,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { UserLevel, UserStats, UserBadge, UserContribution, USER_LEVELS, BADGE_TEMPLATES } from '@/types/user';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // In a real implementation, this would fetch user profile data from API
      setLoading(false);
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <User className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
          <p className="text-slate-400 mb-6">
            You need to sign in to view your profile and track your contributions.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>Sign In with GitHub</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-28">
      <div className="container mx-auto px-4 py-8">
        {/* Development Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-orange-500/20 rounded-lg p-2">
              <Database className="h-6 w-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                Profile System Under Development
              </h3>
              <p className="text-orange-200/80 mb-4">
                The user profile system with contribution tracking, badges, and level progression 
                requires backend database implementation. Currently showing basic GitHub profile information.
              </p>
              <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                <h4 className="font-medium text-orange-300 mb-2">Planned Features:</h4>
                <ul className="text-sm text-orange-200/70 space-y-1">
                  <li>• User level system (Newcomer → Contributor → Specialist → Expert → Master)</li>
                  <li>• Badge system for achievements (First Rule, Community Favorite, etc.)</li>
                  <li>• Contribution tracking with points and progress</li>
                  <li>• Recent activity feed and submission history</li>
                  <li>• Privilege system based on user level</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Basic Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 mb-8 border border-slate-700"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar & Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={session.user?.image || '/default-avatar.png'}
                  alt={session.user?.name || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-slate-600"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                  <span className="text-xl">🌱</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {session.user?.name}
                </h1>
                <div className="flex items-center space-x-4 text-slate-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{session.user?.email}</span>
                  </div>
                  {session.user?.githubUsername && (
                    <div className="flex items-center space-x-1">
                      <Github className="h-4 w-4" />
                      <a 
                        href={`https://github.com/${session.user.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        @{session.user.githubUsername}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-slate-400 text-sm mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since joining the platform</span>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="flex-1 md:text-right">
              <div className="inline-flex items-center space-x-3 bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="text-center">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-lg font-bold text-green-400">
                    Newcomer
                  </div>
                  <div className="text-xs text-slate-400">
                    Just getting started
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 h-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span>Contribution Stats</span>
              </h3>
              
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-300 mb-2">
                    Coming Soon
                  </h4>
                  <p className="text-slate-400 max-w-md">
                    This section will show your rule submissions, approvals, 
                    community contributions, and overall impact metrics.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Award className="h-5 w-5 text-orange-400" />
                <span>Achievements</span>
              </h3>
              
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  Earn badges by contributing rules, helping the community, and reaching milestones.
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/submit"
                  className="flex items-center space-x-3 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg hover:bg-blue-600/20 transition-colors group"
                >
                  <Plus className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-blue-400 group-hover:text-blue-300">Submit Rule</span>
                </Link>
                
                <Link
                  href="/rules"
                  className="flex items-center space-x-3 p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg hover:bg-purple-600/20 transition-colors group"
                >
                  <BookOpen className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
                  <span className="text-purple-400 group-hover:text-purple-300">Browse Rules</span>
                </Link>
                
                <Link
                  href="/favorites"
                  className="flex items-center space-x-3 p-3 bg-red-600/10 border border-red-600/30 rounded-lg hover:bg-red-600/20 transition-colors group"
                >
                  <Heart className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                  <span className="text-red-400 group-hover:text-red-300">My Favorites</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 