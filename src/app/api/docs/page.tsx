'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Key, 
  Globe, 
  Download, 
  Search,
  Filter,
  BookOpen,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function APIDocumentationPage() {
  const [activeEndpoint, setActiveEndpoint] = useState('get-rules');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const endpoints = [
    {
      id: 'get-rules',
      method: 'GET',
      path: '/api/rules',
      title: 'Get All Rules',
      description: 'Retrieve a list of all cursor rules with optional filtering and pagination',
      parameters: [
        { name: 'search', type: 'string', required: false, description: 'Search query for rule names and descriptions' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category (e.g., "Frontend", "Backend")' },
        { name: 'tags', type: 'string', required: false, description: 'Comma-separated list of tags' },
        { name: 'limit', type: 'number', required: false, description: 'Number of results to return (default: 50, max: 100)' },
        { name: 'offset', type: 'number', required: false, description: 'Number of results to skip for pagination' },
        { name: 'sort', type: 'string', required: false, description: 'Sort field: "name", "rating", "downloads", "updated_at"' },
        { name: 'order', type: 'string', required: false, description: 'Sort order: "asc" or "desc" (default: "desc")' }
      ],
      example: `curl -X GET "https://cursor-rules-hub.haimc.xyz/api/rules?search=react&category=Frontend&limit=10" \\
  -H "Accept: application/json"`,
      response: `{
  "rules": [
    {
      "id": "a1b2c3d4",
      "name": "React TypeScript Best Practices",
      "slug": "react-typescript-best-practices",
      "description": "Comprehensive rules for React with TypeScript development",
      "content": "# React TypeScript Rules\\n\\n...",
      "categories": ["Frontend", "React"],
      "tags": ["react", "typescript", "hooks", "components"],
      "author": "john_doe",
      "rating": 4.8,
      "downloads": 15420,
      "file_size": 2048,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-12-01T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 326,
    "limit": 10,
    "offset": 0,
    "has_more": true
  },
  "meta": {
    "request_id": "req_123456789",
    "response_time_ms": 45
  }
}`
    },
    {
      id: 'get-rule',
      method: 'GET',
      path: '/api/rules/{slug}',
      title: 'Get Single Rule',
      description: 'Retrieve detailed information about a specific cursor rule',
      parameters: [
        { name: 'slug', type: 'string', required: true, description: 'Unique identifier for the rule' }
      ],
      example: `curl -X GET "https://cursor-rules-hub.haimc.xyz/api/rules/react-typescript-best-practices" \\
  -H "Accept: application/json"`,
      response: `{
  "rule": {
    "id": "a1b2c3d4",
    "name": "React TypeScript Best Practices",
    "slug": "react-typescript-best-practices",
    "description": "Comprehensive rules for React with TypeScript development",
    "content": "# React TypeScript Rules\\n\\nThis rule set provides comprehensive guidelines for React development with TypeScript...\\n\\n## Key Features\\n- Component structure\\n- Hook usage\\n- Type definitions\\n- Performance optimization",
    "categories": ["Frontend", "React"],
    "tags": ["react", "typescript", "hooks", "components"],
    "author": "john_doe",
    "rating": 4.8,
    "downloads": 15420,
    "file_size": 2048,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-12-01T14:20:00Z",
    "related_rules": [
      {
        "id": "b2c3d4e5",
        "name": "Advanced React Patterns",
        "slug": "advanced-react-patterns",
        "rating": 4.6
      }
    ]
  },
  "meta": {
    "request_id": "req_123456790",
    "response_time_ms": 23
  }
}`
    },
    {
      id: 'get-categories',
      method: 'GET',
      path: '/api/categories',
      title: 'Get Categories',
      description: 'Retrieve all available rule categories with rule counts',
      parameters: [],
      example: `curl -X GET "https://cursor-rules-hub.haimc.xyz/api/categories" \\
  -H "Accept: application/json"`,
      response: `{
  "categories": [
    {
      "name": "Frontend",
      "count": 89,
      "description": "Client-side development rules and configurations"
    },
    {
      "name": "Backend",
      "count": 67,
      "description": "Server-side development and API rules"
    },
    {
      "name": "DevOps",
      "count": 34,
      "description": "Infrastructure and deployment configurations"
    }
  ],
  "total_categories": 21,
  "meta": {
    "request_id": "req_123456791",
    "response_time_ms": 12
  }
}`
    },
    {
      id: 'get-tags',
      method: 'GET',
      path: '/api/tags',
      title: 'Get Tags',
      description: 'Retrieve all available tags with usage statistics',
      parameters: [
        { name: 'popular', type: 'boolean', required: false, description: 'Return only popular tags (used in 5+ rules)' }
      ],
      example: `curl -X GET "https://cursor-rules-hub.haimc.xyz/api/tags?popular=true" \\
  -H "Accept: application/json"`,
      response: `{
  "tags": [
    {
      "name": "react",
      "count": 45,
      "category": "Frontend"
    },
    {
      "name": "typescript",
      "count": 38,
      "category": "Language"
    },
    {
      "name": "python",
      "count": 32,
      "category": "Language"
    }
  ],
  "total_tags": 46,
  "meta": {
    "request_id": "req_123456792",
    "response_time_ms": 18
  }
}`
    },
    {
      id: 'search-rules',
      method: 'GET',
      path: '/api/search',
      title: 'Advanced Search',
      description: 'Perform advanced search with fuzzy matching and ranking',
      parameters: [
        { name: 'q', type: 'string', required: true, description: 'Search query' },
        { name: 'fields', type: 'string', required: false, description: 'Fields to search: "name", "description", "content", "tags"' },
        { name: 'fuzzy', type: 'boolean', required: false, description: 'Enable fuzzy matching (default: true)' },
        { name: 'threshold', type: 'number', required: false, description: 'Minimum similarity score (0.0-1.0, default: 0.3)' },
        { name: 'limit', type: 'number', required: false, description: 'Number of results (default: 20, max: 50)' }
      ],
      example: `curl -X GET "https://cursor-rules-hub.haimc.xyz/api/search?q=react%20hooks&fuzzy=true&limit=5" \\
  -H "Accept: application/json"`,
      response: `{
  "results": [
    {
      "rule": {
        "id": "a1b2c3d4",
        "name": "React Hooks Best Practices",
        "slug": "react-hooks-best-practices",
        "description": "Essential patterns for React hooks usage",
        "categories": ["Frontend"],
        "tags": ["react", "hooks", "javascript"],
        "rating": 4.9,
        "downloads": 8930
      },
      "score": 0.95,
      "matches": [
        {
          "field": "name",
          "value": "React Hooks Best Practices",
          "indices": [[0, 5], [6, 11]]
        }
      ]
    }
  ],
  "total_results": 12,
  "query_time_ms": 34,
  "meta": {
    "request_id": "req_123456793",
    "response_time_ms": 67
  }
}`
    }
  ];

  const codeExamples = [
    {
      id: 'javascript',
      title: 'JavaScript/Node.js',
      code: `// Using fetch API
const response = await fetch('https://cursor-rules-hub.haimc.xyz/api/rules?search=react&limit=10');
const data = await response.json();

console.log(\`Found \${data.rules.length} rules\`);
data.rules.forEach(rule => {
  console.log(\`- \${rule.name} (Rating: \${rule.rating})\`);
});

// Using axios
const axios = require('axios');

const getRules = async (searchQuery) => {
  try {
    const response = await axios.get('https://cursor-rules-hub.haimc.xyz/api/rules', {
      params: {
        search: searchQuery,
        category: 'Frontend',
        sort: 'rating',
        order: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rules:', error.message);
  }
};`
    },
    {
      id: 'python',
      title: 'Python',
      code: `import requests
import json

# Basic request
response = requests.get('https://cursor-rules-hub.haimc.xyz/api/rules')
data = response.json()

print(f"Found {len(data['rules'])} rules")
for rule in data['rules']:
    print(f"- {rule['name']} (Rating: {rule['rating']})")

# Advanced search with parameters
def search_rules(query, category=None, tags=None, limit=50):
    params = {
        'search': query,
        'limit': limit
    }
    
    if category:
        params['category'] = category
    if tags:
        params['tags'] = ','.join(tags)
    
    response = requests.get(
        'https://cursor-rules-hub.haimc.xyz/api/rules',
        params=params
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# Usage
results = search_rules('react', category='Frontend', tags=['typescript', 'hooks'])
if results:
    print(f"Total results: {results['pagination']['total']}")
    for rule in results['rules']:
        print(f"- {rule['name']}")
        print(f"  Tags: {', '.join(rule['tags'])}")
        print(f"  Downloads: {rule['downloads']}")
        print()`
    },
    {
      id: 'curl',
      title: 'cURL',
      code: `# Get all rules
curl -X GET "https://cursor-rules-hub.haimc.xyz/api/rules" \\
  -H "Accept: application/json"

# Search with filters
curl -X GET "https://cursor-rules-hub.haimc.xyz/api/rules?search=react&category=Frontend&tags=typescript,hooks&limit=10" \\
  -H "Accept: application/json"

# Get specific rule
curl -X GET "https://cursor-rules-hub.haimc.xyz/api/rules/react-typescript-best-practices" \\
  -H "Accept: application/json"

# Advanced search
curl -X GET "https://cursor-rules-hub.haimc.xyz/api/search?q=react%20hooks&fuzzy=true&threshold=0.5" \\
  -H "Accept: application/json"

# Get categories
curl -X GET "https://cursor-rules-hub.haimc.xyz/api/categories" \\
  -H "Accept: application/json"

# Get popular tags
curl -X GET "https://cursor-rules-hub.haimc.xyz/api/tags?popular=true" \\
  -H "Accept: application/json"`
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
                <img 
                  src="/logo-optimized.png" 
                  alt="Cursor Rules Hub Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              API Documentation
            </h1>
          </div>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
            Comprehensive documentation for the Cursor Rules Hub API. Access our database of 326+ 
            cursor rules programmatically with powerful search and filtering capabilities.
          </p>

          {/* API Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="cyber-card p-4">
              <Globe className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Base URL</h3>
              <p className="text-sm text-slate-300 break-all">cursor-rules-hub.haimc.xyz</p>
            </div>
            <div className="cyber-card p-4">
              <Database className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Version</h3>
              <p className="text-sm text-slate-300">v1.0</p>
            </div>
            <div className="cyber-card p-4">
              <Key className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Authentication</h3>
              <p className="text-sm text-slate-300">None Required</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Get Started in 30 Seconds</h3>
              <ol className="space-y-2 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Make a GET request to <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">/api/rules</code></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Add query parameters for filtering and searching</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Parse the JSON response and integrate into your app</span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Example Response</h3>
              <div className="bg-slate-900 rounded-lg p-4 text-sm">
                <pre className="text-slate-300">
{`{
  "rules": [...],
  "pagination": {
    "total": 326,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-12"
        >
          <motion.h2 variants={item} className="text-3xl font-bold text-white mb-8">
            API Endpoints
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="cyber-card p-4 sticky top-24">
                <h3 className="font-semibold text-white mb-4">Endpoints</h3>
                <nav className="space-y-2">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeEndpoint === endpoint.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 
                          endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {endpoint.method}
                        </span>
                      </div>
                      <div className="text-sm font-medium mt-1">{endpoint.title}</div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {endpoints.map((endpoint) => (
                <motion.div
                  key={endpoint.id}
                  variants={item}
                  className={`cyber-card p-8 ${activeEndpoint === endpoint.id ? 'block' : 'hidden'}`}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 
                      endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono text-blue-300">{endpoint.path}</code>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{endpoint.title}</h3>
                  <p className="text-slate-300 mb-6">{endpoint.description}</p>

                  {/* Parameters */}
                  {endpoint.parameters.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-blue-400 mb-4">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left p-3 text-slate-300">Name</th>
                              <th className="text-left p-3 text-slate-300">Type</th>
                              <th className="text-left p-3 text-slate-300">Required</th>
                              <th className="text-left p-3 text-slate-300">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.parameters.map((param, index) => (
                              <tr key={index} className="border-b border-slate-800">
                                <td className="p-3 font-mono text-blue-300">{param.name}</td>
                                <td className="p-3 text-slate-400">{param.type}</td>
                                <td className="p-3">
                                  {param.required ? (
                                    <span className="text-red-400">Yes</span>
                                  ) : (
                                    <span className="text-slate-500">No</span>
                                  )}
                                </td>
                                <td className="p-3 text-slate-300">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Example Request */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-400">Example Request</h4>
                      <button
                        onClick={() => handleCopyCode(endpoint.example, `${endpoint.id}-request`)}
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedCode === `${endpoint.id}-request` ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span className="text-sm">Copy</span>
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{endpoint.example}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Example Response */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-400">Example Response</h4>
                      <button
                        onClick={() => handleCopyCode(endpoint.response, `${endpoint.id}-response`)}
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedCode === `${endpoint.id}-response` ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span className="text-sm">Copy</span>
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-300">
                        <code>{endpoint.response}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Code Examples</h2>
          <div className="space-y-6">
            {codeExamples.map((example) => (
              <div key={example.id} className="cyber-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-400">{example.title}</h3>
                  <button
                    onClick={() => handleCopyCode(example.code, example.id)}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedCode === example.id ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rate Limits & Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
        >
          <div className="cyber-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <span>Rate Limits</span>
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Public API:</strong> 1000 requests per hour</li>
              <li>• <strong>Search API:</strong> 500 requests per hour</li>
              <li>• <strong>Burst limit:</strong> 20 requests per minute</li>
              <li>• Rate limit headers included in responses</li>
            </ul>
          </div>

          <div className="cyber-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Best Practices</span>
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>• Cache responses when possible</li>
              <li>• Use pagination for large datasets</li>
              <li>• Implement exponential backoff for retries</li>
              <li>• Monitor rate limit headers</li>
            </ul>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Documentation</h3>
              <p className="text-slate-400 text-sm mb-3">
                Comprehensive guides and API reference
              </p>
              <a
                href="/docs"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center space-x-1"
              >
                <span>View Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="text-center">
              <Database className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">GitHub Issues</h3>
              <p className="text-slate-400 text-sm mb-3">
                Report bugs and request features
              </p>
              <a
                href="https://github.com/sk3pp3r/cursor-rules-hub/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center space-x-1"
              >
                <span>Open Issue</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Community</h3>
              <p className="text-slate-400 text-sm mb-3">
                Join discussions and get help
              </p>
              <a
                href="https://github.com/sk3pp3r/cursor-rules-hub/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center space-x-1"
              >
                <span>Join Discussion</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 