'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import { WorkingHoursInput } from './WorkingHoursInput';
import { useProfessionalModal } from '@/hooks/useProfessionalModal';
import type { ProfessionalWithUser } from '@/types/professional';
import { businessService } from '@/services/businessService';

interface ProfessionalModalProps {
  businessId: string;
  professional: ProfessionalWithUser | null;
  onClose: (saved: boolean) => void;
}

export function ProfessionalModal({ businessId, professional, onClose }: ProfessionalModalProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const {
    isEditing,
    name, setName,
    avatarUrl, setAvatarUrl, 
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !businessId) return;

    setUploadingPhoto(true);
    try {
      const url = await businessService.uploadProfessionalImage(businessId, file);
      setAvatarUrl(url);
    } catch (err: any) {
      console.error("Erro no upload do profissional:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-zinc-800 rounded-t-2xl md:rounded-xl border border-zinc-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-700 bg-zinc-800 sticky top-0 z-10 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {isEditing ? 'Editar Profissional' : 'Novo Profissional'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              INFORMAÇÕES DA CONTA
            </h3>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative w-24 h-24 rounded-full bg-zinc-700 border-2 border-dashed border-zinc-600 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="text-zinc-500" size={32} />
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-600">
                {avatarUrl ? 'Trocar Foto' : 'Adicionar Foto'}
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              </label>
            </div>

            <div className="space-y-4">
              <Input
                label="Nome Completo *"
                placeholder="Ex: João Silva"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email *"
                placeholder="joao.silva@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isEditing}
              />

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

          <div>
            <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
              INFORMAÇÕES PROFISSIONAIS
            </h3>

            <div className="space-y-4">
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
                    <span className="hidden md:inline">Adicionar</span>
                  </Button>
                </div>

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

              <Input
                label="Anos de Experiência"
                placeholder="0"
                type="number"
                min="0"
                max="50"
                value={experienceYears === 0 ? '' : experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />

              <Textarea
                label="Biografia"
                placeholder="Conte um pouco sobre sua experiência profissional..."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
              HORÁRIOS DE TRABALHO
            </h3>

            <WorkingHoursInput
              value={workingHours}
              onChange={setWorkingHours}
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t border-zinc-700">
            <Button
              type="button"
              onClick={() => onClose(false)}
              disabled={isSaving}
              className="bg-zinc-700 hover:bg-zinc-600 w-full md:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 w-full md:w-auto"
            >
              {isSaving
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar Alterações'
                  : 'Criar Profissional'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}