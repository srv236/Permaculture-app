"use client";

import { Producer } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SecureImage } from "./SecureImage";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface PermafolkCardProps {
  permafolk: Producer;
  layout?: "grid" | "list" | "compact";
}

export const PermafolkCard = ({ permafolk, layout = "grid" }: PermafolkCardProps) => {
  if (layout === "list") {
    return (
      <Card className="overflow-hidden border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-row items-center p-4 gap-6">
        <Link to={`/profile/${permafolk.id}`} className="shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-50 bg-white">
            <SecureImage 
              path={permafolk.picture_url}
              bucket="profile_pictures"
              alt={permafolk.name}
              className="w-full h-full"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-emerald-900 truncate">{permafolk.name}</h3>
            {permafolk.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
          </div>
          <p className="text-xs text-emerald-600 font-medium">Certified Practitioner</p>
        </div>
        <Link to={`/profile/${permafolk.id}`} className="shrink-0">
          <Button variant="ghost" size="sm" className="text-emerald-600">
            View <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </Card>
    );
  }

  if (layout === "compact") {
    return (
      <Link to={`/profile/${permafolk.id}`} className="block group">
        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
            <SecureImage 
              path={permafolk.picture_url}
              bucket="profile_pictures"
              alt={permafolk.name}
              className="w-full h-full"
            />
          </div>
          <span className="text-[10px] font-bold text-emerald-900 text-center truncate w-full">{permafolk.name}</span>
        </div>
      </Link>
    );
  }

  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <Link to={`/profile/${permafolk.id}`}>
        <CardHeader className="bg-emerald-50/30 pb-4 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white shrink-0">
              <SecureImage 
                path={permafolk.picture_url}
                bucket="profile_pictures"
                alt={permafolk.name}
                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{permafolk.name}</h3>
                {permafolk.is_verified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                )}
              </div>
              <p className="text-sm font-medium text-emerald-600 mb-2">Certified Permafolk</p>
            </div>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col justify-end">
        <div className="space-y-3">
          <Link to={`/profile/${permafolk.id}`} className="block">
            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              View Full Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};