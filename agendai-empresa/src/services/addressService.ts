// src/services/addressService.ts
import { createClient } from '@/lib/supabase/client';
import { Address, AddressInput } from '../types/address';

export const addressService = {
  
  // 1. Buscar o endereço principal do usuário
  async getAddress(userId: string): Promise<Address | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true) // Assume que queremos o principal
      .single(); // Espera apenas um resultado

    if (error) {
      // Código P2006 ou similar é "não encontrado", não é erro crítico
      if (error.code === 'PGRST116') return null; 
      throw new Error(error.message);
    }

    // Mapper manual simples (converte snake_case do banco para camelCase)
    return {
      id: data.id,
      userId: data.user_id,
      country: data.country,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      streetAddress: data.street_address,
      number: data.number,
      complement: data.complement,
      zipcode: data.zipcode,
      isPrimary: data.is_primary,
    };
  },

  // 2. Salvar (Upsert: Cria ou Atualiza)
  async saveAddress(userId: string, address: AddressInput): Promise<void> {
    const supabase = createClient();

    // Prepara o objeto no formato do banco (snake_case)
    const dbPayload = {
      user_id: userId,
      country: address.country,
      state: address.state,
      city: address.city,
      neighborhood: address.neighborhood,
      street_address: address.streetAddress,
      number: address.number,
      complement: address.complement,
      zipcode: address.zipcode,
      is_primary: true, // Força ser o principal
    };

    // Verifica se já existe para atualizar ou criar
    // Dica: O ideal seria ter o ID para update, mas vamos usar 'upsert' com user_id se tiver constraint única, 
    // ou fazer uma busca antes. Para simplificar, vamos buscar o ID.
    
    const existing = await this.getAddress(userId);

    if (existing) {
      // UPDATE
      const { error } = await supabase
        .from('addresses')
        .update(dbPayload)
        .eq('id', existing.id);
      
      if (error) throw new Error(error.message);
    } else {
      // CREATE
      const { error } = await supabase
        .from('addresses')
        .insert(dbPayload);

      if (error) throw new Error(error.message);
    }
  }
};