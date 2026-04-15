import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Profile } from "@/types/auth";

const UserIdSchema = z.string().uuid();

export const getUserProfile = async (id: string) => {
  const validation = UserIdSchema.safeParse(id);
  if (!validation.success) {
    throw new Error("Invalid User ID format.");
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', validation.data)
    .single();

  if (error) throw error;
  return data;
};

export const getSessionProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, is_admin, is_verified, picture_url, phone, alt_phone, email, about, basic_course_date, advanced_course_date, facebook_url, instagram_url, youtube_url, website_url, has_completed_basic, has_completed_advanced')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
};

export const createProfile = async (profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData);
  if (error) throw error;
  return data;
};

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
};

export const deleteProfile = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
