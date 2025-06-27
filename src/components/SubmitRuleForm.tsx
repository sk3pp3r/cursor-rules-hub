'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { RuleSubmission } from '@/types/rule';

interface SubmitRuleFormProps {
  onSubmit: (submission: RuleSubmission) => Promise<void>;
  onCancel: () => void;
}

export default function SubmitRuleForm({ onSubmit, onCancel }: SubmitRuleFormProps) {
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
        <p className="text-slate-300">Thank you for contributing to the community. Your rule will be reviewed and published soon.</p>
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
        <h2 className="text-2xl font-bold text-white">Submit Your Cursor Rule</h2>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rule Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.name ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
            placeholder="Enter a descriptive name for your rule"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </p>
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
            className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.category ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.description ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-vertical`}
            placeholder="Provide a detailed description of what your rule does and its benefits (minimum 50 characters)"
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                {formData.description.length}/50 characters minimum
              </p>
            )}
          </div>
        </div>

        {/* Rule Content */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rule Content <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={8}
            className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.content ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-vertical font-mono text-sm`}
            placeholder="Paste your .cursorrules content here (minimum 100 characters)"
          />
          <div className="flex justify-between mt-1">
            {errors.content ? (
              <p className="text-sm text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.content}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                {formData.content.length}/100 characters minimum
              </p>
            )}
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.author ? 'border-red-500' : 'border-slate-600'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors`}
            placeholder="Your name or username"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.author}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags <span className="text-red-400">*</span>
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Add a tag (e.g., react, typescript, ai)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-400 hover:text-blue-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.tags && (
            <p className="mt-1 text-sm text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.tags}
            </p>
          )}
        </div>

        {/* Usage Examples */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Usage Examples <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            value={formData.usage_examples}
            onChange={(e) => handleInputChange('usage_examples', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-vertical"
            placeholder="Provide examples of how to use this rule effectively"
          />
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Prerequisites <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            value={formData.prerequisites}
            onChange={(e) => handleInputChange('prerequisites', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-vertical"
            placeholder="List any prerequisites or dependencies"
          />
        </div>

        {/* Compatibility Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Compatibility Notes <span className="text-slate-500">(Optional)</span>
          </label>
          <textarea
            value={formData.compatibility_notes}
            onChange={(e) => handleInputChange('compatibility_notes', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-vertical"
            placeholder="Notes about compatibility with different editors, versions, or platforms"
          />
        </div>

        {/* External Links */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            External Links <span className="text-slate-500">(Optional)</span>
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="url"
              value={currentLink}
              onChange={(e) => setCurrentLink(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExternalLink())}
              className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Add a related link (e.g., documentation, repository)"
            />
            <button
              type="button"
              onClick={addExternalLink}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {formData.external_links && formData.external_links.length > 0 && (
            <div className="space-y-2">
              {formData.external_links.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-sm truncate flex-1"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeExternalLink(link)}
                    className="ml-2 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Submit Rule
              </>
            )}
          </button>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-400 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.submit}
          </p>
        )}
      </form>
    </motion.div>
  );
} 