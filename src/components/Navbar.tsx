"use client";

import { PlusCircle, LayoutDashboard, LogOut, LogIn, ShoppingBasket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useSession } from "./SessionProvider";

const LOGO_URL = "https://ugc.production.linktr.ee/2709b2db-5589-432c-92ea-5fdce99252ca_aolpclogo.jpeg?io=true&size=avatar-v3_0";

export const Navbar = () => {
  const { user, signOut } = useSession();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-100 shadow-sm">
            <img 
              src={LOGO_URL} 
              alt="AOLPC Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900 hidden sm:inline-block">
            AOL<span className="text-emerald-600">Permaculture</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/market">
            <Button 
              variant={location.pathname === '/market' ? 'secondary' : 'ghost'} 
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
            >
              <ShoppingBasket className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Market</span>
            </Button>
          </Link>

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