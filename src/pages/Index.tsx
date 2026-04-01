import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sprout, Loader2, Map as MapIcon, User, ShoppingBasket, ShieldCheck, Zap, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer, Produce } from "@/types/farm";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: farmsData } = await supabase
          .from('farms')
          .select(`
            *,
            profiles (id, name, phone, email, is_verified, picture_url, locations),
            produce (*)
          `);

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*');

        const { data: produceData } = await supabase
          .from('produce')
          .select('*');

        if (farmsData) {
          const mappedFarms = farmsData.map(farm => ({
            ...farm,
            producer: farm.profiles
          })) || [];
          setFarms(mappedFarms);
        }

        if (profilesData) {
          setPermafolk(profilesData as any);
        }

        if (produceData) {
          setProduce(produceData as any);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFarms = farms.filter(farm => 
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    farm.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.produce?.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPermafolk = permafolk.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.locations?.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProduce = produce.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.variety?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-200 text-sm font-medium mb-8 border border-emerald-700/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sprout className="w-4 h-4" />
            The Art of Living Permaculture Network
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Connect with the <span className="text-emerald-400">Permafolk</span>
          </h1>
          <p className="text-emerald-100/80 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Discover sustainable farms, fresh local produce, and the passionate people 
            practicing permaculture in your community.
          </p>
          
          <div className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6" />
            <Input 
              className="pl-16 h-20 bg-white text-slate-900 rounded-3xl border-none shadow-2xl text-xl focus-visible:ring-emerald-500"
              placeholder="Search farms, produce, or permafolk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Verified Producers</h3>
              <p className="text-slate-500">Every farmer is a certified graduate of our advanced permaculture courses.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Direct Connection</h3>
              <p className="text-slate-500">Contact producers directly via WhatsApp or phone to arrange your harvest pickup.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sustainable Future</h3>
              <p className="text-slate-500">Support local ecosystems and regenerative agriculture with every purchase.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-20">
        <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <TabsList className="bg-white p-1.5 h-auto rounded-2xl shadow-sm border border-emerald-100">
              <TabsTrigger value="farms" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-semibold">
                <MapIcon className="w-5 h-5 mr-2" />
                Featured Farms
              </TabsTrigger>
              <TabsTrigger value="produce" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-semibold">
                <ShoppingBasket className="w-5 h-5 mr-2" />
                Featured Produce
              </TabsTrigger>
              <TabsTrigger value="permafolk" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-semibold">
                <User className="w-5 h-5 mr-2" />
                Featured Permafolk
              </TabsTrigger>
            </TabsList>
            
            {!loading && (
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600 font-bold">
                  {activeTab === "farms" ? filteredFarms.length : 
                   activeTab === "produce" ? filteredProduce.length : 
                   filteredPermafolk.length} Results Found
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                <Sprout className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-400 font-bold text-lg">Cultivating the network...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <TabsContent value="farms" className="mt-0">
                {filteredFarms.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {filteredFarms.map(farm => (
                      <ProducerCard 
                        key={farm.id} 
                        producer={{
                          id: farm.user_id,
                          name: (farm as any).profiles?.name || "Unknown",
                          phone: (farm as any).profiles?.phone || "",
                          email: (farm as any).profiles?.email || "",
                          farm_name: farm.name,
                          locations: farm.address ? [farm.address] : [],
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
            </div>
          )}
        </Tabs>
      </main>

      <footer className="bg-white border-t py-24 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm">
              <Sprout className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">The Art of Living Permaculture</h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed mb-8">
            Connecting conscious consumers with regenerative practitioners. All producers are verified graduates of our basic and advanced courses.
          </p>
          <div className="flex justify-center gap-8 text-sm font-bold text-emerald-700">
            <a href="#" className="hover:text-emerald-900 transition-colors">About Us</a>
            <a href="#" className="hover:text-emerald-900 transition-colors">Courses</a>
            <a href="#" className="hover:text-emerald-900 transition-colors">Contact</a>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-xs">© 2024 Permaculture Department Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-40 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-slate-300" />
    </div>
    <p className="text-slate-400 text-xl font-bold">{message}</p>
    <p className="text-slate-400 mt-2">Try searching for something else or browse all categories.</p>
  </div>
);

export default Index;