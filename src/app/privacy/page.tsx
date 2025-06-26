'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, UserCheck, FileText, Calendar } from 'lucide-react';
import Header from '@/components/Header';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Eye,
      content: [
        {
          subtitle: "Automatically Collected Information",
          items: [
            "IP address and browser information",
            "Device type and operating system",
            "Pages visited and time spent on site",
            "Referral sources and search terms",
            "Usage patterns and feature interactions"
          ]
        },
        {
          subtitle: "Information You Provide",
          items: [
            "Account registration details (if applicable)",
            "Rule submissions and contributions",
            "Comments and feedback",
            "Support communications",
            "Newsletter subscriptions"
          ]
        }
      ]
    },
    {
      id: "information-usage",
      title: "How We Use Your Information",
      icon: UserCheck,
      content: [
        {
          subtitle: "Service Provision",
          items: [
            "Provide and maintain the Cursor Rules Hub platform",
            "Process rule submissions and manage content",
            "Enable search and filtering functionality",
            "Deliver personalized recommendations",
            "Facilitate community interactions"
          ]
        },
        {
          subtitle: "Analytics and Improvement",
          items: [
            "Analyze usage patterns to improve our service",
            "Monitor performance and fix technical issues",
            "Conduct research and development",
            "Generate anonymized usage statistics",
            "Optimize user experience and interface design"
          ]
        }
      ]
    },
    {
      id: "data-sharing",
      title: "Information Sharing",
      icon: Shield,
      content: [
        {
          subtitle: "We Do Not Sell Your Data",
          items: [
            "We never sell, rent, or trade your personal information",
            "Your data is not shared with advertisers or marketers",
            "We maintain strict control over data access"
          ]
        },
        {
          subtitle: "Limited Sharing Scenarios",
          items: [
            "Legal compliance when required by law",
            "Protection of rights and safety",
            "Service providers under strict confidentiality",
            "Business transfers with equivalent privacy protection"
          ]
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: FileText,
      content: [
        {
          subtitle: "Essential Cookies",
          items: [
            "Session management and authentication",
            "Security and fraud prevention",
            "Basic functionality and preferences",
            "Load balancing and performance"
          ]
        },
        {
          subtitle: "Analytics Cookies",
          items: [
            "Google Analytics for usage insights",
            "Performance monitoring tools",
            "Error tracking and debugging",
            "Feature usage analytics"
          ]
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Security Measures",
          items: [
            "HTTPS encryption for all data transmission",
            "Secure hosting infrastructure",
            "Regular security audits and updates",
            "Access controls and authentication",
            "Data backup and recovery procedures"
          ]
        },
        {
          subtitle: "Data Retention",
          items: [
            "Active user data retained while account is active",
            "Analytics data anonymized after 26 months",
            "Support communications kept for 3 years",
            "Legal compliance data as required by law"
          ]
        }
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights",
      icon: UserCheck,
      content: [
        {
          subtitle: "Data Access and Control",
          items: [
            "Request access to your personal data",
            "Correct inaccurate or incomplete information",
            "Delete your account and associated data",
            "Export your data in portable format",
            "Opt-out of non-essential communications"
          ]
        },
        {
          subtitle: "Privacy Controls",
          items: [
            "Manage cookie preferences",
            "Control data sharing settings",
            "Update communication preferences",
            "Request data processing restrictions"
          ]
        }
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
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Privacy Policy
            </h1>
          </div>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-6">
            We take your privacy seriously. This policy explains how we collect, use, and protect 
            your information when you use the Cursor Rules Hub platform.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6 mb-12"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
              >
                <section.icon className="h-5 w-5 text-blue-400 group-hover:text-purple-400 transition-colors" />
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {index + 1}. {section.title}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {sections.map((section, sectionIndex) => (
            <motion.section
              key={section.id}
              id={section.id}
              variants={item}
              className="cyber-card p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-sm"></div>
                  <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {sectionIndex + 1}. {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.content.map((subsection, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">
                      {subsection.subtitle}
                    </h3>
                    <ul className="space-y-2">
                      {subsection.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-300 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-8 mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Privacy Questions</h3>
              <p className="text-slate-300 mb-4">
                If you have questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <ul className="space-y-2 text-slate-400">
                <li>Email: privacy@cursor-rules-hub.com</li>
                <li>GitHub: <a href="https://github.com/sk3pp3r/cursor-rules-hub/issues" className="text-blue-400 hover:text-blue-300">Report Issues</a></li>
                <li>LinkedIn: <a href="https://www.linkedin.com/in/haimc/" className="text-blue-400 hover:text-blue-300">Haim Cohen</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Policy Updates</h3>
              <p className="text-slate-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of 
                any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-slate-400">
                Continued use of our service after changes indicates acceptance of the updated policy.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 