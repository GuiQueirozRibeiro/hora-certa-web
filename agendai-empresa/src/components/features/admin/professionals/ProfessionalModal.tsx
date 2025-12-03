// src/components/features/admin/professionals/ProfessionalModal.tsx
'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import { WorkingHoursInput } from './WorkingHoursInput';
import { useProfessionalModal } from '@/hooks/useProfessionalModal';
import type { ProfessionalWithUser } from '@/types/professional';

interface ProfessionalModalProps {
  businessId: string;
  professional: ProfessionalWithUser | null;
  onClose: (saved: boolean) => void;
}

export function ProfessionalModal({ businessId, professional, onClose }: ProfessionalModalProps) {
  const {
    isEditing,
    name, setName,
    email, setEmail,
    password, setPassword,
    specialties, specialtyInput, setSpecialtyInput,
    bio, setBio,
    experienceYears, setExperienceYears,
    workingHours, setWorkingHours,
    isSaving,
    addSpecialty,
    removeSpecialty,
    handleSubmit: submitForm,
  } = useProfessionalModal({
    professional,
    businessId,
    onSuccess: () => onClose(true),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700 sticky top-0 bg-zinc-800 z-10">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Profissional' : 'Novo Profissional'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* SEÇÃO: Informações da Conta */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              INFORMAÇÕES DA CONTA
            </h3>

            <div className="space-y-4">
              {/* Nome Completo */}
              <Input
                label="Nome Completo *"
                placeholder="Ex: João Silva"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* Email */}
              <Input
                label="Email *"
                placeholder="joao.silva@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isEditing} // Email não pode ser alterado
              />

              {/* Senha (só ao criar) */}
              {!isEditing && (
                <Input
                  label="Senha *"
                  placeholder="Mínimo 6 caracteres"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              )}
            </div>
          </div>

          {/* SEÇÃO: Informações Profissionais */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
              INFORMAÇÕES PROFISSIONAIS
            </h3>

            <div className="space-y-4">
              {/* Especialidades */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-2">
                  Especialidades
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialty();
                      }
                    }}
                    placeholder="Ex: Corte Masculino"
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button
                    type="button"
                    onClick={addSpecialty}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar
                  </Button>
                </div>
                
                {/* Lista de especialidades */}
                {specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full border border-indigo-500/30"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="hover:text-indigo-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Anos de Experiência */}
              <Input
                label="Anos de Experiência"
                placeholder="0"
                type="number"
                min="0"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />

              {/* Bio */}
              <Textarea
                label="Biografia"
                placeholder="Conte um pouco sobre sua experiência profissional..."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* SEÇÃO: Horários de Trabalho */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
              HORÁRIOS DE TRABALHO
            </h3>

            <WorkingHoursInput
              value={workingHours}
              onChange={setWorkingHours}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-zinc-700">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving
                ? 'Salvando...'
                : isEditing
                ? 'Salvar Alterações'
                : 'Criar Profissional'}
            </Button>
            <Button
              type="button"
              onClick={() => onClose(false)}
              disabled={isSaving}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}