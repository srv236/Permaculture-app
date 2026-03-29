export interface Produce {
  id: string;
  producer_id: string;
  name: string;
  variety?: string;
  price: string;
  quantity: string;
  image_url?: string;
  created_at?: string;
}

export interface Producer {
  id: string;
  name: string;
  phone: string;
  email: string;
  farm_name: string;
  locations?: string[];
  picture_url?: string;
  has_completed_course?: boolean;
  updated_at?: string;
  produce?: Produce[];
}