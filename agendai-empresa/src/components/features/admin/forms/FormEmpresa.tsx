'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { FormLayout } from '@/components/ui/FormLayout'; // Importe o novo componente
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';


export function FormEmpresa() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Olha como ficou limpo! Não tem mais aquele monte de div e h2 soltos.
  return (
    <FormLayout
      title="Dados da Empresa"
      description="Essas informações serão exibidas na página de agendamento do seu cliente."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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