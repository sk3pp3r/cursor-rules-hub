'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Globe, Lock } from 'lucide-react';
import SubmitRuleForm from '@/components/SubmitRuleForm';
import { RuleSubmission } from '@/types/rule';
import { useSubmitRule } from '@/hooks/useSubmitRule';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const { submitRule, isSubmitting, error, success } = useSubmitRule();

  const handleFormSubmit = async (submission: RuleSubmission) => {
    try {
      const result = await submitRule(submission);
      console.log('Rule submitted successfully:', result);
      
      // Redirect to the rule page after successful submission
      if (result.success && result.rule) {
        setTimeout(() => {
          router.push(`/rules/${result.rule!.slug}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to submit rule:', err);
      // Error is handled by the hook and displayed in the form
    }
  };

  const handleCancel = () => {
    router.push('/');
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
          <SubmitRuleForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </motion.div>
      </main>
    </div>
  );
} 