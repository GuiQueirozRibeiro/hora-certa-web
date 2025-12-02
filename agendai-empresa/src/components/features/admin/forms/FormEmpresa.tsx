'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useBusinessForm } from '@/hooks/useBusinessForm';
import { businessService } from '@/services/businessService';
import { validateBusinessForm } from '@/lib/validations/businessValidations';
import { mapBusinessToFormData, sanitizeBusinessFormData } from '@/lib/mappers/businessMapper';
import { FormLayout } from '@/components/ui/FormLayout';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';

/**
 * Formulário de Dados da Empresa
 * Responsabilidade: Orquestração entre hooks, services e UI
 */
export function FormEmpresa() {
  const { business, refreshBusiness } = useAuth();
  const { success, error: showError } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Inicializa o formulário com dados vazios
  const {
    state,
    updateField,
    setErrors,
    clearErrors,
    setLoading,
    setSaving,
    resetForm,
    getFieldError,
  } = useBusinessForm({
    name: '',
    description: '',
    business_type: '',
    whatsapp_link: '',
    image_url: '',
    cover_image_url: '',
  });

  // Carrega dados da empresa ao montar o componente
  useEffect(() => {
    console.log('📋 [FormEmpresa] useEffect - business:', business);
    if (business) {
      console.log('✅ [FormEmpresa] Mapeando dados da empresa...');
      const formData = mapBusinessToFormData(business);
      console.log('📝 [FormEmpresa] FormData mapeado:', formData);
      resetForm(formData);
    } else {
      console.warn('⚠️ [FormEmpresa] Business não encontrado');
    }
  }, [business, resetForm]);

  // Handler: Upload de logo
  const handleLogoUpload = async (file: File) => {
    if (!business) return;

    // Validação de tamanho
    if (file.size > 2 * 1024 * 1024) {
      showError('Arquivo muito grande', 'A imagem deve ter no máximo 2MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const imageUrl = await businessService.uploadBusinessImage(business.id, file, 'logo');
      updateField('image_url', imageUrl);
      await refreshBusiness();
      success('Logo atualizada com sucesso!');
    } catch (err: any) {
      showError('Erro ao fazer upload', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handler: Remover logo
  const handleLogoRemove = async () => {
    if (!business || !state.data.image_url) return;

    setUploadingLogo(true);
    try {
      await businessService.deleteBusinessImage(business.id, state.data.image_url, 'logo');
      updateField('image_url', '');
      await refreshBusiness();
      success('Logo removida com sucesso!');
    } catch (err: any) {
      showError('Erro ao remover logo', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handler: Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) {
      showError('Erro', 'Empresa não encontrada');
      return;
    }

    // Validação
    clearErrors();
    const validationErrors = validateBusinessForm(state.data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showError('Erro de validação', 'Verifique os campos destacados');
      return;
    }

    // Salvar
    setSaving(true);
    try {
      const sanitizedData = sanitizeBusinessFormData(state.data);
      await businessService.updateBusiness(business.id, sanitizedData);
      await refreshBusiness();
      success('Dados atualizados com sucesso!');
    } catch (err: any) {
      showError('Erro ao salvar', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!business) {
    return (
      <FormLayout
        title="Dados da Empresa"
        description="Carregando informações da empresa..."
      >
        <div className="text-zinc-400">Carregando...</div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Dados da Empresa"
      description="Essas informações serão exibidas na página de agendamento do seu cliente."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Upload de Logo */}
        <ImageUpload
          label="Logo da Empresa"
          preview={state.data.image_url || null}
          onUpload={handleLogoUpload}
          onRemove={handleLogoRemove}
          isLoading={uploadingLogo}
        />

        {/* Nome da Empresa */}
        <Input
          label="Nome do Estabelecimento *"
          placeholder="Ex: Barbearia do Zé"
          type="text"
          value={state.data.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={getFieldError('name')}
          required
        />

        {/* Tipo de Negócio */}
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Tipo de Negócio
          </label>
          <select
            value={state.data.business_type || ''}
            onChange={(e) => updateField('business_type', e.target.value)}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="">Selecione o tipo</option>
            <option value="barbearia">Barbearia</option>
            <option value="salao_beleza">Salão de Beleza</option>
            <option value="clinica">Clínica</option>
            <option value="consultorio">Consultório</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* WhatsApp */}
        <Input
          label="Link do WhatsApp"
          placeholder="https://wa.me/5511999999999"
          type="text"
          value={state.data.whatsapp_link || ''}
          onChange={(e) => updateField('whatsapp_link', e.target.value)}
          error={getFieldError('whatsapp_link')}
        />

        {/* Descrição */}
        <Textarea
          label="Descrição"
          placeholder="Descreva sua empresa e seus serviços"
          rows={4}
          value={state.data.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          error={getFieldError('description')}
        />

        {/* Contador de caracteres */}
        {state.data.description && (
          <p className="text-xs text-zinc-400 -mt-4">
            {state.data.description.length}/500 caracteres
          </p>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={state.isSaving || !state.isDirty}
            className="flex-1"
          >
            {state.isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          
          {state.isDirty && (
            <Button
              type="button"
              onClick={() => business && resetForm(mapBusinessToFormData(business))}
              disabled={state.isSaving}
              className="bg-zinc-700 hover:bg-zinc-600"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </FormLayout>
  );
}