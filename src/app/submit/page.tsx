'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Github } from 'lucide-react';
import Header from '@/components/Header';
import SubmitRuleForm from '@/components/SubmitRuleForm';
import { RuleSubmission } from '@/types/rule';

export default function SubmitPage() {
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = async (submission: RuleSubmission) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rule');
      }

      const result = await response.json();
      console.log('Rule submitted successfully:', result);
      
      // The form component handles success state and reset
    } catch (error) {
      console.error('Error submitting rule:', error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleDirectUploadClick = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {showForm ? (
            <SubmitRuleForm 
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          ) : (
            <div className="text-center">
              <div className="cyber-card p-8 mb-8">
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

                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDirectUploadClick}
                    className="cursor-pointer flex items-center space-x-4 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all"
                  >
                    <Upload className="h-8 w-8 text-purple-400" />
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white mb-2">Direct Upload</h3>
                      <p className="text-sm text-slate-400">
                        Upload your cursor rule directly through our form. Perfect for quick submissions and new contributors.
                      </p>
                    </div>
                  </motion.div>

                  <motion.a
                    href="https://github.com/PatrickJS/awesome-cursorrules"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-4 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all"
                  >
                    <Github className="h-8 w-8 text-blue-400" />
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-white mb-2">Contribute via GitHub</h3>
                      <p className="text-sm text-slate-400">
                        Submit a pull request to our repository. Ideal for developers familiar with Git workflows.
                      </p>
                    </div>
                  </motion.a>
                </div>
              </div>

              <div className="cyber-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Submission Guidelines</h2>
                <div className="grid gap-4 md:grid-cols-2 text-left">
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">✨ Quality Standards</h3>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Clear, descriptive rule names</li>
                      <li>• Detailed descriptions (min. 50 chars)</li>
                      <li>• Well-structured rule content</li>
                      <li>• Relevant tags and categories</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">🚀 Best Practices</h3>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Test your rules before submission</li>
                      <li>• Include usage examples</li>
                      <li>• Specify compatibility notes</li>
                      <li>• Add relevant external links</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 