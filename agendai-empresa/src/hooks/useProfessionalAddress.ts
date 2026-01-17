/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProfessionalAddress.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';
import { professionalAddressService } from '@/services/professionalAddressService';
import type { CreateProfessionalAddressDTO } from '@/services/professionalAddressService';

interface UseProfessionalAddressProps {
  professionalId?: string; // Opcional, usado apenas na edição
}

export function useProfessionalAddress({ professionalId }: UseProfessionalAddressProps = {}) {
  const { error: showError } = useToast();

  // Estados do endereço
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [addressId, setAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega endereço existente se estiver editando
  useEffect(() => {
    async function loadAddress() {
      if (!professionalId) return;

      setIsLoading(true);
      try {
        const address = await professionalAddressService.getAddressByProfessionalId(professionalId);
        
        if (address) {
          setAddressId(address.id);
          setStreet(address.street);
          setNumber(address.number);
          setComplement(address.complement || '');
          setNeighborhood(address.neighborhood);
          setCity(address.city);
          setState(address.state);
          setZipCode(address.zip_code);
        }
      } catch (err: any) {
        console.error('Erro ao carregar endereço:', err);
        // Não mostra erro ao usuário se não encontrar endereço (é opcional)
      } finally {
        setIsLoading(false);
      }
    }

    loadAddress();
  }, [professionalId]);

  // Verifica se algum campo de endereço foi preenchido
  const hasAddressData = useCallback(() => {
    return Boolean(
      street.trim() ||
      number.trim() ||
      complement.trim() ||
      neighborhood.trim() ||
      city.trim() ||
      state.trim() ||
      zipCode.trim()
    );
  }, [street, number, complement, neighborhood, city, state, zipCode]);

  // Valida campos obrigatórios do endereço (se houver dados)
  const validateAddress = useCallback((): string | null => {
    // Se não tem nenhum dado, não valida (endereço é opcional)
    if (!hasAddressData()) {
      return null;
    }

    // Se tem algum dado, valida campos obrigatórios
    if (!street.trim()) return 'Rua é obrigatória quando endereço é informado';
    if (!number.trim()) return 'Número é obrigatório quando endereço é informado';
    if (!neighborhood.trim()) return 'Bairro é obrigatório quando endereço é informado';
    if (!city.trim()) return 'Cidade é obrigatória quando endereço é informado';
    if (!state.trim()) return 'Estado é obrigatório quando endereço é informado';
    if (!zipCode.trim()) return 'CEP é obrigatório quando endereço é informado';

    // Valida formato do CEP
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(zipCode)) {
      return 'CEP inválido';
    }

    return null;
  }, [street, number, neighborhood, city, state, zipCode, hasAddressData]);

  // Salva ou atualiza endereço
  const saveAddress = useCallback(
    async (professionalId: string) => {
      // Se não tem dados, não faz nada (endereço é opcional)
      if (!hasAddressData()) {
        return null;
      }

      // Valida campos
      const validationError = validateAddress();
      if (validationError) {
        showError('Erro de validação', validationError);
        throw new Error(validationError);
      }

      try {
        const addressData: CreateProfessionalAddressDTO = {
          professional_id: professionalId,
          street: street.trim(),
          number: number.trim(),
          complement: complement.trim() || undefined,
          neighborhood: neighborhood.trim(),
          city: city.trim(),
          state: state.trim(),
          zip_code: zipCode.replace(/\D/g, ''), // Remove formatação
          country: 'Brasil',
        };

        const savedAddress = await professionalAddressService.upsertAddress(addressData);
        setAddressId(savedAddress.id);
        return savedAddress;
      } catch (err: any) {
        showError('Erro ao salvar endereço', err.message);
        throw err;
      }
    },
    [street, number, complement, neighborhood, city, state, zipCode, hasAddressData, validateAddress, showError]
  );

  // Limpa todos os campos
  const clearAddress = useCallback(() => {
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setZipCode('');
    setAddressId(null);
  }, []);

  return {
    // Estados
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
    addressId,
    isLoading,

    // Setters
    setStreet,
    setNumber,
    setComplement,
    setNeighborhood,
    setCity,
    setState,
    setZipCode,

    // Métodos
    hasAddressData,
    validateAddress,
    saveAddress,
    clearAddress,
  };
}