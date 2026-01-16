// src/hooks/useAddress.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth'; // Seu hook de auth
import { addressService } from '@/services/addressService';
import { AddressInput } from '@/types/address';
import { useToast } from './useToast'; // Assumindo que você tem um toast

export function useAddress() {
  const { user, business } = useAuth();
  const { success, error: toastError } = useToast(); 
  
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [address, setAddress] = useState<AddressInput | null>(null);

  const saveAddress = async (data: AddressInput) => {
    // Validação para garantir que business e user existem
    if (!user?.id || !business?.id) {
      toastError('Erro', 'Usuário ou empresa não identificados.');
      return;
    }

    try {
      setSaving(true);
      
      // Chamada com os 4 argumentos conforme definido no seu service
      await addressService.saveAddress(
        business.id,        // businessId
        user.id,            // ownerId
        data,               // objeto do endereço
        homeServiceOnly     // booleano do atendimento domiciliar
      );

      setAddress(data);
      success('Sucesso', 'Endereço salvo com sucesso!');
    } catch (err: any) {
      console.error(err);
      toastError('Erro', 'Falha ao salvar endereço');
    } finally {
      setSaving(false);
    }
  };

  return {
    address,
    saveAddress,
    isSaving,
    homeServiceOnly,
    setHomeServiceOnly,
  };
}