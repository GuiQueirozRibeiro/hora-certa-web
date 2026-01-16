import { useState } from 'react';
import { Clock, Check } from 'lucide-react';
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
  const [globalStart, setGlobalStart] = useState('09:00');
  const [globalEnd, setGlobalEnd] = useState('18:00');

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
        start: workingHours[dayKey]?.start || globalStart,
        end: workingHours[dayKey]?.end || globalEnd,
      },
    };
    onChange(updated);
  };

  const handleApplyGlobalTime = () => {
    const updated = { ...workingHours };
    DAYS.forEach(day => {
      if (updated[day.key]?.enabled) {
        updated[day.key] = {
          ...updated[day.key],
          start: globalStart,
          end: globalEnd,
        };
      }
    });
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-zinc-400" />
        <label className="text-sm font-medium text-zinc-200">
          Horários de Trabalho
        </label>
      </div>

      <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
        <p className="text-xs text-indigo-400 mb-3 font-medium">🕒 Aplicar Mesmo Horário aos Dias Selecionados</p>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="time"
              value={globalStart}
              onChange={(e) => setGlobalStart(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-zinc-500 text-sm">até</span>
            <input
              type="time"
              value={globalEnd}
              onChange={(e) => setGlobalEnd(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyGlobalTime}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Aplicar
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {DAYS.map((day) => {
          const dayData = workingHours[day.key] || DEFAULT_HOURS;
          
          return (
            <div
              key={day.key}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border transition-colors ${
                dayData.enabled
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${day.key}`}
                    checked={dayData.enabled}
                    onChange={() => handleToggleDay(day.key)}
                    className="w-5 h-5 bg-zinc-800 border-zinc-600 rounded text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${day.key}`}
                    className="w-24 text-sm font-medium text-zinc-300 cursor-pointer"
                  >
                    {day.label}
                  </label>
                </div>
                
                {/* Mobile status indicator */}
                <span className="sm:hidden text-xs text-zinc-500">
                  {dayData.enabled ? 'Ativo' : 'Off'}
                </span>
              </div>

              {dayData.enabled ? (
                <div className="flex items-center gap-2 w-full sm:flex-1 mt-2 sm:mt-0">
                  <input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-zinc-500 text-sm">-</span>
                  <input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <span className="hidden sm:inline text-xs text-zinc-600 italic flex-1">Não trabalha</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}