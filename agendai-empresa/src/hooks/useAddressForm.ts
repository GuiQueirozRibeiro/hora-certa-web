/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { createClient } from '@/lib/supabase/client';

import { addressService } from '@/services/addressService'; // Importe o serviço

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
  lat?: number;
  long?: number;
}

// Função para obter coordenadas a partir do endereço usando Google Maps Geocoding API
async function getCoordinatesFromAddress(address: {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}): Promise<{ lat: number; long: number } | null> {

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('❌ Google Maps API Key não configurada');
    return null;
  }

  // Monta o endereço completo
  const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.country}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      console.log('✅ Endereço encontrado:', fullAddress);
      console.log('📍 Coordenadas:', location);
      return {
        lat: location.lat,
        long: location.lng
      };
    }

    // Se não encontrar com endereço completo, tenta sem o número
    const fallbackAddress = `${address.street}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.country}`;
    const encodedFallback = encodeURIComponent(fallbackAddress);

    const fallbackResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedFallback}&key=${apiKey}`
    );

    const fallbackData = await fallbackResponse.json();

    if (fallbackData.status === 'OK' && fallbackData.results && fallbackData.results.length > 0) {
      const location = fallbackData.results[0].geometry.location;
      console.log('✅ Endereço encontrado (fallback):', fallbackAddress);
      console.log('📍 Coordenadas:', location);
      return {
        lat: location.lat,
        long: location.lng
      };
    }

    console.warn('⚠️ Não foi possível encontrar coordenadas para o endereço');
    console.warn('Status da API:', data.status, data.error_message || '');
    return null;

  } catch (error) {
    console.error('❌ Erro ao buscar coordenadas:', error);
    return null;
  }
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
  homeServiceOnly: boolean;
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
  setHomeServiceOnly: (value: boolean) => void;

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
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);

  // Load address on mount
  useEffect(() => {
  const loadInitialData = async () => {
    if (!business?.id) return;

    setIsLoading(true);
    try {
      const supabase = createClient();

      // 1. Buscamos a flag booleana na tabela de EMPRESAS
      const { data: bizData } = await supabase
        .from('businesses')
        .select('home_service_only')
        .eq('id', business.id)
        .single();

      if (bizData) {
        setHomeServiceOnly(bizData.home_service_only);
      }

      // 2. Buscamos os dados de endereço na tabela de ENDEREÇOS
      const { data: addrData, error: addrError } = await supabase
        .from('addresses_businesses')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_primary', true)
        .single();

      if (addrData) {
        setCountry(addrData.country || 'Brasil');
        setState(addrData.state || '');
        setCity(addrData.city || '');
        setNeighborhood(addrData.neighborhood || '');
        setStreet(addrData.street_address || '');
        setNumber(addrData.number || '');
        setComplement(addrData.complement || '');
        setPostalCode(addrData.zipcode || '');
      }
    } catch (err: any) {
      err('Erro ao carregar dados', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  loadInitialData();
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

    // Usamos o business.id e business.owner_id que você já tem no hook
    if (!business?.id || !business?.owner_id) {
      showError('Erro', 'Empresa ou proprietário não encontrado');
      return;
    }

    // Se o atendimento NÃO for apenas em domicílio, validamos o endereço físico
    if (!homeServiceOnly && !validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // 1. Prepara os dados no formato que o serviço espera
      const addressInput = {
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        streetAddress: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        zipcode: postalCode.trim(),
      };

      // 2. Chama o serviço passando o owner_id da empresa
      // O addressService usará esse ID para atualizar a flag na tabela 'businesses'
      await addressService.saveAddress(
        business.id,
        business.owner_id,
        addressInput,
        homeServiceOnly
      );

      success('Configurações salvas com sucesso!');
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
    homeServiceOnly,

    // Setters
    setCountry,
    setState,
    setCity,
    setNeighborhood,
    setStreet,
    setNumber,
    setComplement,
    setPostalCode,
    setHomeServiceOnly,


    // Actions
    handleSubmit,
    handleCepBlur,
    formatCep,
  };
}
