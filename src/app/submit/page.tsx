'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Globe, Lock } from 'lucide-react';
import SubmitRuleForm from '@/components/SubmitRuleForm';
import { RuleSubmission } from '@/types/rule';

export default function SubmitPage() {
  const [uploadMethod, setUploadMethod] = useState<'form' | 'github'>('form');

  const handleFormSubmit = async (submission: RuleSubmission) => {
    // Handle form submission
    console.log('Form submitted:', submission);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Submit a Cursor Rule
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Share your cursor rules with the community. Help other developers enhance their coding experience.
            </p>
          </div>

          {/* Form */}
          <div className="cyber-card p-8">
            <SubmitRuleForm 
              onSubmit={handleFormSubmit}
              onCancel={() => {}}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
} 