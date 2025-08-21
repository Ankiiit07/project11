import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
  maxResults?: number;
}

export const useDebouncedSearch = <T>(
  items: T[],
  searchKey: keyof T,
  options: UseDebouncedSearchOptions = {}
) => {
  const {
    delay = 300,
    minLength = 2,
    maxResults = 50,
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounced search term update
  const debouncedSetSearchTerm = useMemo(
    () => debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, delay),
    [delay]
  );

  // Update search term and trigger debounced search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSetSearchTerm(term);
  }, [debouncedSetSearchTerm]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    debouncedSetSearchTerm.cancel();
  }, [debouncedSetSearchTerm]);

  // Memoized filtered results
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minLength) {
      return items.slice(0, maxResults);
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return items
      .filter((item) => {
        const value = item[searchKey];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchLower);
        }
        return false;
      })
      .slice(0, maxResults);
  }, [items, searchKey, debouncedSearchTerm, minLength, maxResults]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    filteredItems,
    handleSearch,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm,
    hasResults: filteredItems.length > 0,
    totalResults: filteredItems.length,
  };
};

// Optimized search with multiple keys
export const useMultiKeySearch = <T>(
  items: T[],
  searchKeys: (keyof T)[],
  options: UseDebouncedSearchOptions = {}
) => {
  const {
    delay = 300,
    minLength = 2,
    maxResults = 50,
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debouncedSetSearchTerm = useMemo(
    () => debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, delay),
    [delay]
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSetSearchTerm(term);
  }, [debouncedSetSearchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    debouncedSetSearchTerm.cancel();
  }, [debouncedSetSearchTerm]);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minLength) {
      return items.slice(0, maxResults);
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return items
      .filter((item) => {
        return searchKeys.some((key) => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchLower);
          }
          return false;
        });
      })
      .slice(0, maxResults);
  }, [items, searchKeys, debouncedSearchTerm, minLength, maxResults]);

  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    filteredItems,
    handleSearch,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm,
    hasResults: filteredItems.length > 0,
    totalResults: filteredItems.length,
  };
}; 