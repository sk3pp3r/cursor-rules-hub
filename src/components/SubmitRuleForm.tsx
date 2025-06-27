'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, AlertCircle, CheckCircle, Loader2, Github, LogIn } from 'lucide-react';
import { RuleSubmission } from '@/types/rule';

interface SubmitRuleFormProps {
  onSubmit: (submission: RuleSubmission) => Promise<void>;
  onCancel: () => void;
}

export default function SubmitRuleForm({ onSubmit, onCancel }: SubmitRuleFormProps) {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<RuleSubmission>({
    name: '',
    category: '',
    description: '',
    content: '',
    author: '',
    tags: [],
    usage_examples: '',
    prerequisites: '',
    compatibility_notes: '',
    external_links: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentLink, setCurrentLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Auto-populate author field when session is available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        author: session.user.name || session.user.githubUsername || session.user.email || ''
      }));
    }
  }, [session]);

  const categories = [
    'AI/ML',
    'Backend',
    'Blockchain',
    'DevOps',
    'Frontend',
    'Language-Go',
    'Language-Java',
    'Language-Javascript',
    'Language-Kotlin',
    'Language-Php',
    'Language-Python',
    'Language-Swift',
    'Language-Typescript',
    'Mobile',
    'Other',
    'Styling',
    'Technology-DOCKER',
    'Technology-GRAPHQL',
    'Technology-KUBERNETES',
    'Technology-MONGODB',
    'Testing'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Rule content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Rule content must be at least 100 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RuleSubmission, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addExternalLink = () => {
    if (currentLink.trim() && !formData.external_links?.includes(currentLink.trim())) {
      setFormData(prev => ({
        ...prev,
        external_links: [...(prev.external_links || []), currentLink.trim()]
      }));
      setCurrentLink('');
    }
  };

  const removeExternalLink = (linkToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      external_links: prev.external_links?.filter(link => link !== linkToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setErrors({ submit: 'Please sign in to submit a rule' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setSuccess(false);
        onCancel();
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ submit: 'Failed to submit rule. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-8"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-3 text-slate-300">Loading...</span>
        </div>
      </motion.div>
    );
  }

  // Show authentication required message if not signed in
  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-8 text-center"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Submit Your Cursor Rule</h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-lg"></div>
              <div className="relative w-16 h-16 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center">
                <Github className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Sign in Required</h3>
            <p className="text-slate-400 leading-relaxed">
              You need to sign in with your GitHub account to submit cursor rules. 
              This helps us track contributions and prevent spam.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => signIn('github')}
              className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>Sign in with GitHub</span>
            </button>
            
            <button
              onClick={onCancel}
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-6 py-3 transition-colors"
            >
              <span>Cancel</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              Your GitHub profile will be used to identify you as the author of submitted rules.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card p-8 text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-75 blur-lg animate-pulse"></div>
            <div className="relative rounded-full bg-gradient-to-r from-green-600 to-emerald-600 p-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Rule Submitted Successfully!</h3>
        <p className="text-slate-300">Thank you for contributing to the community. Your rule is now available in the database.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Submit Your Cursor Rule</h2>
          <div className="flex items-center space-x-2 mt-2">
            <img
              src={session.user?.image || '/default-avatar.png'}
              alt={session.user?.name || 'User'}
              className="w-6 h-6 rounded-full border border-slate-600"
            />
            <span className="text-sm text-slate-400">
              Submitting as {session.user?.name || session.user?.githubUsername || session.user?.email}
            </span>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{errors.submit}</span>
          </div>
        )}

        {/* Rule Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rule Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.name ? 'border-red-500' : 'border-slate-600'
            } bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            placeholder="Enter a descriptive name for your rule"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.category ? 'border-red-500' : 'border-slate-600'
            } bg-slate-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description <span className="text-red-400">*</span>
            <span className="text-slate-500 text-xs ml-2">
              ({formData.description.length}/50 min characters)
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full rounded-lg border ${
              errors.description ? 'border-red-500' : 'border-slate-600'
            } bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none`}
            placeholder="Provide a clear and detailed description of what your rule does and when to use it"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Rule Content */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rule Content <span className="text-red-400">*</span>
            <span className="text-slate-500 text-xs ml-2">
              ({formData.content.length}/100 min characters)
            </span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={8}
            className={`w-full rounded-lg border ${
              errors.content ? 'border-red-500' : 'border-slate-600'
            } bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm`}
            placeholder="Paste your .cursorrules content here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-400">{errors.content}</p>
          )}
        </div>

        {/* Author (Auto-populated, read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.author ? 'border-red-500' : 'border-slate-600'
            } bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            placeholder="Your name will be auto-populated from GitHub"
          />
          <p className="mt-1 text-xs text-slate-500">
            This is automatically filled from your GitHub profile. You can edit it if needed.
          </p>
          {errors.author && (
            <p className="mt-1 text-sm text-red-400">{errors.author}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags <span className="text-red-400">*</span>
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Add a tag (e.g., react, typescript, backend)"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 rounded-lg bg-purple-600/20 border border-purple-500/30 px-3 py-1 text-purple-300"
                  >
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-400">{errors.tags}</p>
          )}
        </div>

        {/* Usage Examples (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Usage Examples <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            value={formData.usage_examples}
            onChange={(e) => handleInputChange('usage_examples', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="Provide examples of how and when to use this rule"
          />
        </div>

        {/* Prerequisites (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Prerequisites <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            value={formData.prerequisites}
            onChange={(e) => handleInputChange('prerequisites', e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="List any prerequisites or dependencies"
          />
        </div>

        {/* Compatibility Notes (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Compatibility Notes <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            value={formData.compatibility_notes}
            onChange={(e) => handleInputChange('compatibility_notes', e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            placeholder="Note any compatibility requirements or limitations"
          />
        </div>

        {/* External Links (Optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            External Links <span className="text-slate-500">(Optional)</span>
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="url"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExternalLink())}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Add a related link (documentation, examples, etc.)"
              />
              <button
                type="button"
                onClick={addExternalLink}
                className="rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {formData.external_links && formData.external_links.length > 0 && (
              <div className="space-y-2">
                {formData.external_links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-600 rounded-lg"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm truncate flex-1"
                    >
                      {link}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(link)}
                      className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-white font-medium transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Submit Rule</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
} 