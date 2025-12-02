import { createClient } from '@/lib/supabase/client';
import type { Business, CreateBusinessData } from '@/types/auth';

export const businessService = {
  /**
   * Cria uma nova empresa
   */
  async createBusiness(data: CreateBusinessData): Promise<Business> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        owner_id: user.id,
        name: data.name,
        description: data.description,
        business_type: data.business_type,
        whatsapp_link: data.whatsapp_link,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar empresa: ${error.message}`);
    }

    return business;
  },

  /**
   * Busca a empresa do usuário
   */
  async getBusinessByOwnerId(ownerId: string): Promise<Business | null> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar empresa: ${error.message}`);
    }

    return data as Business;
  },

  /**
   * Verifica se o usuário já possui uma empresa
   */
  async hasBusinessSetup(ownerId: string): Promise<boolean> {
    const business = await this.getBusinessByOwnerId(ownerId);
    return business !== null;
  },

  /**
   * Atualiza dados da empresa
   */
  async updateBusiness(businessId: string, data: Partial<CreateBusinessData>): Promise<Business> {
    const supabase = createClient();

    const { data: updatedBusiness, error } = await supabase
      .from('businesses')
      .update(data)
      .eq('id', businessId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar empresa: ${error.message}`);
    }

    return updatedBusiness;
  },

  /**
   * Upload de imagem da empresa
   */
  async uploadBusinessImage(
    businessId: string, 
    file: File, 
    type: 'logo' | 'cover'
  ): Promise<string> {
    const supabase = createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}_${type}_${Date.now()}.${fileExt}`;
    const filePath = `businesses/${businessId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);

    const updateField = type === 'logo' ? 'image_url' : 'cover_image_url';
    await this.updateBusiness(businessId, { [updateField]: publicUrl } as any);

    return publicUrl;
  },

  /**
   * Remove imagem da empresa
   */
  async deleteBusinessImage(
    businessId: string, 
    imageUrl: string, 
    type: 'logo' | 'cover'
  ): Promise<void> {
    const supabase = createClient();
    
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('businesses')).join('/');

    await supabase.storage
      .from('business-images')
      .remove([filePath]);

    const updateField = type === 'logo' ? 'image_url' : 'cover_image_url';
    await this.updateBusiness(businessId, { [updateField]: null } as any);
  },
};
