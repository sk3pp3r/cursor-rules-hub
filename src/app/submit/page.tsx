'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Github } from 'lucide-react';
import Header from '@/components/Header';

export default function SubmitPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="cyber-card p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-lg animate-pulse"></div>
                <div className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Submit a Rule</h1>
            <p className="text-lg text-slate-300 mb-8">
              Help grow the community by contributing your cursor rules. Share your configurations with developers worldwide.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Github className="h-6 w-6 text-blue-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-white">Contribute via GitHub</h3>
                  <p className="text-sm text-slate-400">Submit a pull request to our repository</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Upload className="h-6 w-6 text-purple-400" />
                <div className="text-left">
                  <h3 className="font-semibold text-white">Direct Upload</h3>
                  <p className="text-sm text-slate-400">Coming soon - direct file upload feature</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://github.com/PatrickJS/awesome-cursorrules"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                <Github className="h-5 w-5" />
                <span>View Repository</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 