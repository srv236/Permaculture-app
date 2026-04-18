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
  const displayPrice = `₹${produce.price_value || 0} per ${produce.price_unit || 'kg'}`;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Link to={`/farm/${produce.farm_id}`} className="block h-full">
      {children}
    </Link>
  );

  if (layout === "list") {
    return (
      <CardWrapper>
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl group flex flex-row h-40 hover:shadow-md transition-all">
          <div className="w-40 h-full relative overflow-hidden shrink-0">
            <SecureImage 
              path={produce.image_url} 
              bucket="produce_images"
              alt={produce.name}
              className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
            />
          </div>
          <CardContent className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0">
                  <h4 className="font-bold text-emerald-900 truncate text-lg">{produce.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{produce.variety}</p>
                </div>
                <span className="text-sm font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {displayPrice}
                </span>
              </div>
              {produce.description && (
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {produce.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                  {produce.category}
                </Badge>
                {showFarm && produce.farms && (
                   <span className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                      <MapPin className="w-3 h-3" />
                      {produce.farms.name}
                   </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <ShoppingBag className="w-3 h-3" />
                {produce.quantity_value} {produce.quantity_unit}
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
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-xl group relative aspect-square hover:shadow-lg transition-all">
          <SecureImage 
            path={produce.image_url} 
            bucket="produce_images"
            alt={produce.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5">
            <p className="text-white text-xs font-bold truncate leading-tight">{produce.name}</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-emerald-400 text-[10px] font-bold">{displayPrice}</p>
              <Badge className="bg-emerald-500/20 text-emerald-200 border-none text-[8px] px-1 py-0 backdrop-blur-sm">
                {produce.category}
              </Badge>
            </div>
          </div>
        </Card>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper>
      <Card className="overflow-hidden border-none shadow-sm bg-white rounded-3xl group h-full flex flex-col hover:shadow-md transition-all">
        <div className="aspect-square relative overflow-hidden">
          <SecureImage 
            path={produce.image_url} 
            bucket="produce_images"
            alt={produce.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-white/90 hover:bg-white text-emerald-900 border-none backdrop-blur-md px-2.5 py-1 text-[10px] font-bold shadow-sm">
              {produce.category}
            </Badge>
            {produce.variety && (
              <Badge variant="secondary" className="bg-emerald-600/80 text-white border-none backdrop-blur-md px-2.5 py-1 text-[9px] font-bold shadow-sm w-fit">
                <Tag className="w-2.5 h-2.5 mr-1" />
                {produce.variety}
              </Badge>
            )}
          </div>
          {showFarm && produce.farms && (
            <div className="absolute bottom-3 left-3 right-3">
              <Badge className="w-full justify-start bg-emerald-900/80 text-white border-none backdrop-blur-md py-1.5 shadow-lg">
                <MapPin className="w-3 h-3 mr-1.5 text-emerald-400" />
                <span className="truncate text-[10px]">{produce.farms.name}</span>
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="min-w-0">
              <h4 className="font-bold text-emerald-900 truncate">{produce.name}</h4>
            </div>
            <span className="text-xs font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-lg">
              {displayPrice}
            </span>
          </div>

          {produce.description && (
            <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3 h-3 mt-0.5 shrink-0 text-slate-300" />
              {produce.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mb-4 mt-auto">
            {produce.tags?.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[8px] px-1.5 py-0 border-slate-200 text-slate-400 font-medium">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{produce.quantity_value} {produce.quantity_unit} left</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};