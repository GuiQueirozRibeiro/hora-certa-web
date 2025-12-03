// src/components/features/admin/professionals/ProfessionalModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { professionalService } from '@/services/professionalService';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import { WorkingHoursInput } from './WorkingHoursInput';
import type { ProfessionalWithUser, WorkingHours } from '@/types/professional';

interface ProfessionalModalProps {
  businessId: string;
  professional: ProfessionalWithUser | null;
  onClose: (saved: boolean) => void;
}

// Horários padrão: Segunda a Sexta 09:00-18:00
const DEFAULT_WORKING_HOURS: WorkingHours = {
  monday: { enabled: true, start: '09:00', end: '18:00' },
  tuesday: { enabled: true, start: '09:00', end: '18:00' },
  wednesday: { enabled: true, start: '09:00', end: '18:00' },
  thursday: { enabled: true, start: '09:00', end: '18:00' },
  friday: { enabled: true, start: '09:00', end: '18:00' },
  saturday: { enabled: false, start: '09:00', end: '14:00' },
  sunday: { enabled: false, start: '09:00', end: '18:00' },
};

export function ProfessionalModal({ businessId, professional, onClose }: ProfessionalModalProps) {
  const { success, error: showError } = useToast();
  const isEditing = !!professional;

  // Estados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(DEFAULT_WORKING_HOURS);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega dados ao editar
  useEffect(() => {
    console.log('[ProfessionalModal] Iniciando carregamento...', {
      isEditing,
      professional: professional ? {
        id: professional.id,
        name: professional.user?.name,
        email: professional.user?.email,
        specialties: professional.specialties,
        working_hours: professional.working_hours
      } : null
    });

    if (professional) {
      // Carregar dados básicos
      setName(professional.user?.name || '');
      setEmail(professional.user?.email || '');
      setSpecialties(professional.specialties || []);
      setBio(professional.bio || '');
      setExperienceYears(professional.experience_years || 0);
      
      // Carregar horários de trabalho com fallback
      let loadedHours = DEFAULT_WORKING_HOURS;
      
      if (professional.working_hours) {
        console.log('[ProfessionalModal] Horários encontrados no professional:', professional.working_hours);
        
        // Verificar se é um objeto válido
        if (typeof professional.working_hours === 'object' && professional.working_hours !== null) {
          // Merge com horários padrão para garantir que todos os dias existam
          loadedHours = {
            ...DEFAULT_WORKING_HOURS,
            ...professional.working_hours
          };
          console.log('[ProfessionalModal] Horários após merge:', loadedHours);
        } else {
          console.warn('[ProfessionalModal] working_hours não é um objeto válido:', typeof professional.working_hours);
        }
      } else {
        console.log('[ProfessionalModal] Usando horários padrão (working_hours não existe)');
      }
      
      setWorkingHours(loadedHours);
      
      console.log('[ProfessionalModal] Estado final:', {
        name,
        email,
        specialties,
        experienceYears,
        workingHours: loadedHours
      });
    } else {
      console.log('[ProfessionalModal] Modo criação - usando valores padrão');
    }
  }, [professional]);

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[ProfessionalModal] Iniciando submit...', {
      isEditing,
      workingHours
    });

    // Validações
    if (!name.trim()) {
      showError('Erro de validação', 'Nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      showError('Erro de validação', 'Email é obrigatório');
      return;
    }

    if (!isEditing && !password.trim()) {
      showError('Erro de validação', 'Senha é obrigatória para novos profissionais');
      return;
    }

    if (!isEditing && password.length < 6) {
      showError('Erro de validação', 'Senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Validar horários
    const hasAtLeastOneDay = Object.values(workingHours).some(day => day.enabled);
    if (!hasAtLeastOneDay) {
      showError('Erro de validação', 'Selecione pelo menos um dia de trabalho');
      return;
    }

    // Salvar
    setIsSaving(true);
    try {
      if (isEditing) {
        console.log('[ProfessionalModal] Atualizando profissional...', {
          id: professional.id,
          data: {
            specialties,
            bio: bio.trim() || undefined,
            experience_years: experienceYears,
            working_hours: workingHours,
          }
        });

        // Atualizar profissional existente
        await professionalService.updateProfessional(professional.id, {
          specialties: Array.isArray(specialties) ? specialties : [],
          bio: bio.trim() || undefined,
          experience_years: experienceYears,
          working_hours: workingHours,
        });

        console.log('[ProfessionalModal] Profissional atualizado com sucesso');

        // Atualizar nome do usuário se mudou
        if (name.trim() !== professional.user?.name) {
          console.log('[ProfessionalModal] Atualizando nome do usuário...', {
            user_id: professional.user_id,
            old_name: professional.user?.name,
            new_name: name.trim()
          });

          await professionalService.updateProfessionalName(professional.user_id, name.trim());
          
          console.log('[ProfessionalModal] Nome atualizado com sucesso');
        }

        success('Profissional atualizado com sucesso!');
      } else {
        console.log('[ProfessionalModal] Criando novo profissional...', {
          email: email.trim(),
          name: name.trim(),
          business_id: businessId,
          specialties,
          bio: bio.trim() || undefined,
          experience_years: experienceYears,
          working_hours: workingHours,
        });

        // Criar novo profissional
        const newProfessional = await professionalService.createProfessional({
          email: email.trim(),
          password: password.trim(),
          name: name.trim(),
          business_id: businessId,
          specialties: Array.isArray(specialties) ? specialties : [],
          bio: bio.trim() || undefined,
          experience_years: experienceYears,
          working_hours: workingHours,
        });

        console.log('[ProfessionalModal] Profissional criado com sucesso:', newProfessional);

        success('Profissional criado com sucesso!');
      }

      onClose(true);
    } catch (err: any) {
      console.error('[ProfessionalModal] Erro ao salvar profissional:', err);
      console.error('[ProfessionalModal] Stack trace:', err.stack);
      showError('Erro ao salvar', err.message);
    } finally {
      setIsSaving(false);
    }
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
          
          {/* DEBUG INFO (remover em produção) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
              <summary className="cursor-pointer text-sm text-zinc-400 font-mono">
                🐛 Debug Info (clique para expandir)
              </summary>
              <pre className="mt-2 text-xs text-zinc-500 overflow-x-auto">
                {JSON.stringify({
                  isEditing,
                  name,
                  email,
                  specialties,
                  experienceYears,
                  workingHours,
                  hasWorkingHours: !!workingHours,
                  workingHoursType: typeof workingHours,
                }, null, 2)}
              </pre>
            </details>
          )}

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
                        handleAddSpecialty();
                      }
                    }}
                    placeholder="Ex: Corte Masculino"
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSpecialty}
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
                          onClick={() => handleRemoveSpecialty(specialty)}
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
              onChange={(newHours) => {
                console.log('[ProfessionalModal] Horários atualizados:', newHours);
                setWorkingHours(newHours);
              }}
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