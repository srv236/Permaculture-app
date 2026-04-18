import { supabase } from "@/integrations/supabase/client";
import { Produce } from "@/types/farm";

export const getAllProduce = async () => {
  const { data, error } = await supabase
    .from('produce')
    .select(`
      *, 
      farms(
        name, 
        profiles(is_hidden)
      )
    `);

  if (error) throw error;
  return data as (Produce & { farms?: { name: string, profiles?: { is_hidden: boolean } } })[];
};

export const getProduceByFarm = async (farmId: string) => {
  const { data, error } = await supabase
    .from('produce')
    .select('*')
    .eq('farm_id', farmId);

  if (error) throw error;
  return data as Produce[];
};

export const createProduce = async (produceData: Partial<Produce>) => {
  const { data, error } = await supabase
    .from('produce')
    .insert(produceData)
    .select()
    .single();

  if (error) throw error;
  return data as Produce;
};

export const updateProduce = async (id: string, produceData: Partial<Produce>) => {
  const { data, error } = await supabase
    .from('produce')
    .update(produceData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Produce;
};

export const deleteProduce = async (id: string) => {
  const { error } = await supabase
    .from('produce')
    .delete()
    .eq('id', id);

  if (error) throw error;
};