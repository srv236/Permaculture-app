import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Sprout, MapPin, ShoppingBasket, Users, CheckCircle2, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface ImpactStats {
  totalFarms: number;
  totalPermafolk: number;
  verifiedPermafolk: number;
  totalProducts: number;
  totalLocations: number;
  totalAcres: number;
}

const Index = () => {
  const [stats, setStats] = useState<ImpactStats>({
    totalFarms: 0,
    totalPermafolk: 0,
    verifiedPermafolk: 0,
    totalProducts: 0,
    totalLocations: 0,
    totalAcres: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all farms with location data
        const { data: farmsData } = await supabase
          .from('farms')
          .select('*, size, latitude, longitude, address');
        
        // Fetch all profiles
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('is_verified');
        
        // Fetch all produce
        const { data: produceData } = await supabase
          .from('produce')
          .select('id');

        if (farmsData) {
          const farmsWithLocation = farmsData.filter(f => 
            (f.latitude && f.longitude) || f.address
          );
          
          // Parse farm sizes (assuming format like "2 hectares" or "5 acres")
          const totalAcres = farmsData.reduce((sum, farm) => {
            if (!farm.size) return sum;
            const match = farm.size.match(/(\d+(?:\.\d+)?)/);
            if (match) {
              const value = parseFloat(match[1]);
              // If size contains "hectare", convert to acres (1 hectare ≈ 2.471 acres)
              if (farm.size.toLowerCase().includes('hectare')) {
                return sum + (value * 2.471);
              }
              return sum + value;
            }
            return sum;
          }, 0);

          setStats(prev => ({
            ...prev,
            totalFarms: farmsData.length,
            totalLocations: farmsWithLocation.length,
            totalAcres: Math.round(totalAcres)
          }));
        }

        if (profilesData) {
          setStats(prev => ({
            ...prev,
            totalPermafolk: profilesData.length,
            verifiedPermafolk: profilesData.filter(p => p.is_verified).length
          }));
        }

        if (produceData) {
          setStats(prev => ({
            ...prev,
            totalProducts: produceData.length
          }));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-emerald-200 text-sm font-medium mb-6 border border-emerald-700/50">
            <Sprout className="w-4 h-4" />
            The Art of Living Permaculture
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Growing a <span className="text-emerald-400">Sustainable</span> Future
          </h1>
          <p className="text-emerald-100/80 text-lg md:text-xl mb-10 leading-relaxed">
            A trusted network connecting verified permaculture practitioners, 
            sustainable farms, and fresh local produce across the country.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-2xl">
                Join the Network
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-emerald-400 text-emerald-100 hover:bg-emerald-800/50 px-8 py-6 text-lg rounded-2xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        {/* Impact Stats Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Collective Impact</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Together, our network of certified permaculture practitioners is making a real difference in sustainable agriculture.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatNumber(stats.totalLocations)}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Locations</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatNumber(stats.totalAcres)}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Acres Farmed</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBasket className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatNumber(stats.totalProducts)}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Products Listed</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatNumber(stats.totalFarms)}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Farms</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatNumber(stats.totalPermafolk)}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Permafolk</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{formatNumber(stats.verifiedPermafolk)}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verified</div>
              </div>
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our platform connects sustainable farmers with conscious consumers through a verified network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Register & Verify</h3>
              <p className="text-slate-600 leading-relaxed">
                Farmers complete our mandatory Basic and Advanced Permaculture courses and submit their profiles for verification.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">List Your Produce</h3>
              <p className="text-slate-600 leading-relaxed">
                Verified farmers can add their farms and list fresh produce with details, pricing, and images.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connect & Trade</h3>
              <p className="text-slate-600 leading-relaxed">
                Consumers browse the network, contact farmers directly, and purchase fresh, sustainably grown produce.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-emerald-900 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Permaculture Movement?</h2>
            <p className="text-emerald-100/80 text-lg mb-10">
              Whether you're a farmer practicing sustainable agriculture or a consumer looking for fresh, local produce, our network welcomes you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-2xl">
                  Register as Farmer
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-emerald-400 text-emerald-100 hover:bg-emerald-800/50 px-8 py-6 text-lg rounded-2xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
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

export default Index;