'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AddressData {
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  postal_code: string;
}

export function FormEndereco() {
  const { business } = useAuth();
  const { success, error: showError } = useToast();

  // Estados do formulário
  const [country, setCountry] = useState('Brasil');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar endereço existente
  useEffect(() => {
    if (business?.id) {
      loadAddress();
    }
  }, [business?.id]);

  const loadAddress = async () => {
    if (!business?.id) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('businesses')
        .select('address')
        .eq('id', business.id)
        .single();

      if (error) throw error;

      if (data?.address) {
        const addr = data.address as AddressData;
        setCountry(addr.country || 'Brasil');
        setState(addr.state || '');
        setCity(addr.city || '');
        setNeighborhood(addr.neighborhood || '');
        setStreet(addr.street || '');
        setNumber(addr.number || '');
        setComplement(addr.complement || '');
        setPostalCode(addr.postal_code || '');
      }
    } catch (err: any) {
      showError('Erro ao carregar endereço', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!business?.id) {
      showError('Erro', 'Empresa não encontrada');
      return;
    }

    // Validações básicas
    if (!state.trim()) {
      showError('Erro de validação', 'Estado é obrigatório');
      return;
    }

    if (!city.trim()) {
      showError('Erro de validação', 'Cidade é obrigatória');
      return;
    }

    if (!street.trim()) {
      showError('Erro de validação', 'Rua é obrigatória');
      return;
    }

    if (!number.trim()) {
      showError('Erro de validação', 'Número é obrigatório');
      return;
    }

    if (!postalCode.trim()) {
      showError('Erro de validação', 'CEP é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      
      const addressData: AddressData = {
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        postal_code: postalCode.trim(),
      };

      const { error } = await supabase
        .from('businesses')
        .update({ address: addressData })
        .eq('id', business.id);

      if (error) throw error;

      success('Endereço atualizado com sucesso!');
    } catch (err: any) {
      showError('Erro ao salvar endereço', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCepBlur = async () => {
    const cep = postalCode.replace(/\D/g, '');
    
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        showError('CEP inválido', 'CEP não encontrado');
        return;
      }

      setState(data.uf || '');
      setCity(data.localidade || '');
      setNeighborhood(data.bairro || '');
      setStreet(data.logradouro || '');
    } catch (err) {
      // Ignora erros de busca de CEP
    }
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

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
