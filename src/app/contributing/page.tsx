'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  GitBranch, 
  Code, 
  Users, 
  CheckCircle, 
  Star,
  FileText,
  MessageSquare,
  Bug,
  Lightbulb,
  ExternalLink,
  Copy,
  Github,
  Coffee,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import { copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ContributingGuidePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const contributionTypes = [
    {
      id: 'rules',
      title: 'Submit New Rules',
      icon: FileText,
      description: 'Share your cursor rules with the community',
      color: 'from-blue-600 to-cyan-600',
      steps: [
        'Fork the repository on GitHub',
        'Create a new .cursorrules file in the appropriate category',
        'Add proper metadata and documentation',
        'Submit a pull request with clear description'
      ]
    },
    {
      id: 'improvements',
      title: 'Improve Existing Rules',
      icon: Star,
      description: 'Enhance and refine current rules',
      color: 'from-purple-600 to-pink-600',
      steps: [
        'Identify rules that need improvement',
        'Test your changes thoroughly',
        'Update documentation if needed',
        'Submit PR with detailed changelog'
      ]
    },
    {
      id: 'bugs',
      title: 'Report Issues',
      icon: Bug,
      description: 'Help us identify and fix problems',
      color: 'from-red-600 to-orange-600',
      steps: [
        'Check existing issues first',
        'Provide detailed reproduction steps',
        'Include environment information',
        'Add screenshots or logs if helpful'
      ]
    },
    {
      id: 'features',
      title: 'Suggest Features',
      icon: Lightbulb,
      description: 'Propose new features and enhancements',
      color: 'from-green-600 to-emerald-600',
      steps: [
        'Open a feature request issue',
        'Describe the use case clearly',
        'Provide mockups or examples',
        'Discuss implementation approach'
      ]
    }
  ];

  const developmentSetup = {
    prerequisites: [
      'Node.js 18+ and npm/yarn',
      'Git for version control',
      'Code editor (VS Code recommended)',
      'Basic knowledge of React/Next.js'
    ],
    commands: [
      {
        title: 'Clone the repository',
        code: 'git clone https://github.com/sk3pp3r/cursor-rules-hub.git\ncd cursor-rules-hub'
      },
      {
        title: 'Install dependencies',
        code: 'npm install\n# or\nyarn install'
      },
      {
        title: 'Start development server',
        code: 'npm run dev\n# or\nyarn dev'
      },
      {
        title: 'Run tests',
        code: 'npm test\n# or\nyarn test'
      },
      {
        title: 'Build for production',
        code: 'npm run build\n# or\nyarn build'
      }
    ]
  };

  const codeStandards = [
    {
      category: 'TypeScript',
      rules: [
        'Use explicit type annotations for function parameters and return types',
        'Prefer interfaces over type aliases for object shapes',
        'Use strict mode and enable all recommended TypeScript rules',
        'Avoid using `any` type - use proper typing or `unknown`'
      ]
    },
    {
      category: 'React Components',
      rules: [
        'Use functional components with hooks',
        'Implement proper prop types with TypeScript interfaces',
        'Use React.memo for performance optimization when needed',
        'Follow the single responsibility principle'
      ]
    },
    {
      category: 'Styling',
      rules: [
        'Use Tailwind CSS classes for styling',
        'Follow mobile-first responsive design approach',
        'Maintain consistent spacing and typography',
        'Use CSS custom properties for theme values'
      ]
    },
    {
      category: 'Code Organization',
      rules: [
        'Group related functionality in logical modules',
        'Use descriptive names for variables and functions',
        'Keep functions small and focused',
        'Add JSDoc comments for complex logic'
      ]
    }
  ];

  const ruleSubmissionGuidelines = [
    {
      title: 'Rule Quality Standards',
      items: [
        'Rules should be well-tested and production-ready',
        'Include clear documentation and usage examples',
        'Follow consistent formatting and structure',
        'Avoid overly specific or niche configurations',
        'Ensure rules are compatible with latest Cursor versions'
      ]
    },
    {
      title: 'File Organization',
      items: [
        'Place rules in appropriate category directories',
        'Use descriptive filenames (kebab-case)',
        'Include metadata in rule headers',
        'Add tags for better discoverability',
        'Provide clear rule descriptions'
      ]
    },
    {
      title: 'Documentation Requirements',
      items: [
        'Add comprehensive README for complex rules',
        'Include setup and configuration instructions',
        'Provide usage examples and screenshots',
        'Document any dependencies or prerequisites',
        'Explain the benefits and use cases'
      ]
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
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-sm"></div>
              <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Contributing Guide
            </h1>
          </div>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
            Join our community of developers and help make Cursor Rules Hub the best resource 
            for Cursor IDE configurations. Every contribution matters!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="cyber-card p-4">
              <FileText className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">326+</h3>
              <p className="text-sm text-slate-300">Rules Available</p>
            </div>
            <div className="cyber-card p-4">
              <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">50+</h3>
              <p className="text-sm text-slate-300">Contributors</p>
            </div>
            <div className="cyber-card p-4">
              <GitBranch className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">21</h3>
              <p className="text-sm text-slate-300">Categories</p>
            </div>
            <div className="cyber-card p-4">
              <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">46</h3>
              <p className="text-sm text-slate-300">Tech Tags</p>
            </div>
          </div>
        </motion.div>

        {/* Ways to Contribute */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-16"
        >
          <motion.h2 variants={item} className="text-3xl font-bold text-white mb-8 text-center">
            Ways to Contribute
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionTypes.map((type) => (
              <motion.div
                key={type.id}
                variants={item}
                className="cyber-card p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${type.color} opacity-75 blur-sm`}></div>
                    <div className={`relative rounded-lg bg-gradient-to-r ${type.color} p-2`}>
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{type.title}</h3>
                </div>

                <p className="text-slate-300 mb-4">{type.description}</p>

                <ol className="space-y-2">
                  {type.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-slate-300 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Development Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Development Setup</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prerequisites */}
            <div className="cyber-card p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Prerequisites</span>
              </h3>
              <ul className="space-y-2">
                {developmentSetup.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Start Commands */}
            <div className="cyber-card p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Quick Start</span>
              </h3>
              <div className="space-y-4">
                {developmentSetup.commands.map((command, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-300">{command.title}</h4>
                      <button
                        onClick={() => handleCopyCode(command.code, `setup-${index}`)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedCode === `setup-${index}` ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded p-3">
                      <pre className="text-sm text-slate-300">
                        <code>{command.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Code Standards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Code Standards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeStandards.map((standard, index) => (
              <div key={index} className="cyber-card p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">{standard.category}</h3>
                <ul className="space-y-2">
                  {standard.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300 text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rule Submission Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Rule Submission Guidelines</h2>

          <div className="space-y-6">
            {ruleSubmissionGuidelines.map((guideline, index) => (
              <div key={index} className="cyber-card p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">{guideline.title}</h3>
                <ul className="space-y-3">
                  {guideline.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pull Request Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Pull Request Process</h2>

          <div className="cyber-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Before Submitting</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Fork the repository and create a feature branch</li>
                  <li>• Test your changes thoroughly</li>
                  <li>• Run linting and formatting tools</li>
                  <li>• Update documentation if needed</li>
                  <li>• Add tests for new functionality</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4">PR Requirements</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Clear and descriptive title</li>
                  <li>• Detailed description of changes</li>
                  <li>• Link to related issues</li>
                  <li>• Screenshots for UI changes</li>
                  <li>• Passing CI/CD checks</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">PR Template</h4>
              <div className="bg-slate-900 rounded p-4">
                <pre className="text-sm text-slate-300">
{`## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Community Guidelines</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Do</span>
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Be respectful and inclusive</li>
                <li>• Provide constructive feedback</li>
                <li>• Help newcomers get started</li>
                <li>• Share knowledge and best practices</li>
                <li>• Follow the code of conduct</li>
              </ul>
            </div>
            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
                <Bug className="h-5 w-5" />
                <span>Don't</span>
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Use offensive or discriminatory language</li>
                <li>• Spam or self-promote excessively</li>
                <li>• Submit low-quality or untested rules</li>
                <li>• Ignore feedback or review comments</li>
                <li>• Violate intellectual property rights</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Recognition</h2>

          <div className="cyber-card p-8 text-center">
            <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">Contributors Hall of Fame</h3>
            <p className="text-slate-300 mb-6">
              We appreciate all our contributors! Your name will be added to our contributors list, 
              and significant contributions may be featured in our monthly highlights.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/sk3pp3r/cursor-rules-hub/graphs/contributors"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>View Contributors</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Get Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="cyber-card p-8 text-center"
        >
          <Coffee className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Contribute?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Join our community of developers and help make Cursor Rules Hub even better. 
            Whether you're fixing a typo or adding a major feature, every contribution counts!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/sk3pp3r/cursor-rules-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>Fork on GitHub</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/sk3pp3r/cursor-rules-hub/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Browse Issues</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 text-sm text-slate-400">
            Questions? Reach out to{' '}
            <a 
              href="https://www.linkedin.com/in/haimc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Haim Cohen
            </a>
            {' '}or open a discussion on GitHub.
          </div>
        </motion.div>
      </main>
    </div>
  );
} 