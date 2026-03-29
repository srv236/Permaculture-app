"use client";

import { Navbar } from "@/components/Navbar";
import { useSession } from "@/components/SessionProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return null;

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
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Produce
            </Button>
            <Button variant="outline" className="rounded-2xl border-slate-200">
              <Settings className="w-4 h-4 mr-2" />
              Farm Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="text-emerald-600" />
                Your Active Listings
              </h2>
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-400">You haven't added any produce yet.</p>
                <Button variant="link" className="text-emerald-600 font-bold mt-2">
                  Create your first listing
                </Button>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-lg">
              <h3 className="text-xl font-bold mb-4">Farm Profile</h3>
              <div className="space-y-4 opacity-90">
                <p className="text-sm">Complete your profile to build trust with customers.</p>
                <div className="h-2 bg-emerald-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-1/3" />
                </div>
                <p className="text-xs font-medium">33% Complete</p>
              </div>
              <Button className="w-full bg-white text-emerald-900 hover:bg-emerald-50 mt-6 rounded-2xl font-bold">
                Edit Profile
              </Button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;