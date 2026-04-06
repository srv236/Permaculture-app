"use client";

export interface Produce {
  id: string;
  farm_id: string;
  name: string;
  variety?: string; // e.g. "Heirloom", "Alphonso", etc.
  category: string; // seeds, fruit, etc.
  price_value: number;
  price_unit: string; // units, g, dozen, kg, tonne
  quantity_value: number;
  quantity_unit: string;
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
  size_value: number;
  size_unit: "Acre" | "Hectare";
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