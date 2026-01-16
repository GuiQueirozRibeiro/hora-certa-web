'use client';

import { useState } from 'react';
import { Clock, Edit, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export interface HorarioFuncionamento {
  dia: string;
  diaAbreviado: string;
  ativo: boolean;
  horarioAbertura: string;
  horarioFechamento: string;
  intervaloInicio?: string;
  intervaloFim?: string;
}

interface DiaFuncionamentoCardProps {
  horario: HorarioFuncionamento;
  onSave: (horario: HorarioFuncionamento) => void;
}

export function DiaFuncionamentoCard({ horario, onSave }: DiaFuncionamentoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHorario, setEditedHorario] = useState<HorarioFuncionamento>(horario);

  const handleStartEdit = () => {
    setEditedHorario(horario);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedHorario(horario);
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave(editedHorario);
    setIsEditing(false);
  };

  const handleToggleAtivo = () => {
    const updated = { ...editedHorario, ativo: !editedHorario.ativo };
    setEditedHorario(updated);
  };

  return (
    <Card className={`transition-all ${isEditing ? 'ring-2 ring-indigo-500' : 'hover:border-zinc-600'}`}>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-sm ${
              editedHorario.ativo ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700 text-zinc-500'
            }`}>
              {horario.diaAbreviado}
            </div>
            
            <div>
              <h3 className="text-sm md:text-base font-semibold text-zinc-100">
                {horario.dia}
              </h3>
              <p className="text-xs text-zinc-500">
                {editedHorario.ativo ? 'Dia útil' : 'Fechado'}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button onClick={handleStartEdit} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
              <Edit className="h-4 w-4 text-zinc-400" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className="p-2 hover:bg-green-500/20 rounded-lg transition-colors">
                <Check className="h-4 w-4 text-green-400" />
              </button>
              <button onClick={handleCancelEdit} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                <X className="h-4 w-4 text-red-400" />
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-1">
            {editedHorario.ativo ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  <span className="text-zinc-300">
                    {editedHorario.horarioAbertura} - {editedHorario.horarioFechamento}
                  </span>
                </div>
                {editedHorario.intervaloInicio && editedHorario.intervaloFim && (
                  <div className="ml-6 text-xs text-zinc-500">
                    Intervalo: {editedHorario.intervaloInicio} - {editedHorario.intervaloFim}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-zinc-500 italic">Fechado</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedHorario.ativo}
                  onChange={handleToggleAtivo}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-sm text-zinc-300">
                {editedHorario.ativo ? 'Aberto' : 'Fechado'}
              </span>
            </div>

            {editedHorario.ativo && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-600 mb-1">Abertura</label>
                    <input
                      type="time"
                      value={editedHorario.horarioAbertura}
                      onChange={(e) => setEditedHorario({ ...editedHorario, horarioAbertura: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 mb-1">Fechamento</label>
                    <input
                      type="time"
                      value={editedHorario.horarioFechamento}
                      onChange={(e) => setEditedHorario({ ...editedHorario, horarioFechamento: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-700/50">
                  <div className="col-span-2 text-xs text-zinc-500 font-medium">Intervalo (Opcional)</div>
                  <div>
                    <label className="block text-xs text-zinc-600 mb-1">Início</label>
                    <input
                      type="time"
                      value={editedHorario.intervaloInicio || ''}
                      onChange={(e) => setEditedHorario({ ...editedHorario, intervaloInicio: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 mb-1">Fim</label>
                    <input
                      type="time"
                      value={editedHorario.intervaloFim || ''}
                      onChange={(e) => setEditedHorario({ ...editedHorario, intervaloFim: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}