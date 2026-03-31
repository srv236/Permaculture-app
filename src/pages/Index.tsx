import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { Input } from "@/components/ui/input";
import { Search, Sprout, Loader2, Map as MapIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer } from "@/types/farm";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('farms')
        .select(`
          *,
          profiles (name, phone, email, is_verified),
          produce (*)
        `);

      if (error) {
        console.error("Error fetching farms:", error);
      } else {
        // Map profiles to the farm object for the ProducerCard component
        const mappedFarms = data?.map(farm => ({
          ...farm,
          producer: farm.profiles
        })) || [];
        setFarms(mappedFarms);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredFarms = farms.filter(farm => {
    const matchesFarm = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       farm.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduce = farm.produce?.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.variety?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesFarm || matchesProduce;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Permaculture Network</h1>
          <p className="text-emerald-100 text-lg mb-8">
            Explore sustainable farms and local produce. 
            Connect directly with certified permaculture practitioners.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
            <Input 
              className="pl-12 h-14 bg-white text-slate-900 rounded-full border-none shadow-lg text-lg"
              placeholder="Search by farm name, location, or produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapIcon className="text-emerald-600" />
            {searchQuery ? `Results for "${searchQuery}"` : "Featured Farms"}
          </h2>
          {!loading && (
            <p className="text-sm text-slate-500 font-medium">
              {filteredFarms.length} farms found
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : filteredFarms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredFarms.map(farm => (
              <ProducerCard 
                key={farm.id} 
                producer={{
                  id: farm.user_id,
                  name: (farm as any).producer?.name || "Unknown",
                  phone: (farm as any).producer?.phone || "",
                  email: (farm as any).producer?.email || "",
                  farm_name: farm.name,
                  locations: farm.address ? [farm.address] : [],
                  picture_url: farm.picture_url,
                  is_verified: (farm as any).producer?.is_verified || false,
                  has_completed_course: true,
                  produce: farm.produce,
                  latitude: farm.latitude,
                  longitude: farm.longitude,
                  google_maps_url: farm.google_maps_url,
                  address: farm.address
                } as any} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">No farms or produce found matching your search.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 Permaculture Department Market. All practitioners are verified graduates of our basic and advanced courses.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;