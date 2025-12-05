'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface DataCacheContextType {
  getCache: <T>(key: string) => T | null;
  setCache: <T>(key: string, data: T) => void;
  clearCache: (key?: string) => void;
  isCacheValid: (key: string, maxAge?: number) => boolean;
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined);

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutos

export const DataCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cacheRef = useRef<Map<string, CacheEntry<any>>>(new Map());

  const getCache = useCallback(<T,>(key: string): T | null => {
    const entry = cacheRef.current.get(key);
    return entry ? entry.data : null;
  }, []);

  const setCache = useCallback(<T,>(key: string, data: T) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  const isCacheValid = useCallback((key: string, maxAge: number = DEFAULT_CACHE_TIME): boolean => {
    const entry = cacheRef.current.get(key);
    if (!entry) return false;
    
    const age = Date.now() - entry.timestamp;
    return age < maxAge;
  }, []);

  return (
    <DataCacheContext.Provider value={{ getCache, setCache, clearCache, isCacheValid }}>
      {children}
    </DataCacheContext.Provider>
  );
};

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error('useDataCache must be used within a DataCacheProvider');
  }
  return context;
};
