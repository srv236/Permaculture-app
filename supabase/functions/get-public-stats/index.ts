import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log("[get-public-stats] Calculating network statistics...");

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Count total practitioners (profiles)
    const { count: permafolkCount, error: permafolkError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (permafolkError) throw permafolkError;

    // 2. Count total harvest items (produce)
    const { count: produceCount, error: produceError } = await supabaseAdmin
      .from('produce')
      .select('*', { count: 'exact', head: true })

    if (produceError) throw produceError;

    // 3. Count total farms and fetch size data for calculation
    const { data: farmsData, count: farmsCount, error: farmsError } = await supabaseAdmin
      .from('farms')
      .select('size', { count: 'exact' })

    if (farmsError) throw farmsError;

    // 4. Compute total land area in hectares
    const totalSizeInHectares = farmsData?.reduce((acc, farm) => {
      if (!farm.size) return acc;
      const parts = farm.size.split(" ");
      const value = parseFloat(parts[0]);
      const unit = parts[1];
      
      if (isNaN(value)) return acc;
      
      // Conversion: 1 Hectare ≈ 2.47105 Acres
      if (unit === "Acre") return acc + (value / 2.47105);
      return acc + value;
    }, 0) || 0;

    const stats = {
      totalPermafolk: permafolkCount || 0,
      totalFarms: farmsCount || 0,
      totalProduce: produceCount || 0,
      totalFarmSize: totalSizeInHectares > 0 ? `${totalSizeInHectares.toFixed(1)} hectares` : "Varies"
    };

    return new Response(
      JSON.stringify(stats),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error("[get-public-stats] Calculation error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})