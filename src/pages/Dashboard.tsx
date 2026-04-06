"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer } from "@/types/farm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, LayoutDashboard, CheckCircle2, Clock, MapPin, Ruler, GraduationCap, Calendar, Phone, Mail } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { AddFarmDialog } from "@/components/AddFarmDialog";
import { AddProduceDialog } from "@/components/AddProduceDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { EditFarmDialog } from "@/components/EditFarmDialog";
import { SecureImage } from "@/components/SecureImage";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Producer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, sessionLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user?.id)
        .single();

      const { data: farmsData } = await supabase
        .from('farms')
        .select(`*, produce (*)`)
        .eq('user_id', user?.id);

      setProfile(profileData);
      setFarms(farmsData || []);
    } catch (error) {
      showError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (!confirm("Are you sure you want to remove this farm?")) return;

    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('id', id);

    if (error) {
      showError("Failed to delete farm.");
    } else {
      showSuccess("Farm removed.");
      fetchData();
    }
  };

  const handleDeleteProduce = async (id: string) => {
    if (!confirm("Are you sure you want to remove this produce?")) return;

    const { error } = await supabase
      .from('produce')
      .delete()
      .eq('id', id);

    if (error) {
      showError("Failed to delete produce.");
    } else {
      showSuccess("Produce removed.");
      fetchData();
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8" />
                Permafolk Dashboard
              </h1>
              {profile?.is_verified ? (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-3">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-full px-3">
                  <Clock className="w-3 h-3 mr-1" /> Pending
                </Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1">Manage your regenerative profile and farm network.</p>
          </div>
          <AddFarmDialog onSuccess={fetchData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Profile Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-emerald-100 shadow-xl rounded-[32px] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                    <SecureImage 
                      path={profile?.picture_url}
                      bucket="profile_pictures"
                      alt={profile?.name || "Permafolk"}
                      className="w-full h-full"
                      fallback="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200"
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-emerald-900">{profile?.name}</h2>
                  <p className="text-emerald-600 font-medium text-sm">Practitioner</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{profile?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm truncate">{profile?.email}</span>
                    </div>
                  </div>

                  {profile?.about && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">About</p>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{profile.about}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">Basic</span>
                      </div>
                      <span className="text-[10px] text-emerald-700">{profile?.basic_completion_date || "Yes"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">Advanced</span>
                      </div>
                      <span className="text-[10px] text-emerald-700">{profile?.advanced_completion_date || "Yes"}</span>
                    </div>
                  </div>
                </div>

                {profile && <EditProfileDialog profile={profile} onSuccess={fetchData} />}
              </CardContent>
            </Card>
          </div>

          {/* Farms Column */}
          <div className="lg:col-span-3 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Your Farm Network</h2>
            {farms.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {farms.map((farm) => (
                  <Card key={farm.id} className="overflow-hidden border-slate-200 rounded-[32px] shadow-lg group">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-auto relative">
                        <SecureImage 
                          path={farm.picture_url}
                          bucket="profile_pictures"
                          alt={farm.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                          coordinates={farm.latitude ? { lat: farm.latitude, lng: farm.longitude } : undefined}
                          fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <EditFarmDialog farm={farm} onSuccess={fetchData} />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl shadow-lg"
                            onClick={() => handleDeleteFarm(farm.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-emerald-900">{farm.name}</h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                              <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                <Ruler className="w-4 h-4 text-emerald-500" />
                                {farm.size_value} {farm.size_unit}
                              </span>
                              {farm.address && (
                                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-emerald-500" />
                                  {farm.address}
                                </span>
                              )}
                            </div>
                          </div>
                          <AddProduceDialog farmId={farm.id} onSuccess={fetchData} />
                        </div>

                        <div className="border-t border-slate-100 pt-6 mt-auto">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Farm Produce</h4>
                          {farm.produce && farm.produce.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {farm.produce.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group/item">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white">
                                    <SecureImage 
                                      path={item.image_url}
                                      bucket="produce_images"
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      fallback="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=100"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                                    <p className="text-xs text-emerald-600 font-medium">₹{item.price_value}/{item.price_unit} • {item.quantity_value} {item.quantity_unit}</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteProduce(item.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                              <p className="text-xs text-slate-400 italic">No produce listed for this farm.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-lg">No farms found in your network.</p>
                <p className="text-sm text-slate-400 mt-1">Start by adding your first permaculture farm.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;