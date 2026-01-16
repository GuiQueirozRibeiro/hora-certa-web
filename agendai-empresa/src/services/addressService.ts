// src/services/addressService.ts
import { createClient } from '@/lib/supabase/client';
import { Address, AddressInput } from '../types/address';

export const addressService = {
  
  async getAddress(businessId: string): Promise<any | null> {
    const supabase = createClient();
    
    // CORREÇÃO: Usando a tabela correta 'addresses_businesses'
    const { data, error } = await supabase
      .from('addresses_businesses') 
      .select('*')
      .eq('business_id', businessId)
      .eq('is_primary', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; 
      throw new Error(error.message);
    }
    return data;
  },

  async saveAddress(
    businessId: string, 
    ownerId: string,
    address: any, 
    homeServiceOnly: boolean
  ): Promise<void> {
    const supabase = createClient();

    // 1. Atualizar a flag na tabela 'businesses' usando o ownerId
    const { error: bizError } = await supabase
      .from('businesses')
      .update({ home_service_only: homeServiceOnly })
      .eq('owner_id', ownerId);

    if (bizError) throw new Error(`Erro ao atualizar perfil: ${bizError.message}`);

    // 2. Preparar os dados para a tabela 'addresses_businesses'
    const dbPayload = {
      business_id: businessId,
      country: address.country,
      state: address.state,
      city: address.city,
      // Se for apenas online, limpamos os campos físicos
      neighborhood: homeServiceOnly ? null : address.neighborhood,
      street_address: homeServiceOnly ? null : address.streetAddress,
      number: homeServiceOnly ? null : address.number,
      complement: homeServiceOnly ? null : address.complement,
      zipcode: homeServiceOnly ? null : address.zipcode,
      is_primary: true,
    };

    const existing = await this.getAddress(businessId);

    if (existing) {
      const { error } = await supabase
        .from('addresses_businesses')
        .update(dbPayload)
        .eq('id', existing.id);
      
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('addresses_businesses')
        .insert(dbPayload);

      if (error) throw new Error(error.message);
    }
  }
};