"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { StatsSummary } from "@/components/StatsSummary";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { MapDisplay } from "@/components/MapDisplay";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Sprout, 
  Loader2, 
  Map as MapIcon, 
  User, 
  ShoppingBasket, 
  Filter, 
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  Users,
  Leaf
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer, Produce } from "@/types/farm";
import { cn } from "@/lib/utils";
import { showError } from "@/utils/toast";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains & Pulses",
  "Herbs & Spices",
  "Dairy & Eggs",
  "Honey & Preserves",
  "Seeds & Saplings"
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [directoryRes, profilesRes, produceRes] = await Promise.all([
          supabase.rpc('get_public_directory'),
          supabase.rpc('get_public_profiles'),
          supabase.from('produce').select('*')
        ]);

        if (directoryRes.data && produceRes.data) {
          const mappedFarms = directoryRes.data.map((farm: any) => ({
            ...farm,
            producer: {
              id: farm.user_id,
              name: farm.producer_name,
              picture_url: farm.producer_picture_url,
              is_verified: farm.producer_is_verified
            },
            produce: (produceRes.data || []).filter(p => p.farm_id === farm.id)
          })) || [];
          setFarms(mappedFarms as any);
        }

        if (profilesRes.data) {
          setPermafolk(profilesRes.data as any);
        }

        if (produceRes.data) {
          setProduce(produceRes.data as any);
        }
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      farm.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.produce?.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || 
      farm.produce?.some(p => p.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const filteredPermafolk = permafolk.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProduce = produce.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.variety?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-200 text-sm font-medium mb-8 border border-emerald-700/50">
            <Sprout className="w-4 h-4" />
            The Art of Living Permaculture Network
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Regenerating the Earth, <br />
            <span className="text-emerald-400">One Farm at a Time.</span>
          </h1>
          <p className="text-emerald-100/80 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Connect with certified permaculture practitioners and discover 
            the bounty of regenerative agriculture.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6" />
            <Input 
              className="pl-16 h-20 bg-white text-slate-900 rounded-[32px] border-none shadow-2xl text-xl focus-visible:ring-emerald-500"
              placeholder="Search farms, produce, or practitioners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {!loading && !searchQuery && (
          <StatsSummary 
            totalProducers={permafolk.length}
            totalProducts={produce.length}
            totalLocations={farms.length}
          />
        )}

        <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
            <TabsList className="bg-white p-1.5 h-auto rounded-[24px] shadow-sm border border-emerald-100">
              <TabsTrigger value="farms" className="rounded-[20px] px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-lg font-medium">
                <MapIcon className="w-5 h-5 mr-2" />
                Farms
              </TabsTrigger>
              <TabsTrigger value="produce" className="rounded-[20px] px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-lg font-medium">
                <ShoppingBasket className="w-5 h-5 mr-2" />
                Harvest
              </TabsTrigger>
              <TabsTrigger value="permafolk" className="rounded-[20px] px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-lg font-medium">
                <User className="w-5 h-5 mr-2" />
                Permafolk
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              {activeTab === "farms" && (
                <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
                  <Button 
                    variant={viewMode === "grid" ? "default" : "ghost"} 
                    size="sm" 
                    className={cn("rounded-lg", viewMode === "grid" && "bg-emerald-600")}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                  <Button 
                    variant={viewMode === "map" ? "default" : "ghost"} 
                    size="sm" 
                    className={cn("rounded-lg", viewMode === "map" && "bg-emerald-600")}
                    onClick={() => setViewMode("map")}
                  >
                    <MapIcon className="w-4 h-4 mr-2" />
                    Map
                  </Button>
                </div>
              )}
              {!loading && (
                <p className="text-sm text-slate-500 font-bold bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm uppercase tracking-wider">
                  {activeTab === "farms" ? filteredFarms.length : 
                   activeTab === "produce" ? filteredProduce.length : 
                   filteredPermafolk.length} Results
                </p>
              )}
            </div>
          </div>

          {(activeTab === "farms" || activeTab === "produce") && (
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {CATEGORIES.map(cat => (
                <Badge 
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-6 py-2.5 rounded-full transition-all text-sm font-semibold",
                    selectedCategory === cat 
                      ? "bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-200" 
                      : "bg-white hover:bg-emerald-50 border-emerald-100 text-emerald-700"
                  )}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
              <p className="text-slate-400 text-xl font-medium">Cultivating the network...</p>
            </div>
          ) : (
            <>
              <TabsContent value="farms" className="mt-0">
                {viewMode === "map" ? (
                  <MapDisplay farms={filteredFarms} />
                ) : (
                  filteredFarms.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {filteredFarms.map(farm => (
                        <ProducerCard 
                          key={farm.id} 
                          producer={{
                            id: farm.user_id,
                            name: (farm as any).producer?.name || "Unknown",
                            phone: "", 
                            email: "", 
                            farm_name: farm.name,
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
                    <EmptyState message="No farms found matching your search." />
                  )
                )}
              </TabsContent>

              <TabsContent value="produce" className="mt-0">
                {filteredProduce.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProduce.map(item => (
                      <ProduceCard key={item.id} produce={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No produce found matching your search." />
                )}
              </TabsContent>

              <TabsContent value="permafolk" className="mt-0">
                {filteredPermafolk.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredPermafolk.map(person => (
                      <PermafolkCard key={person.id} permafolk={person} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No permafolk found matching your search." />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* How it Works Section */}
        {!searchQuery && (
          <section className="mt-32 py-24 bg-emerald-50 rounded-[64px] px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-emerald-900 mb-4">How the Network Works</h2>
                <p className="text-emerald-700 font-medium">Building a sustainable future together.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-emerald-100/50 border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">Verified Practitioners</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Every producer is a certified graduate of the Art of Living Permaculture courses, ensuring high standards of regenerative practice.
                  </p>
                </div>
                
                <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-emerald-100/50 border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">Direct Connection</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Connect directly with farmers via WhatsApp or phone. No middlemen, just community-driven commerce.
                  </p>
                </div>
                
                <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-emerald-100/50 border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <Leaf className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">Regenerative Bounty</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Discover seasonal produce grown with love and respect for the soil, biodiversity, and the ecosystem.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <Link to="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 h-14 px-10 rounded-full text-lg shadow-xl shadow-emerald-200">
                    Join as a Producer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t py-24 mt-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
              <Sprout className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">AoL Permaculture Network</h3>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed mb-12">
            Empowering communities through regenerative agriculture and sustainable living practices.
          </p>
          <div className="flex justify-center gap-8 text-slate-400 font-medium">
            <a href="#" className="hover:text-emerald-600 transition-colors">About Us</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Courses</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
          </div>
          <p className="mt-16 text-slate-400 text-sm">
            © 2024 Art of Living Permaculture Department. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-40 bg-white rounded-[48px] border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-slate-300" />
    </div>
    <p className="text-slate-400 text-2xl font-medium">{message}</p>
  </div>
);

export default Index;