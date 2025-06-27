'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SearchPageContent from './SearchPageContent';

// Loading component for Suspense fallback
function SearchPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="text-slate-300">Loading search...</span>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
} 