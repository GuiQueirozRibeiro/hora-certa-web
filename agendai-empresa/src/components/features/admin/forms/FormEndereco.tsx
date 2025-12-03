'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Save } from 'lucide-react';
import { useAddressForm } from '@/hooks/useAddressForm';

export function FormEndereco() {
  const {
    // State
    country,
    state,
    city,
    neighborhood,
    street,
    number,
    complement,
    postalCode,
    isSaving,
    isLoading,
    
    // Setters
    setCountry,
    setState,
    setCity,
    setNeighborhood,
    setStreet,
    setNumber,
    setComplement,
    setPostalCode,
    
    // Actions
    handleSubmit,
    handleCepBlur,
    formatCep,
  } = useAddressForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-zinc-400">Carregando endereço...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-1 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-500" />
          Endereço da Empresa
        </h2>
        <p className="text-sm text-zinc-400">
          Configure o endereço completo do seu estabelecimento
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SEÇÃO: CEP e País */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="CEP *"
              placeholder="00000-000"
              value={postalCode}
              onChange={(e) => setPostalCode(formatCep(e.target.value))}
              onBlur={handleCepBlur}
              maxLength={9}
              required
            />
            <p className="mt-1 text-xs text-zinc-500">
              💡 Digite o CEP para preencher automaticamente
            </p>
          </div>
          <Input
            label="País *"
            placeholder="Brasil"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        {/* SEÇÃO: Estado e Cidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Estado *"
            placeholder="Ex: São Paulo"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <Input
            label="Cidade *"
            placeholder="Ex: São Paulo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        {/* SEÇÃO: Bairro */}
        <Input
          label="Bairro"
          placeholder="Ex: Centro"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        />

        {/* SEÇÃO: Rua e Número */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Rua *"
              placeholder="Ex: Rua das Flores"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>
          <Input
            label="Número *"
            placeholder="123"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>

        {/* SEÇÃO: Complemento */}
        <Input
          label="Complemento"
          placeholder="Ex: Sala 101, Bloco A"
          value={complement}
          onChange={(e) => setComplement(e.target.value)}
        />

        {/* Botões */}
        <div className="flex gap-3 pt-4 border-t border-zinc-700">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar Endereço'}
          </Button>
        </div>
      </form>
    </div>
  );
}
