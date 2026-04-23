import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get visible profiles (verified and not hidden)
    const { count: totalPermafolk } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true)
      .eq('is_hidden', false);

    // Get farms belonging to visible profiles
    const { data: visibleFarms, error: farmError } = await supabaseAdmin
      .from('farms')
      .select('id, size_value, size_unit, profiles!inner(is_hidden, is_verified)')
      .eq('profiles.is_hidden', false)
      .eq('profiles.is_verified', true);

    if (farmError) throw farmError;

    const totalFarms = visibleFarms?.length || 0;

    // Calculate total farm size (standardized to Hectares)
    const totalSizeHectares = (visibleFarms || []).reduce((acc, farm) => {
      const val = farm.size_value || 0;
      return acc + (farm.size_unit === 'Acre' ? val * 0.404686 : val);
    }, 0);

    // Get produce belonging to visible farms
    const { count: totalProduce } = await supabaseAdmin
      .from('produce')
      .select('id, farms!inner(profiles!inner(is_hidden, is_verified))', { count: 'exact', head: true })
      .eq('farms.profiles.is_hidden', false)
      .eq('farms.profiles.is_verified', true);

    return new Response(
      JSON.stringify({
        totalPermafolk: totalPermafolk || 0,
        totalFarms: totalFarms,
        totalProduce: totalProduce || 0,
        totalFarmSize: `${totalSizeHectares.toFixed(1)} Ha`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("[get-public-stats] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})