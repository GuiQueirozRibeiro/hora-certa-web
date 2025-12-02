import { createClient } from '@/lib/supabase/client';
import type { Business, CreateBusinessData } from '@/types/auth';

export const businessService = {
  /**
   * Cria uma nova empresa vinculada ao usuário logado
   */
  async createBusiness(data: CreateBusinessData): Promise<Business> {
    const supabase = createClient();

    // Tenta obter usuário via getSession primeiro (mais rápido e confiável)
    try {
      const { data: { session } } = await Promise.race([
        supabase.auth.getSession(),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout getSession')), 3000)
        )
      ]);
      
      if (session?.user) {
        const user = session.user;
        
        const { data: business, error: insertError } = await supabase
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

        if (insertError) {
          throw new Error(`Erro ao criar empresa: ${insertError.message}`);
        }

        return business;
      }
    } catch (err) {
      // Se getSession falhar, tenta getUser como fallback
    }

    // Fallback: tenta getUser
    const { data: { user }, error: userError } = await Promise.race([
      supabase.auth.getUser(),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao obter usuário')), 5000)
      )
    ]);

    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const { data: business, error: insertError } = await supabase
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

    if (insertError) {
      throw new Error(`Erro ao criar empresa: ${insertError.message}`);
    }

    return business;
  },

  /**
   * Busca a empresa do usuário logado
   * TEMPORÁRIO: Retorna null se demorar muito (permite continuar o fluxo)
   */
  async getBusinessByOwnerId(ownerId: string): Promise<Business | null> {
    const supabase = createClient();

    try {
      // Tenta uma busca simples primeiro
      const simpleQuery = supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', ownerId)
        .limit(1);

      const { data: simpleData, error: simpleError } = await Promise.race([
        simpleQuery,
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        )
      ]);

      if (simpleError || !simpleData) {
        return null;
      }

      if (Array.isArray(simpleData) && simpleData.length === 0) {
        return null;
      }

      // Se encontrou, busca os dados completos
      const { data: fullData, error: fullError } = await Promise.race([
        supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', ownerId)
          .single(),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]);

      if (fullError || !fullData) {
        return null;
      }

      return fullData as Business;
      
    } catch (err: any) {
      return null;
    }
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
   * Upload de imagem da empresa (logo ou capa)
   */
  async uploadBusinessImage(
    businessId: string, 
    file: File, 
    type: 'logo' | 'cover'
  ): Promise<string> {
    const supabase = createClient();
    
    // Gera nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}_${type}_${Date.now()}.${fileExt}`;
    const filePath = `businesses/${businessId}/${fileName}`;

    // Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('business-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    // Obtém URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);

    // Atualiza o registro da empresa com a URL da imagem
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
    
    // Extrai o caminho do arquivo da URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('businesses')).join('/');

    // Remove do storage
    const { error } = await supabase.storage
      .from('business-images')
      .remove([filePath]);

    if (error) {
      console.warn('Erro ao deletar imagem do storage:', error);
    }

    // Remove a referência do banco
    const updateField = type === 'logo' ? 'image_url' : 'cover_image_url';
    await this.updateBusiness(businessId, { [updateField]: null } as any);
  },
};
