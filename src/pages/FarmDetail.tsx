import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
        const { data: farmData, error: farmError } = await supabase
          .from('farms')
          .select('*, produce (*)')
          .eq('id', id)
          .single();

        if (farmError) throw farmError;
        setFarm(farmData);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', farmData.user_id)
          .single();

        setProducer(profileData as any);
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

  const mapsUrl = farm.google_maps_url || 
    (farm.latitude && farm.longitude 
      ? `https://www.google.com/maps/search/?api=1&query=${farm.latitude},${farm.longitude}`
      : null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <SecureImage 
          path={farm.picture_url}
          bucket="profile_pictures"
          alt={farm.name}
          className="w-full h-full object-cover"
          coordinates={farm.latitude ? { lat: farm.latitude, lng: farm.longitude } : undefined}
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
                  {farm.size && (
                    <span className="flex items-center gap-1.5 text-sm">
                      <Ruler className="w-4 h-4 text-emerald-400" />
                      {farm.size}
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

            {/* Map Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-emerald-600" />
                Farm Location
              </h2>
              {farm.latitude && farm.longitude ? (
                <div className="space-y-6">
                  <div className="h-[400px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-xl relative z-0">
                    <MapContainer 
                      center={[farm.latitude, farm.longitude]} 
                      zoom={13} 
                      scrollWheelZoom={false} 
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[farm.latitude, farm.longitude]}>
                        <Popup>
                          <div className="p-1">
                            <p className="font-bold text-emerald-900">{farm.name}</p>
                            <p className="text-xs text-slate-500">{farm.address}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  {/* Explicit Location Details Card */}
                  <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> Manual Address
                          </p>
                          <p className="text-slate-700 font-medium text-sm leading-relaxed">
                            {farm.address || "No address provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Navigation className="w-3 h-3" /> Coordinates
                          </p>
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400">Latitude</span>
                              <span className="text-slate-700 font-medium text-sm font-mono">{farm.latitude}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400">Longitude</span>
                              <span className="text-slate-700 font-medium text-sm font-mono">{farm.longitude}</span>
                            </div>
                          </div>
                        </div>
                        {farm.google_maps_url && (
                          <div className="space-y-1 md:col-span-2 pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Globe className="w-3 h-3" /> Google Maps Link
                            </p>
                            <a 
                              href={farm.google_maps_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-emerald-600 hover:text-emerald-700 hover:underline break-all text-xs font-medium flex items-center gap-1 mt-1"
                            >
                              {farm.google_maps_url} <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {mapsUrl && (
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg rounded-2xl shadow-lg shadow-emerald-100"
                      onClick={() => window.open(mapsUrl, "_blank")}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open in Google Maps
                    </Button>
                  )}
                </div>
              ) : (
                <Card className="border-dashed border-2 border-slate-200 bg-transparent py-12 text-center rounded-[32px]">
                  <p className="text-slate-400">No coordinates provided for this farm.</p>
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