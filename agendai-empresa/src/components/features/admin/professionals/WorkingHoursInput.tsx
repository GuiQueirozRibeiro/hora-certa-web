import { useState } from 'react';
import { Clock } from 'lucide-react';
import type { WorkingHours } from '@/types/professional';

interface WorkingHoursInputProps {
  value: WorkingHours;
  onChange: (hours: WorkingHours) => void;
}

const DAYS = [
  { key: 'monday', label: 'Segunda-feira', short: 'Seg' },
  { key: 'tuesday', label: 'Terça-feira', short: 'Ter' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'Qua' },
  { key: 'thursday', label: 'Quinta-feira', short: 'Qui' },
  { key: 'friday', label: 'Sexta-feira', short: 'Sex' },
  { key: 'saturday', label: 'Sábado', short: 'Sáb' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' },
];

const DEFAULT_HOURS = {
  enabled: false,
  start: '09:00',
  end: '18:00',
};

export function WorkingHoursInput({ value, onChange }: WorkingHoursInputProps) {
  // Inicializa com valores padrão se não existir
  const workingHours: WorkingHours = value || DAYS.reduce((acc, day) => ({
    ...acc,
    [day.key]: { ...DEFAULT_HOURS }
  }), {});

  const handleToggleDay = (dayKey: string) => {
    const updated = {
      ...workingHours,
      [dayKey]: {
        ...workingHours[dayKey],
        enabled: !workingHours[dayKey]?.enabled,
      },
    };
    onChange(updated);
  };

  const handleTimeChange = (dayKey: string, field: 'start' | 'end', value: string) => {
    const updated = {
      ...workingHours,
      [dayKey]: {
        ...workingHours[dayKey],
        [field]: value,
      },
    };
    onChange(updated);
  };

  const handleCopyToAll = () => {
    // Pega o primeiro dia habilitado como referência
    const referenceDay = DAYS.find(day => workingHours[day.key]?.enabled);
    if (!referenceDay) return;

    const reference = workingHours[referenceDay.key];
    const updated = DAYS.reduce((acc, day) => ({
      ...acc,
      [day.key]: {
        enabled: workingHours[day.key]?.enabled || false,
        start: reference.start,
        end: reference.end,
      }
    }), {});
    
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-400" />
          <label className="text-sm font-medium text-zinc-200">
            Horários de Trabalho
          </label>
        </div>
        <button
          type="button"
          onClick={handleCopyToAll}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Copiar para todos os dias
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {DAYS.map((day) => {
          const dayData = workingHours[day.key] || DEFAULT_HOURS;
          
          return (
            <div
              key={day.key}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                dayData.enabled
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              {/* Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`day-${day.key}`}
                  checked={dayData.enabled}
                  onChange={() => handleToggleDay(day.key)}
                  className="w-4 h-4 bg-zinc-800 border-zinc-600 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer"
                />
              </div>

              {/* Day Label */}
              <label
                htmlFor={`day-${day.key}`}
                className="w-32 text-sm font-medium text-zinc-300 cursor-pointer"
              >
                {day.label}
              </label>

              {/* Time Inputs */}
              {dayData.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                    className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-zinc-500 text-sm">até</span>
                  <input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                    className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <span className="text-xs text-zinc-600 italic flex-1">Não trabalha neste dia</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500">
        💡 Marque os dias em que o profissional trabalha e defina os horários
      </p>
    </div>
  );
}