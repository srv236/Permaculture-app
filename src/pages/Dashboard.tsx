"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import { Farm, Producer } from "@/types/farm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, LayoutDashboard, CheckCircle2, Clock, MapPin, Ruler, ShieldCheck, UserCheck } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { AddFarmDialog } from "@/components/AddFarmDialog";
import { AddProduceDialog } from "@/components/AddProduceDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SecureImage } from "@/components/SecureImage";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Producer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [allProfiles, setAllProfiles] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      if (profileData?.is_admin) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        setAllProfiles(profilesData || []);
      }
    } catch (error) {
      showError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, sessionLoading]);

  const handleToggleVerify = async (targetId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: !currentStatus })
      .eq('id', targetId);

    if (error) {
      showError("Failed to update verification status.");
    } else {
      showSuccess(currentStatus ? "User unverified." : "User verified!");
      fetchData();
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (!confirm("Are you sure you want to remove this farm and all its produce?")) return;

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8" />
                Dashboard
              </h1>
              {profile?.is_verified ? (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Verification Pending
                </Badge>
              )}
              {profile?.is_admin && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-slate-500">Welcome back, <span className="font-semibold text-emerald-700">{profile?.name}</span></p>
          </div>
          <AddFarmDialog onSuccess={fetchData} />
        </div>

        <Tabs defaultValue="my-farms" className="space-y-8">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="my-farms">My Farms</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            {profile?.is_admin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
          </TabsList>

          <TabsContent value="my-farms" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {farms.length > 0 ? (
                farms.map((farm) => (
                  <Card key={farm.id} className="overflow-hidden border-slate-200">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-auto relative">
                        <SecureImage 
                          path={farm.picture_url}
                          bucket="profile_pictures"
                          alt={farm.name}
                          className="w-full h-full"
                          coordinates={farm.latitude ? { lat: farm.latitude, lng: farm.longitude } : undefined}
                          fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400"
                        />
                        <div className="absolute top-2 right-2">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteFarm(farm.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-emerald-900">{farm.name}</h3>
                            <div className="flex flex-wrap gap-3 mt-1">
                              {farm.size && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Ruler className="w-3 h-3" />
                                  {farm.size}
                                </span>
                              )}
                              {farm.address && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {farm.address}
                                </span>
                              )}
                            </div>
                          </div>
                          <AddProduceDialog farmId={farm.id} onSuccess={fetchData} />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Produce on this farm</h4>
                          {farm.produce && farm.produce.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {farm.produce.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 group">
                                  <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                                    <SecureImage 
                                      path={item.image_url}
                                      bucket="produce_images"
                                      alt={item.name}
                                      className="w-full h-full"
                                      fallback="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=100"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                                    <p className="text-[10px] text-slate-500">{item.price} • {item.quantity}</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteProduce(item.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No produce listed for this farm yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400">You haven't added any farms yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="max-w-2xl border-emerald-100">
              <CardHeader>
                <CardTitle className="text-lg">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-100 bg-slate-100">
                    <SecureImage 
                      path={profile?.picture_url}
                      bucket="profile_pictures"
                      alt={profile?.name || "Profile"}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{profile?.name}</h3>
                    <p className="text-slate-500">{profile?.email}</p>
                    <p className="text-slate-500">{profile?.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Basic Course</label>
                    <p className="text-sm font-medium">{profile?.basic_course_date || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Advanced Course</label>
                    <p className="text-sm font-medium">{profile?.advanced_course_date || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Practitioner Since</label>
                    <p className="text-sm font-medium">{profile?.practitioner_since || 'Not set'}</p>
                  </div>
                </div>

                {profile && (
                  <EditProfileDialog profile={profile} onSuccess={fetchData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {profile?.is_admin && (
            <TabsContent value="admin">
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    User Verification Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Farm</th>
                          <th className="px-4 py-3">Course Dates</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {allProfiles.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900">{p.name}</div>
                              <div className="text-xs text-slate-500">{p.email}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{p.farm_name}</td>
                            <td className="px-4 py-3">
                              <div className="text-[10px] text-slate-500">B: {p.basic_course_date || '-'}</div>
                              <div className="text-[10px] text-slate-500">A: {p.advanced_course_date || '-'}</div>
                            </td>
                            <td className="px-4 py-3">
                              {p.is_verified ? (
                                <Badge className="bg-blue-50 text-blue-600 border-blue-100">Verified</Badge>
                              ) : (
                                <Badge variant="outline" className="text-amber-600 border-amber-100">Pending</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Button 
                                size="sm" 
                                variant={p.is_verified ? "outline" : "default"}
                                className={p.is_verified ? "" : "bg-emerald-600 hover:bg-emerald-700"}
                                onClick={() => handleToggleVerify(p.id, p.is_verified)}
                              >
                                {p.is_verified ? "Unverify" : "Verify User"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;