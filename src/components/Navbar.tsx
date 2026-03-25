import { Leaf, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900 hidden sm:inline-block">
            Permaculture<span className="text-emerald-600">Market</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/register">
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
              <PlusCircle className="w-4 h-4 mr-2" />
              List Your Produce
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};