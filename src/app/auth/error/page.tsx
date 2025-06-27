'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorDetails = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          description: 'There is a problem with the server configuration. Please contact support.',
          action: 'Contact Support'
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to sign in. This might be because your account is restricted.',
          action: 'Try Different Account'
        };
      case 'Verification':
        return {
          title: 'Unable to Verify',
          description: 'The verification token has expired or has already been used.',
          action: 'Request New Verification'
        };
      case 'Default':
      default:
        return {
          title: 'Sign In Error',
          description: 'An unexpected error occurred during the sign-in process. Please try again.',
          action: 'Try Again'
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-slate-900 to-dark-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-slate-400 group-hover:text-white transition-colors">Back to home</span>
          </Link>
        </div>

        {/* Error Card */}
        <div className="cyber-card p-8">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-600/20 blur-lg"></div>
                <div className="relative w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                {errorDetails.title}
              </h1>
              <p className="text-slate-400 leading-relaxed">
                {errorDetails.description}
              </p>
              
              {error && (
                <div className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Error Code</p>
                  <p className="text-slate-300 font-mono text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 transition-colors group"
              >
                <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                <span>{errorDetails.action}</span>
              </Link>
              
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-3 transition-colors"
              >
                <span>Go to Homepage</span>
              </Link>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                If you continue to experience issues, please check our{' '}
                <Link href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
                  help documentation
                </Link>
                {' '}or contact support.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 