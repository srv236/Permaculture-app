"use client";

export interface Produce {
  id: string;
  farm_id: string;
  name: string;
  variety?: string;
  category: string;
  description?: string;
  price: string;
  quantity: string;
  image_url: string;
  tags?: string[];
  created_at?: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  about?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  size?: string;
  picture_url?: string;
  tags?: string[];
  produce?: Produce[];
  created_at: string;
}

export interface Producer {
  id: string;
  name: string;
  phone: string;
  alt_phone?: string;
  email: string;
  about?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  website_url?: string;
  has_completed_basic: boolean;
  basic_course_date?: string;
  has_completed_advanced: boolean;
  advanced_course_date?: string;
  is_verified: boolean;
  is_admin: boolean;
  picture_url?: string;
  farms?: Farm[];
  created_at?: string;
  is_hidden?: boolean;
  // Flattened properties for UI components and mock data
  farm_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  produce?: Produce[];
  locations?: string[];
  tags?: string[];
  has_completed_course?: boolean;
}