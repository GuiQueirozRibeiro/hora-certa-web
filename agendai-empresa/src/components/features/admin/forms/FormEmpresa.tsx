'use client';

import { useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { FormLayout } from '@/components/ui/FormLayout'; // Importe o novo componente
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';


export function FormEmpresa() {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  // Olha como ficou limpo! Não tem mais aquele monte de div e h2 soltos.
  return (
    <FormLayout
      title="Dados da Empresa"
      description="Essas informações serão exibidas na página de agendamento do seu cliente."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Upload de Logo */}
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            Logo da Empresa
          </label>
          <div className="flex items-start gap-4">
            {/* Preview da Logo */}
            {logoPreview ? (
              <div className="relative w-32 h-32 bg-zinc-800 rounded-lg border-2 border-zinc-700 overflow-hidden group">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-zinc-600" />
              </div>
            )}

            {/* Botão de Upload */}
            <div className="flex-1">
              <label 
                htmlFor="logo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium"
              >
                <UploadCloud size={18} />
                {logoPreview ? 'Alterar Logo' : 'Fazer Upload'}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-xs text-zinc-400 mt-2">
                PNG, JPG ou WEBP. Máx. 2MB.
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Recomendado: 512x512px (formato quadrado)
              </p>
            </div>
          </div>
        </div>

        <div>
            <Input
                label='Nome do Estabelecimento'
                placeholder='Ex: Barbearia do Zé'
                type='text'
                className='mb-2'
            />
            <Input
                label='CPF ou CNPJ'
                placeholder='00.000.000/0000-00'
                type='text'
                className='mb-2'
            />
            <Input
                label='Telefone / WhatsApp'
                placeholder='(00) 0000-0000'
                type='tel'
                className='mb-2'
            />
            <Input
                label='Email de Contato'
                placeholder='contato@suaempresa.com'
                type='email'
                className='mb-2'
            />
            <Textarea 
                label="Endereço Completo"
                placeholder="Rua, Número, Bairro, Cidade - Estado"
                rows={3}
            />
        </div>
      </form>
    </FormLayout>
  );
}