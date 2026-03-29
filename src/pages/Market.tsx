"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { Producer } from "@/types/farm";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Filter, Sprout, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Market = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  useEffect(() => {
    const fetchProducers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            produce (*)
          `);

        if (error) throw error;
        setProducers(data || []);
      } catch (error) {
        console.error("Error fetching producers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, []);

  const filteredProducers = producers.filter(p => {
    const matchesSearch = 
      p.farm_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.produce?.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCertified = certifiedOnly ? p.has_completed_course : true;
    
    return matchesSearch && matchesCertified;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-sm font-medium mb-6">
              <Sprout className="w-4 h-4" />
              Direct from Farm
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Permaculture Market</h1>
            <p className="text-emerald-100 text-lg">
              Support local producers who are regenerating the earth. 
              Buy nutrient-dense, chemical-free produce directly from the source.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-8 pb-20">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Search by farm, producer, or produce..." 
              className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
            <CheckCircle2 className={`w-5 h-5 ${certifiedOnly ? 'text-emerald-600' : 'text-slate-300'}`} />
            <Label htmlFor="certified-filter" className="text-sm font-bold text-slate-600 cursor-pointer">
              Certified Only
            </Label>
            <Switch 
              id="certified-filter" 
              checked={certifiedOnly} 
              onCheckedChange={setCertifiedOnly}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-[2rem]" />
              </div>
            ))}
          </div>
        ) : filteredProducers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducers.map((producer) => (
              <ProducerCard key={producer.id} producer={producer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white inline-block p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <p className="text-slate-500 text-lg">No producers found matching your search.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setCertifiedOnly(false);
                }}
                className="text-emerald-600 font-bold mt-2 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Market;