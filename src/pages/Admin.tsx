"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { getAllProfiles, updateProfile, deleteProfile as apiDeleteProfile } from "@/api/profiles";
import { Profile } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Search, 
  Mail, 
  Phone,
  Users,
  Clock,
  Trash2,
  EyeOff,
  Eye,
  ShieldAlert,
  UserCog,
  AlertTriangle
} from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { SecureImage } from "@/components/SecureImage";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Admin = () => {
  const { profile: adminProfile, loading: sessionLoading } = useSession();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading) {
      if (!adminProfile?.is_admin) {
        navigate("/");
        return;
      }
      fetchUsers();
    }
  }, [adminProfile, sessionLoading, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProfiles();
      setUsers(data || []);
    } catch (err: unknown) {
      console.error("Admin fetch error:", err);
      const message = err instanceof Error ? err.message : "Failed to load users from the database.";
      setError(message);
      showError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (userId: string, updates: Partial<Profile>, actionName: string) => {
    try {
      await updateProfile(userId, updates);
      showSuccess(`${actionName} updated successfully.`);
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showError(`Failed to update ${actionName}: ${message}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This will delete the user profile and all their associated data (farms, produce).")) return;
    
    try {
      await apiDeleteProfile(userId);
      showSuccess("Member deleted successfully.");
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showError(`Failed to delete member: ${message}`);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingUsers = filteredUsers.filter(u => !u.is_verified && !u.is_hidden);
  const hiddenUsers = filteredUsers.filter(u => u.is_hidden);
  const activeUsers = filteredUsers.filter(u => u.is_verified && !u.is_hidden);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      </div>
    );
  }

  const UserList = ({ usersList }: { usersList: Profile[] }) => (
    <div className="grid grid-cols-1 gap-4">
      {usersList.length > 0 ? (
        usersList.map((user) => (
          <Card key={user.id} className={`overflow-hidden border-slate-200 hover:border-emerald-200 transition-all ${user.is_hidden ? 'opacity-60 bg-slate-50' : ''}`}>
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <SecureImage 
                    path={user.picture_url}
                    bucket="profile_pictures"
                    alt={user.name}
                    className="w-full h-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{user.name}</h3>
                    {user.is_verified ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                    )}
                    {user.is_admin && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">Admin</Badge>
                    )}
                    {user.is_hidden && (
                      <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-100">Suppressed</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user.email}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {user.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserCog className="w-4 h-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>Member Management</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                      View Public Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUpdateProfile(user.id, { is_verified: !user.is_verified }, "Verification")}>
                      {user.is_verified ? <><UserX className="w-4 h-4 mr-2" /> Unverify</> : <><UserCheck className="w-4 h-4 mr-2" /> Verify</>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateProfile(user.id, { is_admin: !user.is_admin }, "Admin Rights")}>
                      {user.is_admin ? <><ShieldAlert className="w-4 h-4 mr-2 text-amber-600" /> Remove Admin</> : <><ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" /> Make Admin</>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateProfile(user.id, { is_hidden: !user.is_hidden }, "Visibility")}>
                      {user.is_hidden ? <><Eye className="w-4 h-4 mr-2" /> Show Member</> : <><EyeOff className="w-4 h-4 mr-2" /> Suppress Member</>}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:bg-red-50 focus:text-red-700" 
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No members found in this category.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500">Full management of practitioner accounts and verifications.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error ? (
          <Card className="bg-red-50 border-red-200 p-8 text-center rounded-[32px]">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Database Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button onClick={fetchUsers} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </Card>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="text-slate-400 font-medium">Loading members...</p>
          </div>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="bg-white p-1 h-auto mb-8 border border-slate-200 rounded-xl overflow-x-auto flex-nowrap">
              <TabsTrigger value="pending" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                <Clock className="w-4 h-4 mr-2" />
                Pending ({pendingUsers.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                <Users className="w-4 h-4 mr-2" />
                Active Members ({activeUsers.length})
              </TabsTrigger>
              <TabsTrigger value="hidden" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-slate-700">
                <EyeOff className="w-4 h-4 mr-2" />
                Suppressed ({hiddenUsers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <UserList usersList={pendingUsers} />
            </TabsContent>

            <TabsContent value="active">
              <UserList usersList={activeUsers} />
            </TabsContent>

            <TabsContent value="hidden">
              <UserList usersList={hiddenUsers} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Admin;