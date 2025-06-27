import { useState } from 'react';
import { RuleSubmission } from '@/types/rule';

interface SubmissionResult {
  success: boolean;
  message: string;
  rule?: {
    id: string;
    name: string;
    slug: string;
    author: string;
    category: string;
  };
}

interface UseSubmitRuleReturn {
  submitRule: (submission: RuleSubmission) => Promise<SubmissionResult>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  result: SubmissionResult | null;
  reset: () => void;
}

export function useSubmitRule(): UseSubmitRuleReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const submitRule = async (submission: RuleSubmission): Promise<SubmissionResult> => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setResult(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rule');
      }

      setSuccess(true);
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitting(false);
    setError(null);
    setSuccess(false);
    setResult(null);
  };

  return {
    submitRule,
    isSubmitting,
    error,
    success,
    result,
    reset,
  };
} 