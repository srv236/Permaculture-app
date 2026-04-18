"use client";

import { Produce } from "../types/farm";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { MapPin, ShoppingBag, Tag, Info } from "lucide-react";
import { SecureImage } from "./SecureImage";

interface ProduceCardProps {
  produce: Produce & { farms?: { name: string } };
  showFarm?: boolean;
  layout?: "grid" | "list" | "compact";
}

export const ProduceCard = ({ produce, showFarm = false, layout = "grid" }: ProduceCardProps) => {
  const displayPrice = `₹${produce.price_value || 0}/${produce.price_unit || 'kg'}`;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Link to={`/farm/${produce.farm_id}`} className="block h-full">
      {children}
    </Link>
  );

  if (layout === "list") {
    return (
      <CardWrapper>
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-xl group flex flex-row h-32 hover:shadow-md transition-all">
          <div className="w-32 h-full relative overflow-hidden shrink-0">
            <SecureImage 
              path={produce.image_url} 
              bucket="produce_images"
              alt={produce.name}
              className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
            />
          </div>
          <CardContent className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex justify-between items-start mb-0.5">
                <div className="min-w-0">
                  <h4 className="font-bold text-emerald-900 truncate text-base">{produce.name}</h4>
                  <p className="text-[9px] text-slate-500 truncate">{produce.variety}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {displayPrice}
                </span>
              </div>
              {produce.description && (
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                  {produce.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 border-none text-[9px] font-bold px-1.5 py-0">
                  {produce.category}
                </Badge>
                {showFarm && produce.farms && (
                   <span className="flex items-center gap-1 text-[9px] text-slate-400 truncate max-w-[80px]">
                      <MapPin className="w-2.5 h-2.5" />
                      {produce.farms.name}
                   </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <ShoppingBag className="w-2.5 h-2.5" />
                {produce.quantity_value}{produce.quantity_unit}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardWrapper>
    );
  }

  if (layout === "compact") {
    return (
      <CardWrapper>
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-lg group relative aspect-square hover:shadow-md transition-all">
          <SecureImage 
            path={produce.image_url} 
            bucket="produce_images"
            alt={produce.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-2">
            <p className="text-white text-[10px] font-bold truncate leading-tight">{produce.name}</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-emerald-400 text-[9px] font-bold">{displayPrice}</p>
            </div>
          </div>
        </Card>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl group h-full flex flex-col hover:shadow-md transition-all max-w-[280px] mx-auto">
        <div className="aspect-[5/4] relative overflow-hidden">
          <SecureImage 
            path={produce.image_url} 
            bucket="produce_images"
            alt={produce.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            <Badge className="bg-white/90 hover:bg-white text-emerald-900 border-none backdrop-blur-md px-2 py-0.5 text-[9px] font-bold shadow-sm">
              {produce.category}
            </Badge>
            {produce.variety && (
              <Badge variant="secondary" className="bg-emerald-600/80 text-white border-none backdrop-blur-md px-1.5 py-0.5 text-[8px] font-bold shadow-sm w-fit">
                <Tag className="w-2 h-2 mr-1" />
                {produce.variety}
              </Badge>
            )}
          </div>
          {showFarm && produce.farms && (
            <div className="absolute bottom-2 left-2 right-2">
              <Badge className="w-full justify-start bg-emerald-900/80 text-white border-none backdrop-blur-md py-1 shadow-lg">
                <MapPin className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                <span className="truncate text-[9px]">{produce.farms.name}</span>
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-1.5 mb-1.5">
            <div className="min-w-0">
              <h4 className="font-bold text-emerald-900 truncate text-sm">{produce.name}</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-1.5 py-0.5 rounded-md">
              {displayPrice}
            </span>
          </div>

          {produce.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed flex items-start gap-1">
              <Info className="w-2.5 h-2.5 mt-0.5 shrink-0 text-slate-300" />
              {produce.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-2 mt-auto">
            {produce.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[8px] px-1 py-0 bg-slate-50 text-slate-400 font-medium rounded">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-500">
              <ShoppingBag className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{produce.quantity_value}{produce.quantity_unit} avail.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};