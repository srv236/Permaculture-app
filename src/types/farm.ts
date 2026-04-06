"use client";

export interface Produce {
  id: string;
  farm_id: string;
  name: string;
  variety?: string;
  category: string;
  price: string; // Maps to 'price' column in DB
  quantity: string; // Maps to 'quantity' column in DB
  image_url: string;
  created_at?: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  size?: string; // Maps to 'size' column in DB
  picture_url?: string;
  produce?: Produce[];
  created_at: string;
}

export interface Producer {
  id: string;
  name: string;
  phone: string;
  email: string;
  about?: string;
  has_completed_basic: boolean;
  basic_completion_date?: string;
  has_completed_advanced: boolean;
  advanced_completion_date?: string;
  is_verified: boolean;
  is_admin: boolean;
  picture_url?: string;
  farms?: Farm[];
  created_at?: string;
}