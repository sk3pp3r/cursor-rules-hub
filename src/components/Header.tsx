'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { 
  Search, 
  Menu, 
  X, 
  Code2, 
  Home, 
  BookOpen, 
  Plus, 
  Github,
  Star,
  Zap,
  Heart,
  Settings,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { favoritesCount } = useFavorites();
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse Rules', href: '/rules', icon: BookOpen },
    { name: 'Categories', href: '/categories', icon: Code2 },
    { name: 'Favorites', href: '/favorites', icon: Heart, badge: favoritesCount },
    { name: 'Submit Rule', href: '/submit', icon: Plus },
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-dark-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
              <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber">
                Cursor Rules Hub
              </span>
              <span className="text-xs text-slate-400 -mt-1">AI-Powered IDE Rules</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors group relative"
              >
                <div className="relative">
                  <item.icon className={`h-4 w-4 group-hover:text-blue-400 transition-colors ${
                    item.name === 'Favorites' && favoritesCount > 0 ? 'text-red-400' : ''
                  }`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-lg border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </form>

            {/* GitHub Link */}
            <a
              href="https://github.com/sk3pp3r/cursor-rules-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>

            {/* Star Button */}
            <button className="flex items-center space-x-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-yellow-400 hover:bg-yellow-500/20 transition-all">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Star</span>
            </button>

            {/* Authentication */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={session.user?.image || '/default-avatar.png'}
                    alt={session.user?.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-slate-600"
                  />
                  <span className="text-sm text-slate-300 max-w-24 truncate">
                    {session.user?.name || session.user?.email}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2"
                    >
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-sm font-medium text-white truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign in</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 py-4 space-y-4"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-10 pr-4 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </form>

              {/* Mobile Authentication */}
              {status !== 'loading' && (
                <div className="border-b border-slate-800 pb-4">
                  {session ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <img
                          src={session.user?.image || '/default-avatar.png'}
                          alt={session.user?.name || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-slate-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => signIn('github')}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors w-full justify-center"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign in with GitHub</span>
                    </button>
                  )}
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 rounded-lg p-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    <div className="relative">
                      <item.icon className={`h-5 w-5 ${
                        item.name === 'Favorites' && favoritesCount > 0 ? 'text-red-400' : ''
                      }`} />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <a
                  href="https://github.com/sk3pp3r/cursor-rules-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>

                <button className="flex items-center space-x-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-yellow-400 hover:bg-yellow-500/20 transition-all">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Star</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 