import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { getFarmById } from "@/api/farms";
import { getUserProfile } from "@/api/profiles";
import { Farm, Producer } from "@/types/farm";
import { SecureImage } from "@/components/SecureImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProduceCard } from "@/components/ProduceCard";
import { ContactButtons } from "@/components/ContactButtons";
import {
  MapPin,
  ArrowLeft,
  Loader2,
  Sprout,
  ExternalLink,
  Ruler,
  Map as MapIcon,
  Info,
  Tag,
  Globe,
  Navigation
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


const FarmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const farmData = await getFarmById(id);
        setFarm(farmData);

        if (farmData.user_id) {
          const profileData = await getUserProfile(farmData.user_id);
          setProducer(profileData as any);
        }
      } catch (error) {
        console.error("Error fetching farm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmData();
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

  if (!farm) return null;

  const hasLocationInfo = !!farm.address;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <SecureImage
          path={farm.picture_url}
          bucket="profile_pictures"
          alt={farm.name}
          className="w-full h-full object-cover"

          fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8">
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
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{farm.name}</h1>
                <div className="flex flex-wrap gap-4 text-emerald-50">
                  {farm.address && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {farm.address}
                    </span>
                  )}
                  {farm.size_value && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <Ruler className="w-4 h-4 text-emerald-400" />
                      {farm.size_value} {farm.size_unit}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {farm.tags?.map(tag => (
                  <Badge key={tag} className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30 backdrop-blur-md px-3 py-1">
                    <Tag className="w-3 h-3 mr-1.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            {farm.about && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-emerald-600" />
                  About the Farm
                </h2>
                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                  <CardContent className="p-8">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {farm.about}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Harvest Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-emerald-600" />
                Current Harvest
              </h2>
              {farm.produce && farm.produce.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {farm.produce.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <ProduceCard produce={item} />
                      {item.description && (
                        <p className="text-xs text-slate-500 px-4 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2 border-slate-200 bg-transparent py-12 text-center">
                  <p className="text-slate-400">No produce listed for this farm currently.</p>
                </Card>
              )}
            </div>

            {/* Location Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-600" />
                Farm Location
              </h2>
              {hasLocationInfo ? (
                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Manual Address</p>
                          <p className="text-slate-700 font-medium text-lg leading-relaxed">
                            {farm.address}
                          </p>
                        </div>
                      </div>
                      
                      {farm.latitude && farm.longitude && (
                        <Button 
                          variant="outline" 
                          className="w-full h-12 rounded-2xl border-emerald-100 bg-emerald-50/30 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 flex items-center justify-center gap-2 group transition-all"
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${farm.latitude},${farm.longitude}`, '_blank')}
                        >
                          <Navigation className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Open in Google Maps
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed border-2 border-slate-200 bg-transparent py-12 text-center rounded-[32px]">
                  <p className="text-slate-400">No address information provided for this farm.</p>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-emerald-100 shadow-xl rounded-3xl overflow-hidden sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <SecureImage
                      path={producer?.picture_url}
                      bucket="profile_pictures"
                      alt={producer?.name || "Producer"}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Managed by</p>
                    <h3 className="text-lg font-bold text-emerald-900">{producer?.name}</h3>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-emerald-600 text-xs font-bold"
                      onClick={() => navigate(`/profile/${producer?.id}`)}
                    >
                      View Full Profile
                    </Button>
                  </div>
                </div>

                {producer && (
                  <ContactButtons
                    phone={producer.phone}
                    email={producer.email}
                    name={producer.name}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmDetail;