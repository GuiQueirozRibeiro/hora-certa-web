import { useState, useCallback } from 'react';

export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface DebugLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

/**
 * Hook para gerenciar logs de debug
 * Uso: const debug = useDebug();
 */
export function useDebug() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  const addLog = useCallback((message: string, level: LogLevel = 'info', data?: any) => {
    if (!isEnabled) return;

    const log: DebugLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level,
      message,
      data,
    };

    setLogs(prev => [...prev, log]);
    
    // Também loga no console do navegador
    const emoji = {
      info: '📘',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    }[level];
    
    console.log(`${emoji} [${log.timestamp}] ${message}`, data || '');
  }, [isEnabled]);

  const info = useCallback((message: string, data?: any) => {
    addLog(message, 'info', data);
  }, [addLog]);

  const success = useCallback((message: string, data?: any) => {
    addLog(message, 'success', data);
  }, [addLog]);

  const warning = useCallback((message: string, data?: any) => {
    addLog(message, 'warning', data);
  }, [addLog]);

  const error = useCallback((message: string, data?: any) => {
    addLog(message, 'error', data);
  }, [addLog]);

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    logs,
    isEnabled,
    addLog,
    info,
    success,
    warning,
    error,
    clear,
    toggle,
  };
}