'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Github, 
  Linkedin,
  Mail,
  Zap,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/sk3pp3r/cursor-rules-hub',
      icon: Github,
      color: 'hover:text-gray-400'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/haimc/',
      icon: Linkedin,
      color: 'hover:text-blue-400'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Rules', href: '/rules' },
    { name: 'Categories', href: '/categories' },
    { name: 'Documentation', href: '/docs' }
  ];

  return (
    <footer className="mt-auto border-t border-slate-800 bg-dark-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-sm"></div>
                <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cyber">
                Cursor Rules Hub
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
              A modern, AI-themed platform for discovering, sharing, and managing Cursor IDE rules. 
              Built by developers, for developers.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 text-slate-400 transition-colors ${social.color}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="text-sm">{social.name}</span>
                  <ExternalLink className="h-3 w-3" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/api/docs"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/contributing"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Contributing Guide
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/sk3pp3r/cursor-rules-hub/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors text-sm flex items-center space-x-1"
                >
                  <span>Report Issues</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sk3pp3r/cursor-rules-hub/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors text-sm flex items-center space-x-1"
                >
                  <span>Discussions</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>&copy; {currentYear} Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <a
                href="https://www.linkedin.com/in/haimc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Haim Cohen
              </a>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </footer>
  );
} 