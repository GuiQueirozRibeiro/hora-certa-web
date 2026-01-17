// src/services/professionalAddressService.ts
import { createClient } from '@/lib/supabase/client';

export interface ProfessionalAddress {
    id: string;
    professional_id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude?: number;
    longitude?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProfessionalAddressDTO {
    professional_id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}

export const professionalAddressService = {
    /**
     * Busca endereço de um profissional
     */
    async getAddressByProfessionalId(professionalId: string): Promise<ProfessionalAddress | null> {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('addresses_professionals')
            .select('*')
            .eq('professional_id', professionalId)
            .maybeSingle(); // Troque .single() por .maybeSingle()

        if (error) {
            // Agora o maybeSingle retorna null se não houver dados, evitando erros desnecessários
            throw new Error(`Erro ao buscar endereço: ${error.message}`);
        }

        return data;
    },

  /**
   * Cria um novo endereço para profissional
   */
  async createAddress(address: CreateProfessionalAddressDTO): Promise<ProfessionalAddress> {
        const supabase = createClient();

        const addressData = {
            ...address,
            country: address.country || 'Brasil',
        };

        const { data, error } = await supabase
            .from('addresses_professionals')
            .insert(addressData)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar endereço do profissional: ${error.message}`);
        }

        return data;
    },

    /**
     * Atualiza endereço de um profissional
     */
    async updateAddress(
        addressId: string,
        updates: Partial<CreateProfessionalAddressDTO>
    ): Promise<ProfessionalAddress> {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('addresses_professionals')
            .update(updates)
            .eq('id', addressId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar endereço do profissional: ${error.message}`);
        }

        return data;
    },

    /**
     * Deleta endereço de um profissional
     */
    async deleteAddress(addressId: string): Promise<void> {
        const supabase = createClient();

        const { error } = await supabase
            .from('addresses_professionals')
            .delete()
            .eq('id', addressId);

        if (error) {
            throw new Error(`Erro ao deletar endereço do profissional: ${error.message}`);
        }
    },

    /**
     * Cria ou atualiza endereço de um profissional
     */
    async upsertAddress(address: CreateProfessionalAddressDTO): Promise<ProfessionalAddress> {
        const supabase = createClient();

        // Primeiro verifica se já existe endereço
        const existingAddress = await this.getAddressByProfessionalId(address.professional_id);

        if (existingAddress) {
            // Atualiza endereço existente
            return await this.updateAddress(existingAddress.id, address);
        } else {
            // Cria novo endereço
            return await this.createAddress(address);
        }
    },
};