'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Users, CheckCircle, Calendar } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "January 1, 2025";
  const effectiveDate = "January 1, 2025";

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: [
        {
          subtitle: "Agreement to Terms",
          items: [
            "By accessing or using Cursor Rules Hub, you agree to be bound by these Terms of Service",
            "If you disagree with any part of these terms, you may not access or use our service",
            "These terms apply to all visitors, users, and contributors to the platform",
            "Your continued use of the service constitutes acceptance of any updates to these terms"
          ]
        },
        {
          subtitle: "Eligibility",
          items: [
            "You must be at least 13 years old to use this service",
            "You must provide accurate and complete information when creating an account",
            "You are responsible for maintaining the security of your account",
            "One person or legal entity may maintain only one account"
          ]
        }
      ]
    },
    {
      id: "service-description",
      title: "Service Description",
      icon: FileText,
      content: [
        {
          subtitle: "Platform Purpose",
          items: [
            "Cursor Rules Hub is a platform for sharing and discovering Cursor IDE rules and configurations",
            "We provide tools for searching, categorizing, and managing cursor rules",
            "The platform facilitates community collaboration and knowledge sharing",
            "We offer API access for developers to integrate with our rule database"
          ]
        },
        {
          subtitle: "Service Availability",
          items: [
            "We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service",
            "Scheduled maintenance will be announced in advance when possible",
            "We reserve the right to modify or discontinue features with notice",
            "Emergency maintenance may occur without prior notice for security reasons"
          ]
        }
      ]
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      icon: Users,
      content: [
        {
          subtitle: "Acceptable Use",
          items: [
            "Use the service only for lawful purposes and in accordance with these terms",
            "Respect intellectual property rights of others",
            "Do not upload malicious code, viruses, or harmful content",
            "Maintain respectful and professional communication with other users",
            "Report security vulnerabilities responsibly through proper channels"
          ]
        },
        {
          subtitle: "Prohibited Activities",
          items: [
            "Attempting to gain unauthorized access to our systems or other users' accounts",
            "Using automated tools to scrape or harvest data without permission",
            "Uploading content that violates copyright, trademark, or other intellectual property rights",
            "Posting spam, advertisements, or irrelevant promotional content",
            "Engaging in harassment, abuse, or discriminatory behavior toward other users"
          ]
        }
      ]
    },
    {
      id: "content-rules",
      title: "Content and Intellectual Property",
      icon: Shield,
      content: [
        {
          subtitle: "User-Generated Content",
          items: [
            "You retain ownership of the original content you submit to our platform",
            "By submitting content, you grant us a license to use, display, and distribute it",
            "You represent that you have the right to submit and share your content",
            "We may remove content that violates these terms or applicable laws",
            "You are responsible for backing up your own content"
          ]
        },
        {
          subtitle: "Platform Content",
          items: [
            "Our platform design, features, and original content are protected by intellectual property laws",
            "You may not copy, modify, or create derivative works of our platform without permission",
            "Third-party content is subject to the respective owners' terms and licenses",
            "We respect DMCA and other intellectual property protection mechanisms"
          ]
        }
      ]
    },
    {
      id: "privacy-data",
      title: "Privacy and Data Protection",
      icon: Shield,
      content: [
        {
          subtitle: "Data Collection",
          items: [
            "We collect and process data as described in our Privacy Policy",
            "You consent to our data practices by using the service",
            "We implement appropriate security measures to protect your data",
            "You may request access to, correction of, or deletion of your personal data"
          ]
        },
        {
          subtitle: "Cookies and Tracking",
          items: [
            "We use cookies and similar technologies to enhance your experience",
            "You can control cookie preferences through your browser settings",
            "Some features may not function properly if cookies are disabled",
            "Third-party services may set their own cookies with your consent"
          ]
        }
      ]
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitations",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Service Disclaimers",
          items: [
            "The service is provided 'as is' without warranties of any kind",
            "We do not guarantee the accuracy, completeness, or reliability of user-generated content",
            "We are not responsible for the quality or effectiveness of shared cursor rules",
            "Use of third-party integrations and APIs is at your own risk",
            "We disclaim liability for any damages resulting from service use"
          ]
        },
        {
          subtitle: "Limitation of Liability",
          items: [
            "Our liability is limited to the maximum extent permitted by law",
            "We are not liable for indirect, incidental, or consequential damages",
            "Our total liability shall not exceed the amount you paid for the service (if any)",
            "Some jurisdictions do not allow limitation of liability, so these limits may not apply to you"
          ]
        }
      ]
    },
    {
      id: "termination",
      title: "Account Termination",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Termination by You",
          items: [
            "You may terminate your account at any time by contacting us",
            "Upon termination, your access to the service will be immediately revoked",
            "You remain responsible for any outstanding obligations",
            "Some provisions of these terms survive account termination"
          ]
        },
        {
          subtitle: "Termination by Us",
          items: [
            "We may suspend or terminate accounts that violate these terms",
            "We may terminate accounts for prolonged inactivity",
            "We will provide notice when reasonably possible before termination",
            "We reserve the right to refuse service to anyone for any reason"
          ]
        }
      ]
    },
    {
      id: "legal",
      title: "Legal Provisions",
      icon: Scale,
      content: [
        {
          subtitle: "Governing Law",
          items: [
            "These terms are governed by the laws of the jurisdiction where we operate",
            "Any disputes will be resolved in the courts of competent jurisdiction",
            "If any provision is found unenforceable, the remainder remains in effect",
            "These terms constitute the entire agreement between you and us"
          ]
        },
        {
          subtitle: "Changes to Terms",
          items: [
            "We may update these terms from time to time with notice",
            "Material changes will be announced prominently on our platform",
            "Continued use after changes constitutes acceptance of new terms",
            "You should review these terms periodically for updates"
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Terms of Service
            </h1>
          </div>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-6">
            These Terms of Service govern your use of the Cursor Rules Hub platform. 
            Please read them carefully before using our service.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Effective: {effectiveDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6 mb-12 border-l-4 border-blue-500"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white">Respectful Use</h3>
                <p className="text-sm text-slate-400">Use our platform respectfully and lawfully</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white">Your Content</h3>
                <p className="text-sm text-slate-400">You own your content, we can display it</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white">No Warranties</h3>
                <p className="text-sm text-slate-400">Service provided "as is" without guarantees</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
          <h2 className="text-2xl font-bold text-white mb-6">Questions or Concerns?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Contact Information</h3>
              <p className="text-slate-300 mb-4">
                If you have questions about these Terms of Service or need clarification, 
                please don't hesitate to reach out:
              </p>
              <ul className="space-y-2 text-slate-400">
                <li>Email: legal@cursor-rules-hub.com</li>
                <li>GitHub: <a href="https://github.com/sk3pp3r/cursor-rules-hub/issues" className="text-blue-400 hover:text-blue-300">Report Issues</a></li>
                <li>LinkedIn: <a href="https://www.linkedin.com/in/haimc/" className="text-blue-400 hover:text-blue-300">Haim Cohen</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Legal Notice</h3>
              <p className="text-slate-300 mb-4">
                These terms are legally binding. If you do not agree with any provision, 
                please discontinue use of our service immediately.
              </p>
              <p className="text-slate-400">
                We recommend consulting with legal counsel if you have concerns about 
                how these terms may affect your specific situation.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 