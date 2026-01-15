/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { useBusinessForm } from '@/hooks/useBusinessForm';
import { businessService } from '@/services/businessService';
import { validateBusinessForm } from '@/lib/validations/businessValidations';
import { mapBusinessToFormData, sanitizeBusinessFormData } from '@/lib/mappers/businessMapper';
import { FormLayout } from '@/components/ui/FormLayout';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';

import { X } from 'lucide-react';

/**
 * Formulário de Dados da Empresa
 * Responsabilidade: Orquestração entre hooks, services e UI
 */
export function FormEmpresa() {
  const { business, refreshBusiness, loading: authLoading } = useAuth();
  const { success, error: showError, toasts, removeToast } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

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
    instagram_link: '',
    image_url: '',
    cover_image_url: '',
    images: [],
  });

  // Carrega dados da empresa ao montar o componente
  useEffect(() => {
  }, [business, resetForm, authLoading]);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError('Erro ao fazer upload', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handler: upload de imagens da galeria

  const handleGalleryUpload = async (files: FileList) => {
    if (!business) return;

    // 1. Transformamos a lista de arquivos em um Array para podermos usar .map()
    const filesArray = Array.from(files);

    // 2. Iniciamos o estado de loading da galeria
    setUploadingGallery(true);

    try {
      // 3. Criamos uma lista de promessas de upload. 
      // Cada arquivo será enviado para o service que você já tem.
      const uploadPromises = filesArray.map(file =>
        businessService.uploadBusinessImage(business.id, file, 'gallery')
      );

      // 4. O Promise.all espera TODAS as fotos terminarem o upload
      // Ele retorna um array com todos os novos links gerados
      const newImageUrls = await Promise.all(uploadPromises);

      // 5. ATUALIZAÇÃO DO ESTADO (Ponto Crítico):
      // Pegamos o que já tinha (state.data.images) e juntamos com as novas URLs
      const currentImages = (state.data.images as string[]) || [];

      updateField('images', [...currentImages, ...newImageUrls] as any);

      success(`${newImageUrls.length} fotos adicionadas com sucesso!`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError('Erro no upload', 'Não foi possível carregar algumas imagens.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleGalleryRemove = async (urlToRemove: string) => {
    if (!business) return;

    try {
      // 1. Opcional: Você pode chamar o service para deletar o arquivo físico do Storage
      // await businessService.deleteBusinessImage(business.id, urlToRemove, 'gallery');

      // 2. Filtramos o array de imagens no estado.
      // "Mantenha todas as imagens, EXCETO aquela que tem a URL igual a urlToRemove"
      // Forçamos o tipo no filtro também
      const updatedImages = (state.data.images as string[]).filter((url: string) => url !== urlToRemove);

      updateField('images', updatedImages as any);

      success('Imagem removida da galeria.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showError('Erro ao remover', 'Tente novamente em instantes.');
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

  // Se ainda está carregando, mostra loading
  if (authLoading) {
    return (
      <FormLayout
        title="Dados da Empresa"
        description="Carregando informações da empresa..."
      >
        <div className="text-zinc-400 flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          Carregando...
        </div>
      </FormLayout>
    );
  }

  // Se terminou de carregar mas não tem business, mostra erro
  if (!business) {
    return (
      <FormLayout
        title="Dados da Empresa"
        description="Empresa não encontrada"
      >
        <div className="text-zinc-400">
          Não foi possível carregar os dados da empresa. Tente recarregar a página.
        </div>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Dados da Empresa"
      description="Essas informações serão exibidas na página de agendamento do seu cliente."
    >
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
        position="top-right"
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Upload de Logo */}
        <ImageUpload
          label="Logo da Empresa"
          preview={state.data.image_url || null}
          onUpload={handleLogoUpload}
          onRemove={handleLogoRemove}
          isLoading={uploadingLogo}
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-200">
            Galeria de Fotos (Vitrime)
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Imagens Existentes */}
            {(state.data.images as string[])?.map((url, index) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group">
                <img 
                  src={url} 
                  alt={`Galeria ${index}`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <button
                  type="button"
                  onClick={() => handleGalleryRemove(url)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {/* Botão para Adicionar Novas */}
            <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-indigo-500 hover:bg-indigo-500/5 cursor-pointer transition-all">
              {uploadingGallery ? (
                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <div className="p-2 bg-zinc-800 rounded-full mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">Adicionar fotos</span>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploadingGallery}
                onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
              />
            </label>
          </div>
        </div>

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

        {/* Instagram */}
        <Input
          label="Link do Instagram"
          placeholder="https://www.instagram.com/sua_empresa/"
          type="text"
          value={state.data.instagram_link || ''}
          onChange={(e) => updateField('instagram_link', e.target.value)}
          error={getFieldError('instagram_link')}
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