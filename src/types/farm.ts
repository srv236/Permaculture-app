export interface Produce {
  id: string;
  farm_id: string;
  name: string;
  variety: string;
  description?: string;
  price: string;
  quantity: string;
  image_url: string;
  category?: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  size: string;
  picture_url?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  address?: string;
  produce: Produce[];
  created_at: string;
  profiles?: Producer; // Joined profile data
}

export interface Producer {
  id: string;
  name: string;
  phone: string;
  email: string;
  farm_name: string;
  locations: string[];
  picture_url?: string;
  is_verified: boolean;
  has_completed_course: boolean;
  basic_course_date?: string;
  advanced_course_date?: string;
  practitioner_since?: string;
  is_admin?: boolean;
  about?: string;
}