"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Producer, Farm } from "@/types/farm";
import { SecureImage } from "@/components/SecureImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/ContactButtons";
import { useSession } from "@/components/SessionProvider";
import { getUserProfile, updateProfile, deleteProfile } from "@/api/profiles";
import { getFarmsByUser } from "@/api/farms";
import { 
  MapPin, 
  CheckCircle2, 
  XCircle,
  ArrowLeft, 
  Loader2, 
  GraduationCap,
  Award,
  Lock,
  Sprout,
  ShieldCheck,
  UserCheck,
  UserX,
  ShieldAlert,
  EyeOff,
  Eye,
  Trash2,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Smartphone,
  LogIn
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { showSuccess, showError } from "@/utils/toast";

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile: adminProfile } = useSession();
  const [profile, setProfile] = useState<Producer | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    if (!id) return;
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const profileData = await getUserProfile(id);
      setProfile(profileData as any);

      const farmsData = await getFarmsByUser(id);
      setFarms(farmsData || []);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      showError(error.message || "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, user]);

  const handleAdminAction = async (updates: any, actionName: string) => {
    if (!profile) return;
    try {
      await updateProfile(profile.id, updates);
      showSuccess(`${actionName} updated successfully.`);
      fetchProfileData();
    } catch (err: any) {
      showError(`Failed to update ${actionName}: ${err.message}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!profile) return;
    if (!confirm("Are you sure? This will delete the user profile and all their associated data. This cannot be undone.")) return;
    
    try {
      await deleteProfile(profile.id);
      showSuccess("Member deleted successfully.");
      navigate("/");
    } catch (err: any) {
      showError(`Failed to delete member: ${err.message}`);
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-20 flex justify-center">
          <Card className="max-w-md w-full border-dashed border-2 border-emerald-200 bg-white py-12 text-center rounded-[40px]">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
                <p className="text-slate-500 text-sm">
                  Practitioner profiles and contact details are only visible to registered members of the network.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/login">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In to View
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => navigate(-1)}>Go Back</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!profile) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Profile not found or access denied.</p>
        <Button variant="link" onClick={() => navigate("/")}>Return Home</Button>
      </div>
    </div>
  );

  const socialLinks = [
    { id: 'website', url: profile.website_url, icon: Globe, label: 'Website', color: 'text-emerald-600' },
    { id: 'facebook', url: profile.facebook_url, icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    { id: 'instagram', url: profile.instagram_url, icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
    { id: 'youtube', url: profile.youtube_url, icon: Youtube, label: 'YouTube', color: 'text-red-600' },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="bg-emerald-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex justify-between items-start mb-8">
            <Button 
              variant="ghost" 
              className="text-emerald-100 hover:bg-white/10 -ml-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Network
            </Button>

            {adminProfile?.is_admin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Management
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAdminAction({ is_verified: !profile.is_verified }, "Verification")}>
                    {profile.is_verified ? <><UserX className="w-4 h-4 mr-2" /> Unverify</> : <><UserCheck className="w-4 h-4 mr-2" /> Verify Member</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAdminAction({ is_admin: !profile.is_admin }, "Admin Rights")}>
                    {profile.is_admin ? <><ShieldAlert className="w-4 h-4 mr-2 text-amber-600" /> Remove Admin</> : <><ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" /> Make Admin</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAdminAction({ is_hidden: !(profile as any).is_hidden }, "Visibility")}>
                    {(profile as any).is_hidden ? <><Eye className="w-4 h-4 mr-2" /> Show Member</> : <><EyeOff className="w-4 h-4 mr-2" /> Suppress Member</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:bg-red-50 focus:text-red-700" 
                    onClick={handleDeleteUser}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:items-end">
            <div className="w-40 h-40 rounded-[40px] overflow-hidden border-4 border-emerald-800 shadow-2xl bg-white shrink-0">
              <SecureImage 
                path={profile.picture_url}
                bucket="profile_pictures"
                alt={profile.name}
                className="w-full h-full"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{profile.name}</h1>
                {profile.is_verified ? (
                  <Badge className="bg-blue-500 text-white border-none px-3 py-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Practitioner
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-700 px-3 py-1 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    Verification Pending
                  </Badge>
                )}
                {(profile as any).is_hidden && (
                  <Badge variant="destructive" className="bg-red-500 text-white border-none px-3 py-1">
                    Suppressed
                  </Badge>
                )}
              </div>
              <p className="text-emerald-300 text-xl font-medium mb-4">Permaculture Practitioner</p>
              
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  {socialLinks.map(link => (
                    <a 
                      key={link.id} 
                      href={link.url?.startsWith('http') ? link.url : `https://${link.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-sm"
                    >
                      <link.icon className={`w-4 h-4 ${link.color}`} />
                      <span className="text-emerald-50 hidden sm:inline">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <div className="space-y-4">
                <ContactButtons 
                  phone={profile.phone} 
                  email={profile.email} 
                  name={profile.name} 
                />
                {profile.alt_phone && (
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-emerald-300" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-emerald-200">Alternate Phone</p>
                      <a href={`tel:${profile.alt_phone}`} className="text-sm font-bold text-white hover:underline">{profile.alt_phone}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      {profile.basic_course_date ? `Completed: ${profile.basic_course_date}` : "Completed"}
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
                      {profile.advanced_course_date ? `Completed: ${profile.advanced_course_date}` : "Completed"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between bg-emerald-900 lg:bg-transparent -mx-4 px-4 py-6 lg:m-0 lg:p-0 rounded-b-3xl lg:rounded-none shadow-lg lg:shadow-none">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sprout className="w-6 h-6 text-emerald-400" />
                Farms
              </h2>
            </div>

            {farms.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {farms.map((farm) => (
                  <Link key={farm.id} to={`/farm/${farm.id}`}>
                    <Card className="group overflow-hidden border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 rounded-3xl">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                          <SecureImage 
                            path={farm.picture_url}
                            bucket="profile_pictures"
                            alt={farm.name}
                            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
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
                            </div>
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