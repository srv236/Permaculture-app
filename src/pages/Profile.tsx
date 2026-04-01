"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Producer, Farm } from "@/types/farm";
import { SecureImage } from "@/components/SecureImage";
import { ProduceCard } from "@/components/ProduceCard";
import { ContactButtons } from "@/components/ContactButtons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  Globe, 
  ExternalLink,
  Sprout,
  ShieldCheck,
  Loader2,
  GraduationCap
} from "lucide-react";

const Profile = () => {
  const { id } = useParams();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        const { data: farmsData, error: farmsError } = await supabase
          .from('farms')
          .select('*, produce(*)')
          .eq('user_id', id);

        if (farmsError) throw farmsError;

        setProducer(profileData as any);
        setFarms(farmsData || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading farm profile...</p>
        </div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Profile Not Found</h2>
          <Link to="/" className="text-emerald-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Network
          </Link>
        </div>
      </div>
    );
  }

  const mapsUrl = producer.google_maps_url || 
    (producer.latitude && producer.longitude 
      ? `https://www.google.com/maps/search/?api=1&query=${producer.latitude},${producer.longitude}`
      : null);

  const practitionerDate = producer.practitioner_since ? new Date(producer.practitioner_since).getFullYear() : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-emerald-900 text-white pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Network
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl bg-white shrink-0">
              <SecureImage 
                path={producer.picture_url}
                bucket="profile_pictures"
                alt={producer.name}
                className="w-full h-full"
                fallback="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=400"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{producer.farm_name || producer.name}</h1>
                {producer.is_verified && (
                  <Badge className="bg-blue-500 text-white border-none px-3 py-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Producer
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-emerald-100/80">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">
                    {practitionerDate ? `Permafolk since ${practitionerDate}` : 'Permaculture Practitioner'}
                  </span>
                </div>
                {producer.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span>{producer.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Joined {new Date(producer.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-emerald-100 shadow-xl overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Producer</h3>
                  <ContactButtons 
                    phone={producer.phone} 
                    email={producer.email} 
                    name={producer.name} 
                  />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Credentials</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-bold">Basic Course</p>
                        <p className="text-xs text-slate-400">{producer.basic_course_date ? new Date(producer.basic_course_date).toLocaleDateString() : 'Verified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-bold">Advanced Course</p>
                        <p className="text-xs text-slate-400">{producer.advanced_course_date ? new Date(producer.advanced_course_date).toLocaleDateString() : 'Verified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {mapsUrl && (
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Location</h3>
                    <div className="rounded-2xl overflow-hidden aspect-video mb-4 border border-slate-100">
                      <SecureImage 
                        bucket="profile_pictures"
                        alt="Farm Location"
                        className="w-full h-full"
                        coordinates={producer.latitude ? { lat: producer.latitude, lng: producer.longitude } : undefined}
                      />
                    </div>
                    <a 
                      href={mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition-colors border border-slate-200"
                    >
                      <Globe className="w-4 h-4" />
                      Open in Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {producer.about && (
              <section className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                <h2 className="text-2xl font-bold text-emerald-900 mb-4">About the Producer</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {producer.about}
                </p>
              </section>
            )}

            {farms.map((farm) => (
              <section key={farm.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                    {farm.name}
                  </h2>
                  {farm.size && (
                    <Badge variant="outline" className="text-slate-500 border-slate-200">
                      {farm.size}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {farm.produce && farm.produce.length > 0 ? (
                    farm.produce.map((item) => (
                      <ProduceCard key={item.id} produce={item} />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                      <p className="text-slate-400">No produce currently listed for this farm.</p>
                    </div>
                  )}
                </div>
              </section>
            ))}
            
            {farms.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <Sprout className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No farms listed yet</h3>
                <p className="text-slate-400 mt-2">This producer hasn't added their farm details yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;