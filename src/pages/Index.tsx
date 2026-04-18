"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProducerCard } from "@/components/ProducerCard";
import { PermafolkCard } from "@/components/PermafolkCard";
import { ProduceCard } from "@/components/ProduceCard";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sprout, Loader2, Map as MapIcon, User, ShoppingBasket, LogIn, Users, MapPin, Ruler, LayoutGrid, List, Grid2X2 } from "lucide-react";
import { getNetworkFarms } from "@/api/farms";
import { getAllProfiles } from "@/api/profiles";
import { getAllProduce } from "@/api/produce";
import { Farm, Producer, Produce } from "@/types/farm";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/components/SessionProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

type ViewMode = "grid" | "list" | "compact";

const Index = () => {
  const { user, loading: sessionLoading } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [permafolk, setPermafolk] = useState<Producer[]>([]);
  const [produce, setProduce] = useState<(Produce & { farms?: { name: string, profiles?: { is_hidden: boolean } } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farms");
  const [stats, setStats] = useState({
    totalPermafolk: 0,
    totalFarms: 0,
    totalProduce: 0,
    totalFarmSize: "0"
  });

  useEffect(() => {
    const fetchPublicStats = async () => {
      setStatsLoading(true);
      try {
        const response = await fetch('https://jhvybduaojbotojvxgvs.supabase.co/functions/v1/get-public-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching public stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchPublicStats();
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const farmsData = await getNetworkFarms();
        if (farmsData) setFarms(farmsData as any);
        const profilesData = await getAllProfiles();
        if (profilesData) setPermafolk(profilesData as any);
        const produceData = await getAllProduce();
        if (produceData) setProduce(produceData as any);
      } catch (error) {
        console.error("Error fetching network data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, sessionLoading]);

  const filteredFarms = farms.filter(farm => {
    // Explicitly hide suppressed farms even for admins on the public index
    if ((farm as any).profiles?.is_hidden) return false;

    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      farm.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.produce?.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || farm.produce?.some(p => p.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredPermafolk = permafolk.filter(p => {
    // Hide suppressed profiles from search
    if (p.is_hidden) return false;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredProduce = produce.filter(p => {
    // Hide produce if farm owner is hidden
    if ((p as any).farms?.profiles?.is_hidden) return false;

    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.variety?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getGridClasses = () => {
    if (viewMode === "list") return "grid grid-cols-1 gap-4";
    if (viewMode === "compact") return "grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3";
    return activeTab === "farms" ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-200 text-sm font-medium mb-6 border border-emerald-700/50">
            <Sprout className="w-4 h-4" />
            The Art of Living Permaculture
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Connect with the <span className="text-emerald-400">Permafolk</span></h1>
          <p className="text-emerald-100/80 text-lg md:text-xl mb-10 leading-relaxed">Discover sustainable farms, fresh local produce, and the passionate practitioners in your community.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
            <Input className="pl-14 h-16 bg-white text-slate-900 rounded-2xl border-none shadow-2xl text-lg focus-visible:ring-emerald-500" placeholder="Search farms, produce, or permafolk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-16 py-8 border-y border-slate-200 bg-white/50 rounded-3xl shadow-sm">
          {statsLoading ? (
            <div className="flex items-center gap-2 text-slate-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-bold uppercase tracking-widest">Calculating Statistics...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                <div className="flex flex-col"><span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalPermafolk}</span><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Permafolk</span></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><ShoppingBasket className="w-6 h-6 text-emerald-600" /></div>
                <div className="flex flex-col"><span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalProduce}</span><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Products</span></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center"><Sprout className="w-6 h-6 text-amber-600" /></div>
                <div className="flex flex-col"><span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalFarms}</span><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Farms</span></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center"><Ruler className="w-6 h-6 text-purple-600" /></div>
                <div className="flex flex-col"><span className="text-2xl font-bold text-slate-900 leading-none">{stats.totalFarmSize}</span><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Area</span></div>
              </div>
            </>
          )}
        </div>

        {!user ? (
          <Card className="border-dashed border-2 border-emerald-200 bg-white py-20 text-center rounded-[40px]">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto"><LogIn className="w-10 h-10 text-emerald-600" /></div>
              <div className="space-y-2"><h2 className="text-3xl font-bold text-slate-900">View Full Listings</h2><p className="text-slate-500 max-w-md mx-auto text-lg">Detailed farm listings, produce availability, and practitioner profiles are only visible to registered members.</p></div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4"><Link to="/login"><Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-lg rounded-xl"><LogIn className="w-5 h-5 mr-2" />Sign In</Button></Link><Link to="/register"><Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-12 px-8 text-lg rounded-xl">Join the Network</Button></Link></div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="farms" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col items-center mb-12">
              <TabsList className="bg-white p-1.5 h-auto rounded-2xl shadow-md border border-emerald-100 mb-8">
                <TabsTrigger value="farms" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-bold"><MapIcon className="w-5 h-5 mr-2" />Featured Farms</TabsTrigger>
                <TabsTrigger value="produce" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-bold"><ShoppingBasket className="w-5 h-5 mr-2" />Featured Produce</TabsTrigger>
                <TabsTrigger value="permafolk" className="rounded-xl px-8 py-4 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-base font-bold"><User className="w-5 h-5 mr-2" />Featured Permafolk</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-6 px-4">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 flex-1">
                  {CATEGORIES.map(cat => (
                    <Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className={`cursor-pointer px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? "bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-200" : "bg-white hover:bg-emerald-50 border-emerald-100 text-slate-600"}`} onClick={() => setSelectedCategory(cat)}>{cat}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-1 p-1 bg-white border border-emerald-100 rounded-xl shadow-sm shrink-0">
                  <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-lg", viewMode === "grid" ? "bg-emerald-50 text-emerald-600" : "text-slate-400")} onClick={() => setViewMode("grid")}><LayoutGrid className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-lg", viewMode === "list" ? "bg-emerald-50 text-emerald-600" : "text-slate-400")} onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-lg", viewMode === "compact" ? "bg-emerald-50 text-emerald-600" : "text-slate-400")} onClick={() => setViewMode("compact")}><Grid2X2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>

            {loading ? <div className="flex flex-col items-center justify-center py-32 gap-4"><Loader2 className="w-12 h-12 text-emerald-600 animate-spin" /><p className="text-slate-400 font-medium">Loading the network...</p></div> : (
              <div className="mt-8">
                <TabsContent value="farms" className="mt-0 focus-visible:ring-0">
                  {filteredFarms.length > 0 ? (
                    <div className={getGridClasses()}>
                      {filteredFarms.map(farm => (
                        <ProducerCard 
                          key={farm.id} 
                          layout={viewMode}
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
                            address: farm.address,
                            tags: farm.tags
                          } as any} 
                        />
                      ))}
                    </div>
                  ) : <EmptyState message="No farms found matching your search." />}
                </TabsContent>

                <TabsContent value="produce" className="mt-0 focus-visible:ring-0">
                  {filteredProduce.length > 0 ? (
                    <div className={getGridClasses()}>
                      {filteredProduce.map(item => <ProduceCard key={item.id} produce={item} layout={viewMode} showFarm />)}
                    </div>
                  ) : <EmptyState message="No produce found matching your search." />}
                </TabsContent>

                <TabsContent value="permafolk" className="mt-0 focus-visible:ring-0">
                  {filteredPermafolk.length > 0 ? (
                    <div className={getGridClasses()}>
                      {filteredPermafolk.map(person => <PermafolkCard key={person.id} permafolk={person} layout={viewMode} />)}
                    </div>
                  ) : <EmptyState message="No permafolk found matching your search." />}
                </TabsContent>
              </div>
            )}
          </Tabs>
        )}
      </main>

      <footer className="bg-white border-t py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8"><div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100"><Sprout className="w-8 h-8 text-emerald-600" /></div></div>
          <h3 className="text-xl font-bold text-emerald-900 mb-4">The Art of Living Permaculture</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">Empowering communities through regenerative agriculture and sustainable living practices.</p>
          <div className="flex justify-center gap-8 text-slate-400 text-sm font-bold uppercase tracking-widest"><Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link><Link to="/register" className="hover:text-emerald-600 transition-colors">Join</Link><Link to="/login" className="hover:text-emerald-600 transition-colors">Login</Link></div>
          <div className="mt-12 pt-8 border-t border-slate-100"><p className="text-slate-400 text-xs">© 2024 Permaculture Department Market. All practitioners are verified graduates.</p></div>
        </div>
      </footer>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-10 h-10 text-slate-300" /></div>
    <p className="text-slate-400 text-xl font-medium">{message}</p>
    <Button variant="link" className="text-emerald-600 mt-4 font-bold" onClick={() => window.location.reload()}>Clear all filters</Button>
  </div>
);

export default Index;