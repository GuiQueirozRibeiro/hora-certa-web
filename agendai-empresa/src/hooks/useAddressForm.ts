import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { createClient } from '@/lib/supabase/client';

interface AddressData {
  id?: string;
  business_id?: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street_address: string;
  number: string;
  complement: string;
  zipcode: string;
  is_primary?: boolean;
}

interface UseAddressFormReturn {
  // Form state
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  postalCode: string;
  isSaving: boolean;
  isLoading: boolean;
  
  // Setters
  setCountry: (value: string) => void;
  setState: (value: string) => void;
  setCity: (value: string) => void;
  setNeighborhood: (value: string) => void;
  setStreet: (value: string) => void;
  setNumber: (value: string) => void;
  setComplement: (value: string) => void;
  setPostalCode: (value: string) => void;
  
  // Actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCepBlur: () => Promise<void>;
  formatCep: (value: string) => string;
}

export function useAddressForm(): UseAddressFormReturn {
  const { business } = useAuth();
  const { success, error: showError } = useToast();

  // Form state
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

  // Load address on mount
  useEffect(() => {
    const loadAddress = async () => {
      if (!business?.id) return;

      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('addresses_businesses')
          .select('*')
          .eq('business_id', business.id)
          .eq('is_primary', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setCountry(data.country || 'Brasil');
          setState(data.state || '');
          setCity(data.city || '');
          setNeighborhood(data.neighborhood || '');
          setStreet(data.street_address || '');
          setNumber(data.number || '');
          setComplement(data.complement || '');
          setPostalCode(data.zipcode || '');
        }
      } catch (err: any) {
        showError('Erro ao carregar endereço', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (business?.id) {
      loadAddress();
    }
  }, [business?.id]);

  const validateForm = (): boolean => {
    if (!state.trim()) {
      showError('Erro de validação', 'Estado é obrigatório');
      return false;
    }

    if (!city.trim()) {
      showError('Erro de validação', 'Cidade é obrigatória');
      return false;
    }

    if (!street.trim()) {
      showError('Erro de validação', 'Rua é obrigatória');
      return false;
    }

    if (!number.trim()) {
      showError('Erro de validação', 'Número é obrigatório');
      return false;
    }

    if (!postalCode.trim()) {
      showError('Erro de validação', 'CEP é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!business?.id) {
      showError('Erro', 'Empresa não encontrada');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      
      const addressData: Partial<AddressData> = {
        business_id: business.id,
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        street_address: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        zipcode: postalCode.trim(),
        is_primary: true,
      };

      // Verifica se já existe um endereço
      const { data: existing } = await supabase
        .from('addresses_businesses')
        .select('id')
        .eq('business_id', business.id)
        .eq('is_primary', true)
        .single();

      let error;
      
      if (existing) {
        // Atualiza endereço existente
        const result = await supabase
          .from('addresses_businesses')
          .update(addressData)
          .eq('id', existing.id);
        error = result.error;
      } else {
        // Cria novo endereço
        const result = await supabase
          .from('addresses_businesses')
          .insert(addressData);
        error = result.error;
      }

      if (error) throw error;

      success('Endereço salvo com sucesso!');
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
      // Ignora erros de busca de CEP silenciosamente
    }
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  return {
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
  };
}
