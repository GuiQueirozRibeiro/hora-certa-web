/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useBusinessForm } from '@/hooks/useBusinessForm';
import { businessService } from '@/services/businessService';
import { validateBusinessForm } from '@/lib/validations/businessValidations';
import { mapBusinessToFormData, sanitizeBusinessFormData } from '@/lib/mappers/businessMapper';

/**
 * Custom Hook responsável pela lógica de negócio do formulário de empresa
 * Aplica o Princípio da Responsabilidade Única (SRP)
 * 
 * @param business - Objeto contendo os dados da empresa
 * @returns Estados e handlers necessários para o formulário
 */
export function useFormHandlers(business: any) {
  const { refreshBusiness } = useAuth();
  const { success, error: showError } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const toast = useToast();

  // Inicializa o formulário com os dados mapeados do banco
  const {
    state,
    updateField,
    setErrors,
    clearErrors,
    setSaving,
    resetForm,
    getFieldError,
  } = useBusinessForm(mapBusinessToFormData(business));

  /**
   * Handler para upload da logo da empresa
   * Valida o tamanho do arquivo e faz o upload
   */
  const handleLogoUpload = async (file: File) => {
    if (!business) return;

    // Validação de tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('Arquivo muito grande', 'A imagem deve ter no máximo 2MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const imageUrl = await businessService.uploadBusinessImage(
        business.id,
        file,
        'logo'
      );
      updateField('image_url', imageUrl);
      await refreshBusiness();
      success('Logo atualizada com sucesso!');
    } catch (err: any) {
      showError('Erro ao fazer upload', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  /**
   * Handler para remover a logo da empresa
   */
  const handleLogoRemove = async () => {
    if (!business || !state.data.image_url) return;

    setUploadingLogo(true);
    try {
      await businessService.deleteBusinessImage(
        business.id,
        state.data.image_url,
        'logo'
      );
      updateField('image_url', '');
      await refreshBusiness();
      success('Logo removida com sucesso!');
    } catch (err: any) {
      showError('Erro ao remover logo', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  /**
   * Handler para upload de múltiplas imagens para a galeria
   * Processa todos os arquivos em paralelo
   */
  const handleGalleryUpload = async (files: FileList) => {
    if (!business) return;

    const filesArray = Array.from(files);
    setUploadingGallery(true);

    try {
      const uploadPromises = filesArray.map(file =>
        businessService.uploadBusinessImage(business.id, file, 'gallery')
      );

      const newImageUrls = await Promise.all(uploadPromises);
      const currentImages = (state.data.images as string[]) || [];

      updateField('images', [...currentImages, ...newImageUrls] as any);

      success(`${newImageUrls.length} fotos adicionadas com sucesso!`);
    } catch {
      showError('Erro no upload', 'Não foi possível carregar algumas imagens.');
    } finally {
      setUploadingGallery(false);
    }
  };

  /**
   * Handler para remover uma imagem específica da galeria
   */
  const handleGalleryRemove = async (urlToRemove: string) => {
    if (!business) return;

    try {
      const updatedImages = (state.data.images as string[]).filter(
        (url: string) => url !== urlToRemove
      );

      updateField('images', updatedImages as any);
      success('Imagem removida da galeria.');
    } catch {
      showError('Erro ao remover', 'Tente novamente em instantes.');
    }
  };

  /**
   * Handler para submissão do formulário
   * Valida os dados e envia para o backend
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!business) {
      showError('Erro', 'Empresa não encontrada');
      return;
    }

    // Limpa erros anteriores e valida o formulário
    clearErrors();
    const validationErrors = validateBusinessForm(state.data);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showError('Erro de validação', 'Verifique os campos destacados');
      return;
    }

    // Processa e salva os dados
    setSaving(true);
    try {
      const sanitizedData = sanitizeBusinessFormData(state.data);
      await businessService.updateBusiness(business.id, sanitizedData);
      await refreshBusiness(); // Atualiza o contexto e reseta o formulário via key change
      success('Dados atualizados com sucesso!');
    } catch (err: any) {
      showError('Erro ao salvar', err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handler para resetar o formulário aos valores originais
   */
  const handleReset = () => {
    resetForm(mapBusinessToFormData(business));
  };

  // No useFormHandlers.ts
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado!', 'Compartilhe com seus clientes.');
  };

  return {
    // Estados do formulário
    state,
    uploadingLogo,
    uploadingGallery,

    // Funções de atualização
    updateField,
    getFieldError,

    // toast
    toasts: toast.toasts,
    removeToast: toast.removeToast,

    // Handlers de ações
    copyToClipboard,
    handleLogoUpload,
    handleLogoRemove,
    handleGalleryUpload,
    handleGalleryRemove,
    handleSubmit,
    handleReset,
  };
}
