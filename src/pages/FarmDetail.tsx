import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Farm } from "@/types/farm";
import { SecureImage } from "@/components/SecureImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProduceCard } from "@/components/ProduceCard";
import { ContactButtons } from "@/components/ContactButtons";
import { 
  MapPin, 
  Ruler, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  ExternalLink,
  Sprout,
  Info
} from "lucide-react";

const FarmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarm = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('farms')
          .select(`
            *,
            profiles:user_id (*),
            produce (*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setFarm(data as any);
      } catch (error) {
        console.error("Error fetching farm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-slate-400 font-medium">Loading farm details...</p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Farm not found</h2>
          <Button variant="link" onClick={() => navigate("/")}>Return to home</Button>
        </div>
      </div>
    );
  }

  const mapsUrl = farm.google_maps_url || 
    (farm.latitude && farm.longitude 
      ? `https://www.google.com/maps/search/?api=1&query=${farm.latitude},${farm.longitude}`
      : null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <SecureImage 
          path={farm.picture_url}
          bucket="profile_pictures"
          alt={farm.name}
          className="w-full h-full object-cover"
          coordinates={farm.latitude ? { lat: farm.latitude, lng: farm.longitude } : undefined}
          fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 mb-4 -ml-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{farm.name}</h1>
                  {farm.profiles?.is_verified && (
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400 fill-blue-400/20" />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-1.5 text-sm md:text-base">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {farm.address || "Location not specified"}
                  </div>
                  {farm.size && (
                    <div className="flex items-center gap-1.5 text-sm md:text-base">
                      <Ruler className="w-4 h-4 text-emerald-400" />
                      {farm.size}
                    </div>
                  )}
                </div>
              </div>
              {mapsUrl && (
                <a 
                  href={mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info & Producer */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-emerald-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  About the Producer
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100 bg-white">
                    <SecureImage 
                      path={farm.profiles?.picture_url}
                      bucket="profile_pictures"
                      alt={farm.profiles?.name || "Producer"}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{farm.profiles?.name}</h4>
                    <p className="text-sm text-emerald-600 font-medium">Certified Practitioner</p>
                  </div>
                </div>

                {farm.profiles?.about && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                    <p className="text-sm text-slate-600 leading-relaxed">{farm.profiles.about}</p>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Practitioner Since
                    </span>
                    <span className="font-medium text-slate-900">{farm.profiles?.practitioner_since || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Verification
                    </span>
                    <Badge variant={farm.profiles?.is_verified ? "default" : "outline"} className={farm.profiles?.is_verified ? "bg-blue-500" : ""}>
                      {farm.profiles?.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4">
                  <ContactButtons 
                    phone={farm.profiles?.phone || ""} 
                    email={farm.profiles?.email || ""} 
                    name={farm.profiles?.name || ""} 
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50" />
              <h3 className="text-xl font-bold mb-4 relative z-10">Permaculture Ethics</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-emerald-200">Earth Care</p>
                    <p className="text-sm text-emerald-100/70">Provision for all life systems to continue and multiply.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-emerald-200">People Care</p>
                    <p className="text-sm text-emerald-100/70">Provision for people to access resources necessary for existence.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-emerald-200">Fair Share</p>
                    <p className="text-sm text-emerald-100/70">Setting limits to population and consumption.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Produce */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBasket className="w-6 h-6 text-emerald-600" />
                Available Produce
              </h2>
              <Badge variant="outline" className="bg-white border-emerald-100 text-emerald-700">
                {farm.produce?.length || 0} Items
              </Badge>
            </div>

            {farm.produce && farm.produce.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {farm.produce.map((item) => (
                  <ProduceCard key={item.id} produce={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Info className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">No produce listed for this farm yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

import { ShoppingBasket } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default FarmDetail;