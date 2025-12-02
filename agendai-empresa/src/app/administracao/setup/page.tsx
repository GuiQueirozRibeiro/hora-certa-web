'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { businessService } from '@/services/businessService';
import {Input} from '@/components/ui/Input';
import {Textarea} from '@/components/ui/Textarea';
import {Button} from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export default function BusinessSetupPage() {
  const { user, refreshBusiness } = useAuth();
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    business_type: '',
    whatsapp_link: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Nome da empresa é obrigatório');
      }

      await businessService.createBusiness({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        business_type: formData.business_type.trim() || undefined,
        whatsapp_link: formData.whatsapp_link.trim() || undefined,
      });

      success('Empresa criada com sucesso!');
      
      await refreshBusiness();
      
      router.push('/administracao');
    } catch (err: any) {
      error('Erro ao criar empresa', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#242424] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Configurar Empresa
          </h1>
          <p className="text-gray-400">
            Complete as informações da sua empresa para começar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Empresa *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome da sua empresa"
              required
            />
          </div>

          {/* Tipo de Negócio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Negócio *
            </label>
            <select
              value={formData.business_type}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              required
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">Selecione o tipo</option>
              <option value="barbearia">Barbearia</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva sua empresa e seus serviços"
              rows={4}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Link do WhatsApp
            </label>
            <Input
              type="text"
              value={formData.whatsapp_link}
              onChange={(e) => setFormData({ ...formData, whatsapp_link: e.target.value })}
              placeholder="https://wa.me/5511999999999"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: https://wa.me/55DDNÚMERO
            </p>
          </div>

          {/* Botão de Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Criando empresa...' : 'Criar Empresa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
