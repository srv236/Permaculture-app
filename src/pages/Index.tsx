import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { FarmMap } from "@/components/FarmMap";
import { ImpactHero } from "@/components/ImpactHero";
import { HowItWorks } from "@/components/HowItWorks";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Sprout, Loader2, Map as MapIcon, User, ShoppingBasket, Globe, Lock } from "lucide-react";
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

const Index = () => {
  const { user } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");
  const [stats, setStats] = useState({
    locations: 0,
    acres: 0,
    products: 0,
    farms: 0,
    permafolk: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch basic counts for the impact hero (publicly accessible)
        const { data: farmsData } = await supabase.from('farms').select('id, size, address');
        const { data: profilesData } = await supabase.from('profiles').select('id, is_verified');
        const { data: produceData } = await supabase.from('produce').select('id');

        const totalAcres = farmsData?.reduce((acc, farm) => {
          const sizeNum = parseFloat(farm.size?.replace(/[^0-9.]/g, '') || '0');
          return acc + sizeNum;
        }, 0) || 0;

        setStats({
          locations: farmsData?.filter(f => f.address).length || 0,
          acres: Math.round(totalAcres),
          products: produceData?.length || 0,
          farms: farmsData?.length || 0,
          permafolk: profilesData?.filter(p => p.is_verified).length || 0
        });

        // Only fetch full directory data if user is logged in
        if (user) {
          const [directoryRes, profilesRes, fullProduceRes] = await Promise.all([
            supabase.from('farms').select('*, produce (*)'),
            supabase.from('profiles').select('*'),
            supabase.from('produce').select('*')
          ]);

          if (directoryRes.data) setFarms(directoryRes.data as any);
          if (profilesRes.data) setPermafolk(profilesRes.data as any);
          if (fullProduceRes.data) setProduce(fullProduceRes.data as any);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-24 px-4 relative overflow-hidden">
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
            Regenerative <span className="text-emerald-400">Impact</span>
          </h1>
          <p className="text-emerald-100/80 text-lg md:text-xl mb-10 leading-relaxed">
            Connecting communities with verified permaculture practitioners 
            to build a sustainable and resilient food future.
          </p>
          
          {!user && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 rounded-2xl h-14 text-lg font-bold">
                  Join the Network
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 rounded-2xl h-14 text-lg font-bold backdrop-blur-sm">
                  Sign In to Browse
                </Button>
              </Link>
            </div>
          )}

          {user && (
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
              <Input 
                className="pl-14 h-16 bg-white text-slate-900 rounded-2xl border-none shadow-2xl text-lg focus-visible:ring-emerald-500"
                placeholder="Search farms, produce, or permafolk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="text-slate-400 font-medium">Loading impact data...</p>
          </div>
        ) : (
          <>
            <ImpactHero stats={stats} />
            
            {!user ? (
              <div className="space-y-20">
                <HowItWorks />
                <div className="bg-emerald-50 rounded-[48px] p-12 text-center border border-emerald-100">
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Lock className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-900 mb-4">Access the Full Directory</h2>
                  <p className="text-emerald-700 mb-8 max-w-md mx-auto">
                    Sign in to view detailed farm profiles, current harvests, and contact information for our verified practitioners.
                  </p>
                  <Link to="/login">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl">
                      Login to View Directory
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
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

                <TabsContent value="farms" className="mt-0">
                  {filteredFarms.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredFarms.map(farm => (
                        <ProducerCard 
                          key={farm.id} 
                          producer={{
                            id: farm.user_id,
                            name: (farm as any).profiles?.name || "Unknown",
                            phone: "", 
                            email: "", 
                            farm_name: farm.name,
                            picture_url: farm.picture_url,
                            is_verified: (farm as any).profiles?.is_verified || false,
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
              </Tabs>
            )}
          </>
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