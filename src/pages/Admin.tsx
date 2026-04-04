"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, UserCheck, UserX, Search, Mail, Phone } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { SecureImage } from "@/components/SecureImage";

const Admin = () => {
  const { profile, loading: sessionLoading } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading) {
      if (!profile?.is_admin) {
        navigate("/");
        return;
      }
      fetchUsers();
    }
  }, [profile, sessionLoading]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      showError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      showSuccess(`User ${!currentStatus ? 'verified' : 'unverified'} successfully.`);
      fetchUsers();
    } catch (error) {
      showError("Failed to update verification status.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <ShieldCheck className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500">Manage practitioner verifications and network members.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden border-slate-200">
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
                        <Badge variant="outline" className="text-slate-400">Pending</Badge>
                      )}
                      {user.is_admin && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">Admin</Badge>
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
                  <Button 
                    variant={user.is_verified ? "outline" : "default"}
                    className={user.is_verified ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-emerald-600 hover:bg-emerald-700"}
                    onClick={() => toggleVerification(user.id, user.is_verified)}
                  >
                    {user.is_verified ? (
                      <><UserX className="w-4 h-4 mr-2" /> Revoke</>
                    ) : (
                      <><UserCheck className="w-4 h-4 mr-2" /> Verify</>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/profile/${user.id}`)}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Admin;