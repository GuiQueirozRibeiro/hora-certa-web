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
        whatsapp_number: data.whatsapp_number,
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
   * Upload de imagem dos funcionários
   */
  async uploadProfessionalImage(businessId: string, file: File) {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

    // CAMINHO CORRETO: Vai para a pasta professionals
    const filePath = `businesses/${businessId}/professionals/${fileName}`;

    const { error } = await supabase.storage
      .from('business-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Upload de imagem dos serviços
   */
  async uploadServiceImage(businessId: string, file: File) {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

    // CAMINHO CORRETO: Vai para a pasta services
    const filePath = `businesses/${businessId}/services/${fileName}`;

    const { error } = await supabase.storage
      .from('business-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Upload de imagem da empresa (Logo, Capa, Galeria)
   */
  async uploadBusinessImage(
    businessId: string,
    file: File,
    type: 'logo' | 'cover' | 'gallery'
  ): Promise<string> {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = `businesses/${businessId}/${type}/${fileName}`;

    if (type !== 'gallery') {
    const { data: currentBusiness } = await supabase
      .from('businesses')
      .select('image_url, cover_image_url')
      .eq('id', businessId)
      .single();

      const oldUrl = type === 'logo' ? currentBusiness?.image_url : currentBusiness?.cover_image_url;

      if (oldUrl) {
      const oldPath = oldUrl.split('/').slice(-4).join('/'); // Pega 'businesses/ID/logo/file.jpg'
      await supabase.storage.from('business-images').remove([oldPath]);
    }
  }

  const { error: uploadError } = await supabase.storage
    .from('business-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) throw new Error(`Erro ao fazer upload: ${uploadError.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from('business-images')
    .getPublicUrl(filePath);

  // 4. Atualiza o banco com a nova URL
  if (type !== 'gallery') {
    const updateField = type === 'logo' ? 'image_url' : 'cover_image_url';
    await this.updateBusiness(businessId, { [updateField]: publicUrl } as any);
  }

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.updateBusiness(businessId, { [updateField]: null } as any);
  },
};
