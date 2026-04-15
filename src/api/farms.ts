import { supabase } from "@/integrations/supabase/client";
import { Farm } from "@/types/farm";

export const getFarms = async () => {
  const { data, error } = await supabase
    .from('farms')
    .select('*, produce (*)');

  if (error) throw error;
  return data as Farm[];
};

export const getNetworkFarms = async () => {
  const { data, error } = await supabase
    .from('farms')
    .select(`*, produce (*), profiles (*)`);

  if (error) throw error;
  return data as Farm[];
};

export const getFarmsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('farms')
    .select('*, produce (*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data as Farm[];
};

export const getFarmById = async (id: string) => {
  const { data, error } = await supabase
    .from('farms')
    .select('*, produce (*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Farm;
};

export const createFarm = async (farmData: Partial<Farm>) => {
  const { data, error } = await supabase
    .from('farms')
    .insert(farmData)
    .select()
    .single();

  if (error) throw error;
  return data as Farm;
};

export const updateFarm = async (id: string, farmData: Partial<Farm>) => {
  const { data, error } = await supabase
    .from('farms')
    .update(farmData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Farm;
};

export const deleteFarm = async (id: string) => {
  const { error } = await supabase
    .from('farms')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
