"use client";

import { PlusCircle, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "./SessionProvider";

export const Navbar = () => {
  const { user, signOut } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm bg-emerald-50">
            <img 
              src="/pasted-image-2026-03-29T10-02-27-899Z.png" 
              alt="The Art of Living Permaculture" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image is not found in public folder
                e.currentTarget.src = "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=100";
              }}
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900 hidden sm:inline-block">
            Permaculture<span className="text-emerald-600">Market</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
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
                  <span className="hidden sm:inline">List Your Produce</span>
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