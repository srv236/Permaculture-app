"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { FarmMap } from "@/components/FarmMap";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { HowItWorks } from "@/components/HowItWorks";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Sprout, Loader2, Map as MapIcon, User, ShoppingBasket, Globe, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer, Produce } from "@/types/farm";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/SessionProvider";

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

// Demo data to show when database is empty
const DEMO_FARMS: any[] = [
  {
    id: "demo-1",
    name: "Green Valley Permaculture",
    address: "North Hills, Himachal Pradesh",
    latitude: 32.2190,
    longitude: 76.3234,
    picture_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    producer: { name: "Elena Rodriguez", is_verified: true },
    produce: [
      { id: "p1", name: "Heirloom Tomatoes", price: "₹120/kg", category: "Vegetables", image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400" },
      { id: "p2", name: "Wildflower Honey", price: "₹450/jar", category: "Honey & Preserves", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: "demo-2",
    name: "Earthwise Sanctuary",
    address: "Auroville, Tamil Nadu",
    latitude: 12.0068,
    longitude: 79.8105,
    picture_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    producer: { name: "Marcus Thorne", is_verified: true },
    produce: [
      { id: "p3", name: "Organic Kale", price: "₹80/bunch", category: "Vegetables", image_url: "https://images.unsplash.com/photo-1524179524541-1aa1ece28142?auto=format&fit=crop&q=80&w=400" }
    ]
  }
];

const Index = () => {
  const { user } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [directoryRes, profilesRes, produceRes] = await Promise.all([
          supabase.rpc('get_public_directory'),
          supabase.rpc('get_public_profiles'),
          supabase.from('produce').select('*')
        ]);

        let fetchedFarms = [];
        let fetchedProfiles = [];
        let fetchedProduce = produceRes.data || [];

        if (directoryRes.data && directoryRes.data.length > 0) {
          fetchedFarms = directoryRes.data.map((farm: any) => ({
            ...farm,
            producer: {
              id: farm.user_id,
              name: farm.producer_name,
              picture_url: farm.producer_picture_url,
              is_verified: farm.producer_is_verified
            },
            produce: fetchedProduce.filter(p => p.farm_id === farm.id)
          }));
        }

        if (profilesRes.data && profilesRes.data.length > 0) {
          fetchedProfiles = profilesRes.data;
        }

        // If database is empty, use demo data
        if (fetchedFarms.length === 0 && fetchedProfiles.length === 0) {
          console.log("Database appears empty, showing demo data.");
          setFarms(DEMO_FARMS as any);
          setPermafolk(DEMO_FARMS.map(f => ({ ...f.producer, id: f.id, farm_name: f.name })) as any);
          setProduce(DEMO_FARMS.flatMap(f => f.produce) as any);
          setIsUsingDemoData(true);
        } else {
          setFarms(fetchedFarms as any);
          setPermafolk(fetchedProfiles as any);
          setProduce(fetchedProduce as any);
          setIsUsingDemoData(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to demo data on error
        setFarms(DEMO_FARMS as any);
        setIsUsingDemoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      farm.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  const totalFarms = farms.length;
  const totalProduce = produce.length;
  const totalVerified = permafolk.filter(p => p.is_verified).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-200 text-sm font-medium mb-6 border border-emerald-700/50">
            <Sprout className="w-4 h-4" />
            The Art of Living Permaculture
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Connect with the <span className="text-emerald-400">Permafolk</span>
          </h1>
          <p className="text-emerald-100/80 text-lg md:text-xl mb-10 leading-relaxed">
            Discover sustainable farms, fresh local produce, and the passionate people 
            practicing permaculture in your community.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
            <Input 
              className="pl-14 h-16 bg-white text-slate-900 rounded-2xl border-none shadow-2xl text-lg focus-visible:ring-emerald-500"
              placeholder="Search farms, produce, or permafolk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {isUsingDemoData && !loading && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Sprout className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Viewing Demo Data</p>
                <p className="text-xs text-amber-700">Your database is currently empty. Register as a producer to list your own farm!</p>
              </div>
            </div>
            <Link to="/register">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                <PlusCircle className="w-4 h-4 mr-2" />
                Join the Network
              </Button>
            </Link>
          </div>
        )}

        <ImpactMetrics 
          totalFarms={totalFarms}
          totalProduce={totalProduce}
          totalVerified={totalVerified}
        />

        <HowItWorks />

        {user ? (
          <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-6">
              <TabsList className="bg-white p-1 h-auto rounded-2xl shadow-sm border border-emerald-100 flex-wrap justify-center">
                <TabsTrigger value="farms" className="rounded-xl px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <MapIcon className="w-4 h-4 mr-2" />
                  Featured Farms
                </TabsTrigger>
                <TabsTrigger value="map" className="rounded-xl px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="produce" className="rounded-xl px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <ShoppingBasket className="w-4 h-4 mr-2" />
                  Featured Produce
                </TabsTrigger>
                <TabsTrigger value="permafolk" className="rounded-xl px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Featured Permafolk
                </TabsTrigger>
              </TabsList>
            </div>

            {(activeTab === "farms" || activeTab === "produce" || activeTab === "map") && (
              <div className="flex flex-wrap gap-2 mb-12 justify-center">
                {CATEGORIES.map(cat => (
                  <Badge 
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-4 py-1.5 rounded-full transition-all",
                      selectedCategory === cat 
                        ? "bg-emerald-600 hover:bg-emerald-700 border-none" 
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
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                <p className="text-slate-400 font-medium">Loading the network...</p>
              </div>
            ) : (
              <>
                <TabsContent value="farms" className="mt-0">
                  {filteredFarms.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  )}
                </TabsContent>

                <TabsContent value="map" className="mt-0">
                  <FarmMap farms={filteredFarms} />
                </TabsContent>

                <TabsContent value="produce" className="mt-0">
                  {filteredProduce.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 mt-8">
            <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Join the Permaculture Network</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Log in to explore verified farms, browse fresh local produce, and connect with certified practitioners.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">Register</Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            © 2024 Permaculture Department Market. All practitioners are verified graduates of our basic and advanced courses.
          </p>
        </div>
      </footer>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-slate-300" />
    </div>
    <p className="text-slate-400 text-lg font-medium">{message}</p>
  </div>
);

export default Index;