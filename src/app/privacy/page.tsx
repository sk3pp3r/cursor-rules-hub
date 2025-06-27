'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Cookie, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-blue-600 opacity-75 blur-lg animate-pulse"></div>
                <div className="relative rounded-full bg-gradient-to-r from-green-600 to-blue-600 p-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Last updated: December 2024
            </p>
          </div>
        </motion.div>

        <div className="cyber-card p-8 prose prose-invert prose-blue max-w-none">
          <div className="grid gap-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Eye className="h-6 w-6 text-blue-400" />
                <span>Information We Collect</span>
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Cursor Rules Hub collects minimal information necessary to provide our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><strong>GitHub Account Information:</strong> When you sign in with GitHub, we collect your public profile information including username, email, and avatar.</li>
                  <li><strong>Usage Data:</strong> We collect anonymized usage statistics to improve our platform, including page views and feature usage.</li>
                  <li><strong>Submitted Content:</strong> Rules, descriptions, and metadata you submit to our platform.</li>
                  <li><strong>Favorites and Interactions:</strong> Your saved rules and platform interactions to personalize your experience.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Cookie className="h-6 w-6 text-purple-400" />
                <span>How We Use Your Information</span>
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>We use collected information for:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Providing and maintaining our services</li>
                  <li>Authenticating users and managing accounts</li>
                  <li>Displaying your contributions and profile information</li>
                  <li>Improving platform functionality and user experience</li>
                  <li>Sending important service notifications</li>
                  <li>Preventing abuse and maintaining platform security</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Storage and Security</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Your data security is important to us. We implement appropriate technical and 
                  organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Data is stored securely using industry-standard encryption</li>
                  <li>Access to personal data is limited to authorized personnel only</li>
                  <li>We regularly update our security practices and systems</li>
                  <li>All data transmission is encrypted using HTTPS</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <div className="text-slate-300 space-y-4">
                <p>We use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><strong>GitHub OAuth:</strong> For authentication and profile information</li>
                  <li><strong>Vercel:</strong> For hosting and analytics</li>
                  <li><strong>Analytics Services:</strong> For usage statistics (anonymized)</li>
                </ul>
                <p>
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <div className="text-slate-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your submitted content</li>
                  <li>Opt-out of non-essential communications</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information below.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We retain your information only as long as necessary to provide our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Account information is retained while your account is active</li>
                  <li>Submitted rules remain public unless you request removal</li>
                  <li>Usage analytics are anonymized and aggregated</li>
                  <li>Deleted accounts are purged within 30 days</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We use minimal cookies and tracking technologies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Session cookies for authentication</li>
                  <li>Preference cookies for user settings</li>
                  <li>Analytics cookies for usage insights (anonymized)</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  We may update this privacy policy from time to time. We will notify users of 
                  significant changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li>Posting the updated policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending email notifications for material changes</li>
                </ul>
              </div>
            </section>

            <section className="border-t border-slate-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                <Mail className="h-6 w-6 text-green-400" />
                <span>Contact Us</span>
              </h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  If you have questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <p className="text-slate-400">
                    <strong>Email:</strong> privacy@cursor-rules-hub.com<br />
                    <strong>GitHub:</strong> <a href="https://github.com/PatrickJS/awesome-cursorrules" className="text-blue-400 hover:text-blue-300">Open an issue</a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 