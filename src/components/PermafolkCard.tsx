"use client";

import { Producer } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Mail, Phone, MapPin, User as UserIcon } from "lucide-react";
import { SecureImage } from "./SecureImage";
import { ContactButtons } from "./ContactButtons";
import { Link } from "react-router-dom";

export const PermafolkCard = ({ permafolk }: { permafolk: Producer }) => {
  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="bg-emerald-50/30 pb-4">
        <div className="flex items-center gap-4">
          <Link to={`/profile/${permafolk.id}`} className="shrink-0">
            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-sm bg-white transition-transform group-hover:scale-105">
              <SecureImage 
                path={permafolk.picture_url}
                bucket="profile_pictures"
                alt={permafolk.name}
                className="w-full h-full"
                fallback="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200"
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link to={`/profile/${permafolk.id}`} className="hover:text-emerald-600 transition-colors truncate">
                <h3 className="text-xl font-bold text-emerald-900 truncate">{permafolk.name}</h3>
              </Link>
              {permafolk.is_verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50 shrink-0" />
              )}
            </div>
            <p className="text-sm font-medium text-emerald-600 mb-2">Certified Permafolk</p>
            <div className="flex flex-wrap gap-1">
              {permafolk.locations?.slice(0, 2).map((loc, i) => (
                <Badge key={i} variant="outline" className="text-[10px] bg-white/50 border-emerald-100 text-slate-600">
                  <MapPin className="w-2 h-2 mr-1" />
                  {loc}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{permafolk.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{permafolk.phone}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <Link to={`/profile/${permafolk.id}`} className="flex-1">
              <Badge className="w-full justify-center py-2 bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                View Farm Profile
              </Badge>
            </Link>
          </div>
          <ContactButtons 
            phone={permafolk.phone} 
            email={permafolk.email} 
            name={permafolk.name} 
          />
        </div>
      </CardContent>
    </Card>
  );
};