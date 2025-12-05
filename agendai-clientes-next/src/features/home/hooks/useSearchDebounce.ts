'use client';

import { useState, useEffect } from 'react';

export const useSearchDebounce = (initialValue: string = '', delay: number = 500) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay]);

  const isSearching = searchTerm !== debouncedValue;

  return {
    searchTerm,
    debouncedValue,
    isSearching,
    setSearchTerm,
  };
};
