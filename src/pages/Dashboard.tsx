"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import { Producer } from "@/types/farm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, LayoutDashboard } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { AddProduceDialog } from "@/components/AddProduceDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SecureImage } from "@/components/SecureImage";

const Dashboard = () => {
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, sessionLoading]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, produce (*)`)
      .eq('id', user?.id)
      .single();

    if (error) {
      showError("Could not load profile.");
    } else {
      setProfile(data);
    }
    setLoading(false);
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
      fetchProfile();
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
            <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8" />
              Producer Dashboard
            </h1>
            <p className="text-slate-500">Manage your farm: <span className="font-semibold text-emerald-700">{profile?.farm_name}</span></p>
          </div>
          <AddProduceDialog onSuccess={fetchProfile} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="md:col-span-1 border-emerald-100">
            <CardHeader>
              <CardTitle className="text-lg">Farm Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-100 bg-slate-100">
                  <SecureImage 
                    path={profile?.picture_url}
                    bucket="profile_pictures"
                    alt={profile?.name || "Profile"}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Producer Name</label>
                <p className="text-slate-700">{profile?.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Contact Info</label>
                <p className="text-slate-700">{profile?.phone}</p>
                <p className="text-slate-700">{profile?.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Locations</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile?.locations?.map((loc, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-100">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
              {profile && (
                <EditProfileDialog profile={profile} onSuccess={fetchProfile} />
              )}
            </CardContent>
          </Card>

          {/* Produce List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Your Produce Listings</h2>
            {profile?.produce && profile.produce.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.produce.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-slate-200">
                    <div className="aspect-video relative">
                      <SecureImage 
                        path={item.image_url}
                        bucket="produce_images"
                        alt={item.name}
                        className="w-full h-full"
                        fallback="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteProduce(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-emerald-900">{item.name}</h4>
                          <p className="text-xs text-slate-500 italic">{item.variety}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">{item.price}</p>
                          <p className="text-[10px] text-slate-400">{item.quantity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400">You haven't listed any produce yet.</p>
                <Button variant="link" className="text-emerald-600" onClick={() => document.querySelector('button[aria-haspopup="dialog"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                  Add your first item
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;