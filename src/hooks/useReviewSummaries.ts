import { useEffect, useState } from 'react';
import { accountApi, type ReviewSummary } from '../services/accountApi';

// Star ratings for product cards, fetched once per page load and shared.
let cache: Promise<Record<string, ReviewSummary>> | null = null;

const load = () => {
  cache ||= accountApi.getReviewSummaries().catch(() => {
    cache = null; // try again next time
    return {};
  });
  return cache;
};

/** Refetch after a review is written or moderated. */
export const refreshReviewSummaries = () => {
  cache = null;
};

export function useReviewSummaries(): Record<string, ReviewSummary> {
  const [summaries, setSummaries] = useState<Record<string, ReviewSummary>>({});
  useEffect(() => {
    let alive = true;
    load().then((s) => alive && setSummaries(s));
    return () => {
      alive = false;
    };
  }, []);
  return summaries;
}
