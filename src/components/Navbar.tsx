"use client";

import { PlusCircle, LayoutDashboard, LogOut, LogIn, ShieldCheck, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "./SessionProvider";
import { SecureImage } from "./SecureImage";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar = ({ searchQuery = "", onSearchChange }: NavbarProps) => {
  const { user, profile, signOut } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm bg-emerald-50 flex items-center justify-center transition-transform group-hover:scale-105">
            <SecureImage 
              path="logo.png"
              bucket="assets"
              alt="The Art of Living Permaculture"
              className="w-full h-full"
              fallback="dyad-media://media/Permaculture/.dyad/media/c95bccb482d5f31a70f51015e7d8132f.png"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900 hidden sm:inline-block">
            AoL<span className="text-emerald-600">Permaculture</span>
          </span>
        </Link>

        {onSearchChange && (
          <div className={cn(
            "flex-1 max-w-md mx-4 md:mx-8 transition-all duration-300 hidden md:block",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          )}>
            <div className="relative">
              <input 
                type="text"
                placeholder="Search farms, produce..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-white border-2 border-emerald-500/20 hover:border-emerald-500/40 focus:border-emerald-500 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-lg shadow-emerald-900/5 focus:shadow-emerald-900/10 placeholder:text-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {profile?.is_admin && (
                <Link to="/admin">
                  <Button variant="ghost" className="text-purple-700 hover:text-purple-800 hover:bg-purple-50">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-slate-500 hover:text-slate-700"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Create Account</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};