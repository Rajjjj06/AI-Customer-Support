import { useState, useEffect, useCallback } from 'react';
import { getMySubscription } from '@/services/subscription';

// Plan limits — mirrors backend PLANS constant
export const PLAN_LIMITS = {
  starter:    { chatbots: 1,         documents: 50,        messages: 500,     label: 'Starter' },
  pro:        { chatbots: 5,         documents: 500,       messages: 10000,   label: 'Pro' },
  enterprise: { chatbots: Infinity,  documents: Infinity,  messages: Infinity, label: 'Enterprise' },
};

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const sub = await getMySubscription();
      setSubscription(sub);
    } catch (e) {
      console.error('Failed to fetch subscription', e);
      // Default to starter silently
      setSubscription({ plan: 'starter', status: 'active' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const plan = subscription?.plan || 'starter';
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.starter;

  const isAtLimit = (resource, currentCount) => {
    const limit = limits[resource];
    if (limit === Infinity) return false;
    return currentCount >= limit;
  };

  const usagePercent = (resource, currentCount) => {
    const limit = limits[resource];
    if (limit === Infinity) return 0;
    return Math.min(100, Math.round((currentCount / limit) * 100));
  };

  return { subscription, loading, plan, limits, isAtLimit, usagePercent, refetch: fetch };
}
