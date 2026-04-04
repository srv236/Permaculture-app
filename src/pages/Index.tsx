...
＜/dyad-write>
<dyad-write path="src/components/FarmMap.tsx" description="Fixing Leaflet map rendering and height issues">
...
＜/dyad-write>
<dyad-chat-summary>Fixing stat icons, moving filters below listings, and resolving map display issues＜/dyad-chat-summary></think><dyad-write path="src/pages/Index.tsx" description="Updating landing page with correct stat icons, moving filters below listings, and fixing map display">
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { FarmMap } from "@/components/FarmMap";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sprout, Loader2, Map as MapIcon, User, ShoppingBasket, LogIn, Users, MapPin, ShoppingBag } from "lucide-react";
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
  const { user } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");
  const [stats, setStats] = useState({
    verifiedPermafolk: 0,
    totalFarms: 0,
    totalProduce: 0,
    totalFarmSize: "0"
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { count: verifiedCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true);

        const { count: farmsCount, data: farmsData } = await supabase
          .from('farms')
          .select(`*, produce (*)`, { count: 'exact' });

        const { count: produceCount } = await supabase
          .from('produce')
          .select('*', { count: 'exact', head: true });

        const totalSize = farmsData?.reduce((acc, farm) => {
          const num = parseFloat(farm.size);
          return acc + (isNaN(num) ? 0 : num);
        }, 0) || 0;

        setStats({
          verifiedPermafolk: verifiedCount || 0,
          totalFarms: farmsCount || 0,
          totalProduce: produceCount || 0,
          totalFarmSize: totalSize > 0 ? `${totalSize} hectares` : "Varies"
        });

        if (farmsData) {
          const mappedFarms = farmsData.map(farm => ({
            ...farm,
            producer: farm.profiles
          })) || [];
          setFarms(mappedFarms);
        }

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*');
        if (profilesData) setPermafolk(profilesData as any);

        const { data: produceData } = await supabase
          .from('produce')
          .select('*');
        if (produceData) setProduce(produceData as any);

      } catch (error) {
        console.error("Error fetching data:", error);
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
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-emerald-100 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-3xl font-bold text-slate-900">{stats.verifiedPermafolk}</span>
              <span className="text-sm text-slate-500 font-medium">Verified Permafolk</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-emerald-600 mb-2" />
              <span className="text-3xl font-bold text-slate-900">{stats.totalFarms}</span>
              <span className="text-sm text-slate-500 font-medium">Active Farms</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <ShoppingBasket className="w-8 h-8 text-amber-600 mb-2" />
              <span className="text-3xl font-bold text-slate-900">{stats.totalProduce}</span>
              <span className="text-sm text-slate-500 font-medium">Available Produce</span>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Sprout className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-3xl font-bold text-slate-900">{stats.totalFarmSize}</span>
              <span className="text-sm text-slate-500 font-medium">Total Farm Size</span>
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-emerald-600" />
            Farm Locations
          </h2>
          <div className="h-[500px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-0">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-slate-100">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : (
              <FarmMap farms={farms} />
            )}
          </div>
        </div>

        {/* How to Use Section */}
        <Card className="mb-12 border-emerald-100 bg-emerald-50/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Sprout className="w-6 h-6" />
              How to Use the Network
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-slate-700">
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-emerald-800">1. Browse & Discover</h3>
                <p className="text-sm leading-relaxed">Explore verified permaculture farms, view their current harvest, and connect with certified practitioners in your area.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-emerald-800">2. Filter & Search</h3>
                <p className="text-sm leading-relaxed">Use the search bar and category filters to find specific produce, farms, or permafolk matching your needs.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-emerald-800">3. Connect & Trade</h3>
                <p className="text-sm leading-relaxed">Log in to view full listings, contact farmers directly, and join our sustainable community network.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Section (Auth Guarded) */}
        {!user ? (
          <Card className="border-dashed border-2 border-emerald-200 bg-white py-16 text-center">
            <CardContent className="space-y-4">
              <LogIn className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold text-slate-900">View Full Listings</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                To protect our community and ensure quality, detailed farm listings, produce availability, and practitioner profiles are only visible to verified members.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Join the Network
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
              <TabsList className="bg-white p-1 h-auto rounded-2xl shadow-sm border border-emerald-100">
                <TabsTrigger value="farms" className="rounded-xl px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <MapIcon className="w-4 h-4 mr-2" />
                  Featured Farms
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
                            phone: (farm as any).producer?.phone || "",
                            email: (farm as any).producer?.email || "",
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
                  <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
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
                  <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
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
                  <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
                </TabsContent>
              </>
            )}
          </Tabs>
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

const CategoryFilter = ({ selected, onSelect }: { selected: string; onSelect: (cat: string) => void }) => (
  <div className="flex flex-wrap justify-center gap-2 mt-8 pt-6 border-t border-slate-100">
    {CATEGORIES.map(cat => (
      <Badge 
        key={cat}
        variant={selected === cat ? "default" : "outline"}
        className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-all ${
          selected === cat 
            ? "bg-emerald-600 hover:bg-emerald-700 border-none" 
            : "bg-white hover:bg-emerald-50 border-emerald-100 text-slate-600"
        }`}
        onClick={() => onSelect(cat)}
      >
        {cat}
      </Badge>
    ))}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-slate-300" />
    </div>
    <p className="text-slate-400 text-lg font-medium">{message}</p>
  </div>
);

export default Index;