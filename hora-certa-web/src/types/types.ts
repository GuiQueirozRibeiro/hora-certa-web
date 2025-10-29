export type OpeningHours = {
  [key: string]: {
    open: string;
    close: string;
    isClosed?: boolean;
  };
};

export type Business = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  business_type: string | null;
  whatsapp_link: string | null;
  image_url: string | null;
  cover_image_url: string | null;
  opening_hours: OpeningHours | null;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  street_address: string | null;
  number: string | null;
  complement: string | null;
  zipcode: string | null;
  is_primary: boolean;
  created_at: string;
};

export type BusinessWithAddress = Business & {
  address?: Address;
};