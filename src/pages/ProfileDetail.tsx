import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Producer, Farm } from "@/types/farm";
import { SecureImage } from "@/components/SecureImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/ContactButtons";
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Sprout,
  GraduationCap,
  Award,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Producer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as any);

        // Fetch their farms
        const { data: farmsData, error: farmsError } = await supabase
          .from('farms')
          .select('*, produce (*)')
          .eq('user_id', id);

        if (farmsError) throw farmsError;
        setFarms(farmsData || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-slate-400 font-medium">Loading practitioner profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Practitioner not found</h2>
          <Button variant="link" onClick={() => navigate("/")}>Return to home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-emerald-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <Button 
            variant="ghost" 
            className="text-emerald-100 hover:bg-white/10 mb-8 -ml-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:items-end">
            <div className="w-40 h-40 rounded-[40px] overflow-hidden border-4 border-emerald-800 shadow-2xl bg-white shrink-0">
              <SecureImage 
                path={profile.picture_url}
                bucket="profile_pictures"
                alt={profile.name}
                className="w-full h-full"
                fallback="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=400"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{profile.name}</h1>
                {profile.is_verified && (
                  <CheckCircle2 className="w-8 h-8 text-blue-400 fill-blue-400/20" />
                )}
              </div>
              <p className="text-emerald-300 text-xl font-medium mb-4">Certified Permaculture Practitioner</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {profile.locations?.map((loc, i) => (
                  <Badge key={i} variant="outline" className="bg-emerald-800/50 border-emerald-700 text-emerald-100 px-3 py-1">
                    <MapPin className="w-3 h-3 mr-1.5" />
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <ContactButtons 
                phone={profile.phone} 
                email={profile.email} 
                name={profile.name} 
              />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Bio & Certifications */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-emerald-100 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Practitioner Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About</label>
                  <p className="text-slate-600 leading-relaxed">
                    {profile.about || `${profile.name} is a dedicated member of the Art of Living Permaculture network, committed to regenerative practices and community sustainability.`}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Basic Course</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                      {profile.basic_course_date || "Completed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Advanced Course</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                      {profile.advanced_course_date || "Completed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Practicing Since</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{profile.practitioner_since || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-lg">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-emerald-600" />
                Regenerative Vision
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "Permaculture is a philosophy of working with, rather than against nature; of protracted and thoughtful observation rather than protracted and thoughtless labor."
              </p>
            </div>
          </div>

          {/* Right Column: Farms & Produce */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Managed Farms</h2>
              <Badge className="bg-emerald-600">{farms.length} Active Projects</Badge>
            </div>

            {farms.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {farms.map((farm) => (
                  <Link key={farm.id} to={`/farm/${farm.id}`}>
                    <Card className="group overflow-hidden border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                          <SecureImage 
                            path={farm.picture_url}
                            bucket="profile_pictures"
                            alt={farm.name}
                            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                            coordinates={farm.latitude ? { lat: farm.latitude, lng: farm.longitude } : undefined}
                            fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400"
                          />
                        </div>
                        <div className="md:w-2/3 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-2xl font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{farm.name}</h3>
                              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                {farm.address || "Location specified"}
                              </span>
                              {farm.size && (
                                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                  <Award className="w-4 h-4 text-emerald-500" />
                                  {farm.size}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex -space-x-2">
                              {farm.produce?.slice(0, 4).map((item, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100">
                                  <SecureImage 
                                    path={item.image_url}
                                    bucket="produce_images"
                                    alt={item.name}
                                    className="w-full h-full"
                                  />
                                </div>
                              ))}
                              {farm.produce && farm.produce.length > 4 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                                  +{farm.produce.length - 4}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">View Harvest</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No farms listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetail;