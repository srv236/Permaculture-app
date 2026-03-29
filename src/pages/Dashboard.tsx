"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Settings, 
  ShoppingBag, 
  Edit2, 
  Trash2, 
  User, 
  CheckCircle2,
  Loader2,
  Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Producer, Produce } from "@/types/farm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProduceForm } from "@/components/ProduceForm";
import { ProfileForm } from "@/components/ProfileForm";
import { showSuccess, showError } from "@/utils/toast";

const Dashboard = () => {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingProduce, setEditingProduce] = useState<Produce | null>(null);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, produce(*)')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, sessionLoading, navigate]);

  const handleDeleteProduce = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      const { error } = await supabase
        .from('produce')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      showSuccess("Listing deleted");
      fetchProfile();
    } catch (error: any) {
      showError(error.message);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = ['name', 'farm_name', 'phone', 'email', 'locations'];
    const completed = fields.filter(f => !!(profile as any)[f]).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Producer Dashboard</h1>
            <p className="text-slate-500">Manage your farm profile and produce listings</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Produce
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Produce</DialogTitle>
                </DialogHeader>
                <ProduceForm 
                  producerId={user!.id} 
                  onSuccess={() => {
                    setIsAddDialogOpen(false);
                    fetchProfile();
                  }}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="rounded-2xl border-slate-200"
              onClick={() => setIsProfileDialogOpen(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Farm Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="text-emerald-600" />
                Your Active Listings
              </h2>
              
              {profile?.produce && profile.produce.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.produce.map((item) => (
                    <div key={item.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-500">{item.variety}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                            onClick={() => setEditingProduce(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            onClick={() => handleDeleteProduce(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <span className="text-emerald-700 font-bold text-lg">{item.price}</span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-slate-400">You haven't added any produce yet.</p>
                  <Button 
                    variant="link" 
                    className="text-emerald-600 font-bold mt-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Create your first listing
                  </Button>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-800 flex items-center justify-center border border-emerald-700 overflow-hidden">
                  {profile?.picture_url ? (
                    <img src={profile.picture_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{profile?.farm_name || "Your Farm"}</h3>
                  <p className="text-emerald-300 text-sm">{profile?.name || "Set your name"}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-300">Certification Status</span>
                  {profile?.has_completed_course ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Certified
                    </span>
                  ) : (
                    <span className="text-slate-400">Not Certified</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-emerald-400">
                    <span>Profile Completion</span>
                    <span>{calculateCompletion()}%</span>
                  </div>
                  <div className="h-2 bg-emerald-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${calculateCompletion()}%` }} />
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl font-bold"
                onClick={() => setIsProfileDialogOpen(true)}
              >
                Edit Farm Profile
              </Button>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  Add clear photos of your produce to increase trust.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  Keep your quantities updated to avoid disappointing customers.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Produce Dialog */}
      <Dialog open={!!editingProduce} onOpenChange={(open) => !open && setEditingProduce(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Produce</DialogTitle>
          </DialogHeader>
          {editingProduce && (
            <ProduceForm 
              producerId={user!.id} 
              initialData={editingProduce}
              onSuccess={() => {
                setEditingProduce(null);
                fetchProfile();
              }}
              onCancel={() => setEditingProduce(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Farm Profile</DialogTitle>
          </DialogHeader>
          {profile && (
            <ProfileForm 
              initialData={profile}
              onSuccess={() => {
                setIsProfileDialogOpen(false);
                fetchProfile();
              }}
              onCancel={() => setIsProfileDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;