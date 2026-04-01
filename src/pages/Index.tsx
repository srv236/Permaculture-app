"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Sprout, 
  Loader2, 
  Map as MapIcon, 
  User, 
  ShoppingBasket,
  CheckCircle2,
  Users,
  Leaf,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer, Produce } from "@/types/farm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        // Fetch Farms with their producers and produce
        const { data: farmsData } = await supabase
          .from('farms')
          .select(`
            *,
            profiles (id, name, phone, email, is_verified, picture_url),
            produce (*)
          `);

        // Fetch all Permafolk (Profiles)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*');

        // Fetch all Produce
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
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProduce = produce.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.variety?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <header className="bg-emerald-900 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-200 text-sm font-medium mb-8 border border-emerald-700/50">
            <Sprout className="w-4 h-4" />
            The Art of Living Permaculture
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
            Regenerative Living, <br />
            <span className="text-emerald-400">Community Driven.</span>
          </h1>
          <p className="text-emerald-100/80 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Discover sustainable farms, fresh local produce, and the certified practitioners 
            shaping a greener future.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
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

      {/* How it Works Section */}
      <section className="py-20 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How the Network Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Connecting conscious consumers with verified permaculture practitioners.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Verified Training</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Every producer has completed our Basic and Advanced Permaculture courses, ensuring high standards of sustainability.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Direct Harvest</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Browse current harvests and connect directly with farmers to get the freshest, most nutrient-dense produce.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Community Growth</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Support local regenerative projects and help expand the permaculture movement in your region.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <main className="container mx-auto px-4 py-20">
        <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
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
              <p className="text-sm text-slate-500 font-bold bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
                {
                  activeTab === "farms" ? filteredFarms.length : 
                  activeTab === "produce" ? filteredProduce.length : 
                  filteredPermafolk.length
                } Results Found
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
              <p className="text-slate-400 font-bold text-lg">Cultivating the network...</p>
            </div>
          ) : (
            <>
              <TabsContent value="farms" className="mt-0">
                {filteredFarms.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {filteredFarms.map(farm => (
                      <ProducerCard 
                        key={farm.id} 
                        producer={{
                          id: farm.user_id,
                          name: (farm as any).producer?.name || "Unknown",
                          phone: (farm as any).producer?.phone || "",
                          email: (farm as any).producer?.email || "",
                          farm_name: farm.name,
                          locations: [], // Removed service areas
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
      </main>

      {/* Mission Section */}
      <section className="py-24 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Our Regenerative Mission</h2>
            <p className="text-emerald-100/80 text-xl leading-relaxed">
              We believe that permaculture is more than just gardening—it's a way of living in harmony with nature. 
              Our network ensures that every practitioner is equipped with the knowledge to restore soil health, 
              conserve water, and build resilient local food systems.
            </p>
            <div className="pt-8">
              <Link to="/register">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-6 rounded-2xl text-lg font-bold">
                  Join the Network
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100">
              <Sprout className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            © 2024 Permaculture Department Market. <br />
            All practitioners are verified graduates of our basic and advanced courses.
          </p>
        </div>
      </footer>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-40 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-slate-300" />
    </div>
    <p className="text-slate-400 text-xl font-bold">{message}</p>
  </div>
);

export default Index;