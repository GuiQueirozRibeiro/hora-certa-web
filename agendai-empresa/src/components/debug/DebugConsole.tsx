'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Download, Minimize2, Maximize2, Eye, EyeOff, Settings } from 'lucide-react';
import type { DebugLog } from '@/hooks/useDebug';

interface DebugConsoleProps {
  logs: DebugLog[];
  isEnabled?: boolean;
  onClear?: () => void;
  onToggle?: () => void;
  position?: 'right' | 'left' | 'bottom' | 'floating';
  defaultMinimized?: boolean;
}

type PositionType = 'right' | 'left' | 'bottom' | 'floating';

/**
 * Componente de console de debug reutilizável
 * 
 * @example
 * const debug = useDebug();
 * 
 * <DebugConsole 
 *   logs={debug.logs}
 *   isEnabled={debug.isEnabled}
 *   onClear={debug.clear}
 *   onToggle={debug.toggle}
 *   position="right"
 * />
 */
export function DebugConsole({
  logs,
  isEnabled = true,
  onClear,
  onToggle,
  position: initialPosition = 'right',
  defaultMinimized = false,
}: DebugConsoleProps) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [isClosed, setIsClosed] = useState(false);
  const [position, setPosition] = useState<PositionType>(initialPosition);
  const [showPositionMenu, setShowPositionMenu] = useState(false);

  // Dragging state
  const [dragPosition, setDragPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Initialize position on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDragPosition({
        x: window.innerWidth - 400,
        y: window.innerHeight - 520
      });
    }
  }, []);

  // Handle drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setDragPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (position !== 'floating') return;
    
    // Only allow dragging from the header area (not buttons)
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).closest('.debug-console')?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Se foi fechado, renderiza apenas botão de reabrir
  if (isClosed) {
    return (
      <button
        onClick={() => setIsClosed(false)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
        title="Abrir Debug Console"
      >
        <span className="text-lg">🐛</span>
        <span className="text-sm font-semibold">Debug</span>
      </button>
    );
  }

  // Ícones e cores por nível
  const getLevelConfig = (level: string) => {
    const configs = {
      info: { icon: '📘', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
      success: { icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
      warning: { icon: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
      error: { icon: '❌', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    };
    return configs[level as keyof typeof configs] || configs.info;
  };

  // Estilos de posicionamento
  const positionStyles = {
    right: 'fixed top-0 right-0 h-screen w-96 border-l',
    left: 'fixed top-0 left-0 h-screen w-96 border-r',
    bottom: 'fixed bottom-0 left-0 right-0 h-64 border-t',
    floating: 'fixed w-96 h-[500px] rounded-lg border shadow-2xl',
  };

  // Download dos logs
  const downloadLogs = () => {
    const content = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.data ? '\nData: ' + JSON.stringify(log.data, null, 2) : ''}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`debug-console ${positionStyles[position]} bg-black/95 backdrop-blur-sm z-50 flex flex-col ${isDragging ? 'cursor-grabbing select-none' : ''}`}
      style={position === 'floating' ? { left: dragPosition.x, top: dragPosition.y } : undefined}
    >
      {/* Header */}
      <div 
        className={`shrink-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between ${position === 'floating' ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-emerald-400">🐛 Debug Console</h3>
          <span className="text-xs text-zinc-500">({logs.length} logs)</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Enable/Disable */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
              title={isEnabled ? 'Pausar logs' : 'Retomar logs'}
            >
              {isEnabled ? (
                <Eye className="w-4 h-4 text-emerald-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-zinc-500" />
              )}
            </button>
          )}

          {/* Download */}
          <button
            onClick={downloadLogs}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
            title="Download logs"
          >
            <Download className="w-4 h-4 text-zinc-400" />
          </button>

          {/* Clear */}
          {onClear && (
            <button
              onClick={onClear}
              className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
              title="Limpar logs"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" />
            </button>
          )}

          {/* Position Settings */}
          <div className="relative">
            <button
              onClick={() => setShowPositionMenu(!showPositionMenu)}
              className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
              title="Configurar posição"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
            </button>
            
            {showPositionMenu && (
              <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 min-w-[150px] z-50">
                <p className="text-xs text-zinc-500 mb-2 px-2">Posição:</p>
                <button
                  onClick={() => {
                    setPosition('right');
                    setShowPositionMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    position === 'right' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  → Direita
                </button>
                <button
                  onClick={() => {
                    setPosition('left');
                    setShowPositionMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    position === 'left' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  ← Esquerda
                </button>
                <button
                  onClick={() => {
                    setPosition('bottom');
                    setShowPositionMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    position === 'bottom' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  ↓ Inferior
                </button>
                <button
                  onClick={() => {
                    setPosition('floating');
                    setShowPositionMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    position === 'floating' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  ⭕ Flutuante
                </button>
              </div>
            )}
          </div>

          {/* Minimize/Maximize */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-zinc-400" />
            ) : (
              <Minimize2 className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={() => setIsClosed(true)}
            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!isEnabled && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
              <p className="text-yellow-400 text-sm">⏸️ Debug pausado</p>
            </div>
          )}

          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500 text-sm italic">Aguardando logs...</p>
            </div>
          ) : (
            logs.map((log) => {
              const config = getLevelConfig(log.level);
              return (
                <div
                  key={log.id}
                  className={`p-3 ${config.bg} border ${config.border} rounded-lg`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-sm">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-zinc-500 font-mono">
                          {log.timestamp}
                        </span>
                        <span className={`text-xs font-semibold uppercase ${config.color}`}>
                          {log.level}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-200 break-words">
                        {log.message}
                      </p>
                      {log.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-300">
                            Ver dados
                          </summary>
                          <pre className="mt-2 p-2 bg-black/30 rounded text-xs text-zinc-300 overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Footer - Status */}
      {!isMinimized && (
        <div className="shrink-0 bg-zinc-900 border-t border-zinc-800 p-2 px-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              {isEnabled ? '🟢 Ativo' : '🔴 Pausado'}
            </span>
            <span className="text-zinc-600">
              Press F12 para DevTools
            </span>
          </div>
        </div>
      )}
    </div>
  );
}