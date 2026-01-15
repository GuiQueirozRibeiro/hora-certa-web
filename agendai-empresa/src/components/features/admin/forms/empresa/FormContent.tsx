/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useToast } from '@/hooks/useToast';
import { useFormHandlers } from './useFormHandlers';
import { ToastContainer } from '@/components/ui/Toast';
import { FormLayout } from '@/components/ui/FormLayout';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { X } from 'lucide-react';

/**
 * Componente de apresentação puro que renderiza o formulário
 * 
 * Aplica o Princípio da Responsabilidade Única:
 * - Responsabilidade: Renderização do JSX (UI pura)
 * - Delega toda a lógica de negócio para o hook useFormHandlers
 */
export function FormContent({ business }: { business: any }) {
  const { toasts, removeToast } = useToast();
  
  // Hook contém TODA a lógica de negócio
  const {
    state,
    uploadingLogo,
    uploadingGallery,
    updateField,
    getFieldError,
    handleLogoUpload,
    handleLogoRemove,
    handleGalleryUpload,
    handleGalleryRemove,
    handleSubmit,
    handleReset,
  } = useFormHandlers(business);

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

        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-200">
            Galeria de Fotos (Vitrime)
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Imagens Existentes */}
            {(state.data.images as string[])?.map((url, index) => (
              <div 
                key={url} 
                className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-zinc-400"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" x2="12" y1="3" y2="15"/>
                    </svg>
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
              onClick={handleReset}
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
