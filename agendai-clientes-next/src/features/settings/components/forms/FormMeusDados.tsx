'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useUserProfile } from '../../../../hooks/useUserProfile';

export function FormMeusDados() {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar o formulário quando o perfil for carregado
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
      });
    }
  }, [profile]);

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara (xx) x xxxx-xxxx ou (xx) xxxx-xxxx
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 16); // Limita o tamanho
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccessMessage('Dados atualizados com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(result.error || 'Erro ao atualizar dados.');
    }

    setIsSubmitting(false);
  };

  if (loading && !profile) {
    return (
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl text-zinc-300 font-bold mb-3">Meus Dados</h2>
        <p className="text-zinc-300">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl sm:text-2xl text-zinc-300 font-bold mb-2 sm:mb-3">
        Meus Dados
      </h2>
      <p className="text-sm sm:text-base text-zinc-300 mb-4 sm:mb-6">
        Aqui você pode alterar suas informações de perfil.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {errorMessage}
        </div>
      )}

      {/* Formulário */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">

        <div>

          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Fulano Taldo"
            required
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="fulano.taldo@gmail.com"
            required
            disabled
            title="O email não pode ser alterado"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Data de Aniversário
          </label>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            className="w-full rounded-md border-gray-600 bg-[#3a3b3f] p-3 text-white focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="(11) 9 1234-5678"
            maxLength={16}
            />
        </div>

      </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="mt-4 w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>

      </form>
    </div>
  );
}
