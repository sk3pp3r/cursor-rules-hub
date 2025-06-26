'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  Code2, 
  Users, 
  Heart, 
  Star,
  GitPullRequest,
  Bug,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Download,
  Terminal,
  FileText,
  Shield,
  Award,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/Header';
import { copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ContributingPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [copiedCode, setCopiedCode] = useState<string>('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleCopyCode = async (code: string, id: string) => {
    await copyToClipboard(code);
    setCopiedCode(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const codeBlocks = {
    setup: `# Clone the repository
git clone https://github.com/sk3pp3r/cursor-rules-hub.git
cd cursor-rules-hub

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser
open http://localhost:3000`,

    branch: `# Create a new feature branch
git checkout -b feature/amazing-new-feature

# Or for bug fixes
git checkout -b fix/important-bug-fix

# Or for documentation
git checkout -b docs/improve-readme`,

    commit: `# Stage your changes
git add .

# Commit with conventional format
git commit -m "feat: add amazing new feature"

# Push to your fork
git push origin feature/amazing-new-feature`,

    testing: `# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build to ensure everything works
npm run build`,

    ruleDevelopment: `// Example: Adding a new cursor rule
// File: src/data/new-rule.cursorrules

# Python FastAPI Development Rules

You are an expert Python FastAPI developer with deep knowledge of:
- FastAPI framework and async programming
- Pydantic models and data validation
- SQLAlchemy ORM and database management
- Modern Python practices and type hints

## Core Principles
- Write clean, readable, and maintainable code
- Follow PEP 8 style guidelines
- Use type hints for all function parameters and returns
- Implement proper error handling and validation
- Write comprehensive tests for all endpoints

## FastAPI Best Practices
- Use dependency injection for database sessions
- Implement proper authentication and authorization
- Structure your application with routers and dependencies
- Use Pydantic models for request/response validation
- Handle exceptions gracefully with custom exception handlers

...continue with specific rules...`,

    componentExample: `// Example: Creating a new component
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Download } from 'lucide-react';

interface RuleStatsProps {
  rating: number;
  downloads: number;
  className?: string;
}

export default function RuleStats({ rating, downloads, className }: RuleStatsProps) {
  return (
    <motion.div 
      className={\`flex items-center space-x-4 \${className}\`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-white font-medium">{rating.toFixed(1)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Download className="h-4 w-4 text-blue-400" />
        <span className="text-slate-300">{downloads.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}`
  };

  const contributionTypes = [
    {
      icon: Code2,
      title: 'Code Contributions',
      description: 'Add new features, fix bugs, or improve existing functionality',
      examples: ['New cursor rules', 'UI improvements', 'Performance optimizations', 'Bug fixes'],
      color: 'from-blue-600 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Help improve our documentation and guides',
      examples: ['API documentation', 'Tutorials', 'README improvements', 'Code comments'],
      color: 'from-green-600 to-blue-600'
    },
    {
      icon: Bug,
      title: 'Bug Reports',
      description: 'Help us identify and fix issues',
      examples: ['Detailed bug reports', 'Reproduction steps', 'Screenshots', 'Error logs'],
      color: 'from-red-600 to-pink-600'
    },
    {
      icon: Lightbulb,
      title: 'Feature Requests',
      description: 'Suggest new features and improvements',
      examples: ['New rule categories', 'Search improvements', 'UI enhancements', 'API features'],
      color: 'from-yellow-600 to-orange-600'
    }
  ];

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Download,
      content: (
        <div className="space-y-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 text-lg leading-relaxed">
              Welcome to the Cursor Rules Hub community! We're excited to have you contribute to making 
              this the best platform for Cursor IDE rules and configurations. Whether you're fixing a bug, 
              adding a new feature, or improving documentation, every contribution matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-6 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-5`}></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{type.title}</h3>
                  </div>
                  <p className="text-slate-400 mb-4">{type.description}</p>
                  <ul className="space-y-1">
                    {type.examples.map((example) => (
                      <li key={example} className="text-sm text-slate-500 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Terminal className="h-5 w-5 text-blue-400 mr-2" />
              Quick Setup
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <button
                onClick={() => handleCopyCode(codeBlocks.setup, 'setup')}
                className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
              >
                {copiedCode === 'setup' ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </button>
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{codeBlocks.setup}</code>
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'development-workflow',
      title: 'Development Workflow',
      icon: GitBranch,
      content: (
        <div className="space-y-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300">
              We follow a structured development workflow to ensure code quality and smooth collaboration. 
              Here's the step-by-step process for contributing to the project.
            </p>
          </div>

          <div className="space-y-6">
            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                Fork and Clone
              </h3>
              <p className="text-slate-400 mb-4">
                Start by forking the repository on GitHub and cloning it locally.
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <code className="text-blue-400">
                  Fork the repo → Clone your fork → Add upstream remote
                </code>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                Create Feature Branch
              </h3>
              <p className="text-slate-400 mb-4">
                Create a descriptive branch name that explains what you're working on.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 relative">
                <button
                  onClick={() => handleCopyCode(codeBlocks.branch, 'branch')}
                  className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copiedCode === 'branch' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{codeBlocks.branch}</code>
                </pre>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                Develop and Test
              </h3>
              <p className="text-slate-400 mb-4">
                Make your changes, write tests, and ensure everything works correctly.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 relative">
                <button
                  onClick={() => handleCopyCode(codeBlocks.testing, 'testing')}
                  className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copiedCode === 'testing' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{codeBlocks.testing}</code>
                </pre>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">4</span>
                Commit and Push
              </h3>
              <p className="text-slate-400 mb-4">
                Use conventional commit messages and push your changes.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 relative">
                <button
                  onClick={() => handleCopyCode(codeBlocks.commit, 'commit')}
                  className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copiedCode === 'commit' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                <pre className="text-sm text-slate-300 overflow-x-auto">
                  <code>{codeBlocks.commit}</code>
                </pre>
              </div>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">5</span>
                Create Pull Request
              </h3>
              <p className="text-slate-400 mb-4">
                Open a pull request with a clear title and description of your changes.
              </p>
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="space-y-2 text-sm text-slate-300">
                  <div>✅ Clear, descriptive title</div>
                  <div>✅ Detailed description of changes</div>
                  <div>✅ Screenshots for UI changes</div>
                  <div>✅ Link to related issues</div>
                  <div>✅ Test results and verification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'code-standards',
      title: 'Code Standards',
      icon: Shield,
      content: (
        <div className="space-y-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300">
              We maintain high code quality standards to ensure consistency, readability, and maintainability. 
              Please follow these guidelines when contributing to the project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">TypeScript Standards</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Use explicit type annotations for function parameters and returns</li>
                <li>• Prefer interfaces over types for object shapes</li>
                <li>• Use strict mode and enable all recommended rules</li>
                <li>• Avoid any type unless absolutely necessary</li>
                <li>• Use proper generic constraints</li>
              </ul>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">React Best Practices</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Use functional components with hooks</li>
                <li>• Implement proper prop validation with TypeScript</li>
                <li>• Use React.memo for performance optimization</li>
                <li>• Keep components small and focused</li>
                <li>• Use custom hooks for shared logic</li>
              </ul>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Styling Guidelines</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Use Tailwind CSS for all styling</li>
                <li>• Follow the established color palette</li>
                <li>• Implement responsive design mobile-first</li>
                <li>• Use semantic HTML elements</li>
                <li>• Add proper ARIA labels for accessibility</li>
              </ul>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Testing Requirements</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Write unit tests for all utility functions</li>
                <li>• Add component tests for complex components</li>
                <li>• Test error states and edge cases</li>
                <li>• Maintain >80% code coverage</li>
                <li>• Use meaningful test descriptions</li>
              </ul>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Example Component Structure</h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <button
                onClick={() => handleCopyCode(codeBlocks.componentExample, 'component')}
                className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
              >
                {copiedCode === 'component' ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </button>
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{codeBlocks.componentExample}</code>
              </pre>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-300 font-medium mb-1">Automated Code Quality</h4>
                <p className="text-blue-200 text-sm">
                  We use ESLint, Prettier, and TypeScript compiler to automatically enforce code standards. 
                  Run <code className="bg-blue-900/30 px-1 rounded">npm run lint</code> before committing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cursor-rules',
      title: 'Adding Cursor Rules',
      icon: FileText,
      content: (
        <div className="space-y-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300">
              Contributing new cursor rules is one of the most valuable ways to help the community. 
              Here's how to create high-quality cursor rules that will be useful for other developers.
            </p>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rule Development Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">✅ Good Practices</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Clear, specific rule descriptions</li>
                  <li>• Include practical examples</li>
                  <li>• Cover edge cases and best practices</li>
                  <li>• Use consistent formatting</li>
                  <li>• Test rules in real projects</li>
                  <li>• Provide context and reasoning</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">❌ Avoid These</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Vague or generic rules</li>
                  <li>• Conflicting guidelines</li>
                  <li>• Outdated practices</li>
                  <li>• Copy-paste without testing</li>
                  <li>• Missing context or examples</li>
                  <li>• Overly complex rules</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Example Rule Structure</h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <button
                onClick={() => handleCopyCode(codeBlocks.ruleDevelopment, 'rule')}
                className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
              >
                {copiedCode === 'rule' ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </button>
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{codeBlocks.ruleDevelopment}</code>
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cyber-card p-6">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <FileText className="h-4 w-4 text-blue-400 mr-2" />
                Rule Categories
              </h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Frontend (React, Vue, Angular)</li>
                <li>• Backend (Node.js, Python, Go)</li>
                <li>• Database (SQL, NoSQL)</li>
                <li>• DevOps (Docker, CI/CD)</li>
                <li>• Mobile (React Native, Flutter)</li>
                <li>• Testing (Jest, Cypress)</li>
              </ul>
            </div>

            <div className="cyber-card p-6">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                Quality Criteria
              </h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Actionable and specific</li>
                <li>• Well-documented with examples</li>
                <li>• Based on best practices</li>
                <li>• Tested and validated</li>
                <li>• Properly categorized</li>
                <li>• Community reviewed</li>
              </ul>
            </div>

            <div className="cyber-card p-6">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Award className="h-4 w-4 text-green-400 mr-2" />
                Submission Process
              </h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Create rule file</li>
                <li>• Add to database</li>
                <li>• Include metadata</li>
                <li>• Write description</li>
                <li>• Submit pull request</li>
                <li>• Community review</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'community',
      title: 'Community Guidelines',
      icon: Users,
      content: (
        <div className="space-y-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300">
              Our community is built on mutual respect, collaboration, and shared learning. 
              We're committed to creating an inclusive environment where everyone can contribute and grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Heart className="h-5 w-5 text-red-400 mr-2" />
                Our Values
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Inclusivity:</strong> Welcome developers of all skill levels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Respect:</strong> Treat everyone with kindness and professionalism</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Learning:</strong> Share knowledge and help others grow</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>Quality:</strong> Strive for excellence in everything we build</span>
                </li>
              </ul>
            </div>

            <div className="cyber-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-400 mr-2" />
                Code of Conduct
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Be welcoming to newcomers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Provide constructive feedback</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Focus on the code, not the person</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Ask questions when unsure</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Communication Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://github.com/sk3pp3r/cursor-rules-hub/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">Discussions</div>
                  <div className="text-sm text-slate-400">General questions & ideas</div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>

              <a
                href="https://github.com/sk3pp3r/cursor-rules-hub/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Bug className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-white font-medium">Issues</div>
                  <div className="text-sm text-slate-400">Bug reports & features</div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>

              <a
                href="https://github.com/sk3pp3r/cursor-rules-hub/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <GitPullRequest className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Pull Requests</div>
                  <div className="text-sm text-slate-400">Code contributions</div>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              Recognition & Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-2">Contributor Levels</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>🥉 <strong>Bronze:</strong> First contribution</li>
                  <li>🥈 <strong>Silver:</strong> 5+ contributions</li>
                  <li>🥇 <strong>Gold:</strong> 15+ contributions</li>
                  <li>💎 <strong>Diamond:</strong> Core team member</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Special Recognition</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>📝 Rule author credits</li>
                  <li>🏆 Monthly contributor highlights</li>
                  <li>🎖️ Special badges for quality contributions</li>
                  <li>📚 Documentation in contributor hall of fame</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contributing Guide
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Join our community of developers making Cursor IDE more powerful. 
            Learn how to contribute code, documentation, cursor rules, and help shape the future of AI-enhanced development.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      expandedSections.includes(section.id)
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {sections.map((section) => (
              expandedSections.includes(section.id) && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-12"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <section.icon className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              )
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16 cyber-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Contribute?</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Join our community and help make Cursor Rules Hub the best platform for AI-enhanced development. 
            Every contribution, no matter how small, makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/sk3pp3r/cursor-rules-hub/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
            >
              <GitBranch className="h-5 w-5" />
              <span>Fork Repository</span>
            </a>
            <a
              href="https://github.com/sk3pp3r/cursor-rules-hub/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-medium rounded-lg transition-all"
            >
              <Lightbulb className="h-5 w-5" />
              <span>Suggest Feature</span>
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 