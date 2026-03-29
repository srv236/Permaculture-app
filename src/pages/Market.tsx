import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { Input } from "@/components/ui/input";
import { Search, Sprout, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Producer } from "@/types/farm";

const LOGO_URL = "https://ugc.production.linktr.ee/2709b2db-5589-432c-92ea-5fdce99252ca_aolpclogo.jpeg?io=true&size=avatar-v3_0";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          produce (*)
        `);

      if (error) {
        console.error("Error fetching producers:", error);
      } else {
        setProducers(data || []);
      }
      setLoading(false);
    };

    fetchProducers();
  }, []);

  const filteredProducers = producers.filter(producer => {
    const matchesProducer = (producer.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                           (producer.farm_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesProduce = producer.produce?.some(p => 
      (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
      (p.variety?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
    return matchesProducer || matchesProduce;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-800 shadow-2xl">
              <img 
                src={LOGO_URL} 
                alt="AOLPC Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Fresh from the Forest</h1>
          <p className="text-emerald-100 text-lg mb-8">
            Connect directly with certified permaculture producers in your area. 
            Sustainable, local, and nutrient-dense produce.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
            <Input 
              className="pl-12 h-14 bg-white text-slate-900 rounded-full border-none shadow-lg text-lg"
              placeholder="Search by produce (e.g. Kale) or farm name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sprout className="text-emerald-600" />
            {searchQuery ? `Results for "${searchQuery}"` : "Featured Producers"}
          </h2>
          {!loading && (
            <p className="text-sm text-slate-500 font-medium">
              {filteredProducers.length} producers found
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : filteredProducers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProducers.map(producer => (
              <ProducerCard key={producer.id} producer={producer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">No producers or produce found matching your search.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img src={LOGO_URL} alt="AOLPC Logo" className="w-12 h-12 rounded-full opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 Permaculture Department Market. All producers are verified graduates of our basic and advanced courses.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;