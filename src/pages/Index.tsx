"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { FarmMap } from "@/components/FarmMap";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sprout, Loader2, Map as MapIcon, User, ShoppingBasket, LogIn, Users, MapPin, Ruler } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer, Produce } from "@/types/farm";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/components/SessionProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains & Pulses",
  "Honey & Preserves",
  "Dairy & Eggs",
  "Herbs & Spices",
  "Seeds & Saplings"
];

const Index = () => {
  const { user, loading: sessionLoading } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<(Produce & { farms?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");
  const [stats, setStats] = useState({
    totalPermafolk: 0,
    totalFarms: 0,
    totalProduce: 0,
    totalFarmSize: "0"
  });

  useEffect(() => {
    // Only fetch data if we have a user (or session has finished loading)
    // to align with the new RLS policies restricting read access to members.
    if (sessionLoading) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch stats (will be 0 for guests due to RLS)
        const { count: permafolkCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: farmsCount, data: farmsData } = await supabase
          .from('farms')
          .select(`*, produce (*), profiles (*)`, { count: 'exact' });

        const { count: produceCount } = await supabase
          .from('produce')
          .select('*', { count: 'exact', head: true });

        const totalSizeInHectares = farmsData?.reduce((acc, farm) => {
          if (!farm.size) return acc;
          const parts = farm.size.split(" ");
          const value = parseFloat(parts[0]);
          const unit = parts[1];
          if (isNaN(value)) return acc;
          if (unit === "Acre") return acc + (value / 2.47105);
          return acc + value;
        }, 0) || 0;

        setStats({
          totalPermafolk: permafolkCount || 0,
          totalFarms: farmsCount || 0,
          totalProduce: produceCount || 0,
          totalFarmSize: totalSizeInHectares > 0 ? `${totalSizeInHectares.toFixed(1)} hectares` : "Varies"
        });

        if (farmsData) setFarms(farmsData as any);

        const { data: profilesData } = await supabase.from('profiles').select('*');
        if (profilesData) setPermafolk(profilesData as any);

        const { data: produceData } = await supabase.from('produce').select('*, farms(name)');
        if (produceData) setProduce(produceData as any);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, sessionLoading]);

  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      farm.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.produce?.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || farm.produce?.some(p => p.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredPermafolk = permafolk.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredProduce = produce.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.variety?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-16 py-8 border-y border-slate-200 bg-white/50 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalPermafolk}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Permafolk</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShoppingBasket className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalProduce}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Products</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalFarms}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Locations</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Ruler className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalFarmSize}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Area</span>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-emerald-600" />
              Farm Network Map
            </h2>
            <Badge variant="outline" className="bg-white border-emerald-100 text-emerald-700">
              {farms.filter(f => f.latitude && f.longitude).length} Farms Mapped
            </Badge>
          </div>
          <div className="h-[500px] w-full rounded-[40px] overflow-hidden border-8 border-white shadow-2xl relative z-0">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-slate-100">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : user ? (
              <FarmMap farms={farms} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-slate-50 gap-4 p-8 text-center">
                <MapPin className="w-12 h-12 text-slate-300" />
                <div>
                  <h3 className="font-bold text-slate-900">Map View Locked</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Sign in to view exact farm locations and the network map.</p>
                </div>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="rounded-xl">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {!user ? (
          <Card className="border-dashed border-2 border-emerald-200 bg-white py-20 text-center rounded-[40px]">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <LogIn className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">View Full Listings</h2>
                <p className="text-slate-500 max-w-md mx-auto text-lg">
                  Detailed farm listings, produce availability, and practitioner profiles are only visible to verified members.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-lg rounded-xl">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-12 px-8 text-lg rounded-xl">
                    Join the Network
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col items-center mb-12">
              <TabsList className="bg-white p-1.5 h-auto rounded-2xl shadow-md border border-emerald-100 mb-8">
                <TabsTrigger value="farms" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-bold">
                  <MapIcon className="w-5 h-5 mr-2" />
                  Featured Farms
                </TabsTrigger>
                <TabsTrigger value="produce" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-bold">
                  <ShoppingBasket className="w-5 h-5 mr-2" />
                  Featured Produce
                </TabsTrigger>
                <TabsTrigger value="permafolk" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-bold">
                  <User className="w-5 h-5 mr-2" />
                  Featured Permafolk
                </TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {CATEGORIES.map(cat => (
                  <Badge 
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={`cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === cat 
                        ? "bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-200" 
                        : "bg-white hover:bg-emerald-50 border-emerald-100 text-slate-600"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                <p className="text-slate-400 font-medium">Loading the network...</p>
              </div>
            ) : (
              <div className="mt-8">
                <TabsContent value="farms" className="mt-0 focus-visible:ring-0">
                  {filteredFarms.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredFarms.map(farm => (
                        <ProducerCard 
                          key={farm.id} 
                          producer={{
                            id: farm.id,
                            name: (farm as any).profiles?.name || "Practitioner",
                            phone: (farm as any).profiles?.phone || "",
                            email: (farm as any).profiles?.email || "",
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

                <TabsContent value="produce" className="mt-0 focus-visible:ring-0">
                  {filteredProduce.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProduce.map(item => (
                        <ProduceCard key={item.id} produce={item} showFarm />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No produce found matching your search." />
                  )}
                </TabsContent>

                <TabsContent value="permafolk" className="mt-0 focus-visible:ring-0">
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
              </div>
            )}
          </Tabs>
        )}
      </main>

      <footer className="bg-white border-t py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100">
              <Sprout className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-4">The Art of Living Permaculture</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Empowering communities through regenerative agriculture and sustainable living practices.
          </p>
          <div className="flex justify-center gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/register" className="hover:text-emerald-600 transition-colors">Join</Link>
            <Link to="/login" className="hover:text-emerald-600 transition-colors">Login</Link>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-xs">
              © 2024 Permaculture Department Market. All practitioners are verified graduates.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-slate-300" />
    </div>
    <p className="text-slate-400 text-xl font-medium">{message}</p>
    <Button variant="link" className="text-emerald-600 mt-4 font-bold" onClick={() => window.location.reload()}>
      Clear all filters
    </Button>
  </div>
);

export default Index;