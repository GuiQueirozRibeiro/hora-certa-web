
export interface Address {
  id: string;
  userId: string; // No banco é user_id
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  streetAddress: string; // No banco é street_address
  number: string;
  complement?: string;
  zipcode: string;
  isPrimary: boolean; // No banco é is_primary
  // created_at não precisa enviar, o banco gera
}

// Tipo para criar/atualizar (sem ID e userId, pois o back resolve)
export type AddressInput = Omit<Address, 'id' | 'userId' | 'isPrimary'>;