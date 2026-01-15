import { createClient } from '@/lib/supabase/client';
import type { Service, CreateServiceData } from '@/types/service';

export const serviceService = {
  /**
   * Cria um novo serviço
   */
  async createService(businessId: string, data: CreateServiceData): Promise<Service> {
    const supabase = createClient();

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        business_id: businessId,
        name: data.name,
        description: data.description,
        duration_minutes: data.duration_minutes,
        price: data.price,
        category: data.category,
        image_url: data.image_url,
        is_active: data.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }

    return service;
  },

  /**
   * Busca todos os serviços de uma empresa
   */
  async getServicesByBusinessId(businessId: string): Promise<Service[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar serviços: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Busca um serviço por ID
   */
  async getServiceById(serviceId: string): Promise<Service> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }

    return data;
  },

  /**
   * Atualiza um serviço
   */
  async updateService(serviceId: string, data: Partial<CreateServiceData>): Promise<Service> {
    const supabase = createClient();

    const { data: updatedService, error } = await supabase
      .from('services')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar serviço: ${error.message}`);
    }

    return updatedService;
  },

  /**
   * Deleta um serviço
   */
  async deleteService(serviceId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      throw new Error(`Erro ao deletar serviço: ${error.message}`);
    }
  },

  /**
   * Alterna o status ativo/inativo de um serviço
   */
  async toggleServiceStatus(serviceId: string, isActive: boolean): Promise<Service> {
    return this.updateService(serviceId, { is_active: isActive });
  },
};
