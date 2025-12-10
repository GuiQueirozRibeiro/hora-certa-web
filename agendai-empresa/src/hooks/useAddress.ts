// src/hooks/useAddress.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth'; // Seu hook de auth
import { addressService } from '@/services/addressService';
import { AddressInput } from '@/types/address';
import { useToast } from './useToast'; // Assumindo que você tem um toast

export function useAddress() {
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  
  const [address, setAddress] = useState<AddressInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Função para carregar dados
  const loadAddress = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await addressService.getAddress(user.id);
      if (data) {
        // Removemos campos de sistema para ficar compatível com AddressInput
        const { id, userId, isPrimary, ...inputData } = data;
        setAddress(inputData);
      }
    } catch (error) {
      console.error(error);
      showError('Erro', 'Falha ao carregar endereço');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showError]);

  // Carrega ao iniciar
  useEffect(() => {
    loadAddress();
  }, [loadAddress]);

  // Função para salvar
  const saveAddress = async (data: AddressInput) => {
    if (!user?.id) return;
    try {
      setSaving(true);
      await addressService.saveAddress(user.id, data);
      setAddress(data); // Atualiza estado local otimista
      showSuccess('Sucesso', 'Endereço salvo!');
    } catch (error) {
      console.error(error);
      showError('Erro', 'Falha ao salvar endereço');
    } finally {
      setSaving(false);
    }
  };

  return {
    address,
    loading,
    saving,
    saveAddress
  };
}