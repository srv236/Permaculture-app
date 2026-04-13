"use client";

import { Produce } from "../types/farm";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { MapPin, ShoppingBag, Tag } from "lucide-react";
import { SecureImage } from "./SecureImage";
import { cn } from "@/lib/utils";

interface ProduceCardProps {
  produce: Produce & { farms?: { name: string } };
  showFarm?: boolean;
  layout?: "grid" | "list" | "compact";
}

export const ProduceCard = ({ produce, showFarm = false, layout = "grid" }: ProduceCardProps) => {
  const displayPrice = produce.price?.startsWith('₹') || produce.price?.startsWith('$') 
    ? produce.price 
    : `₹${produce.price}`;

  if (layout === "list") {
    return (
      <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl group flex flex-row h-32">
        <div className="w-32 h-full relative overflow-hidden shrink-0">
          <SecureImage 
            path={produce.image_url} 
            bucket="produce_images"
            alt={produce.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
            fallback="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <h4 className="font-bold text-emerald-900 truncate">{produce.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{produce.variety}</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-lg">
              {displayPrice}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-100 text-emerald-800 border-none text-[9px] font-bold">
              {produce.category}
            </Badge>
            {showFarm && produce.farms && (
               <Link to={`/farm/${produce.farm_id}`} className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-emerald-600 truncate">
                  <MapPin className="w-3 h-3" />
                  {produce.farms.name}
               </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (layout === "compact") {
    return (
      <Card className="overflow-hidden border-none shadow-sm bg-white rounded-xl group relative aspect-square">
        <SecureImage 
          path={produce.image_url} 
          bucket="produce_images"
          alt={produce.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
          fallback="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
          <p className="text-white text-[10px] font-bold truncate">{produce.name}</p>
          <p className="text-emerald-300 text-[9px] font-bold">{displayPrice}</p>
        </div>
        <div className="absolute top-1.5 right-1.5">
          <Badge className="bg-white/90 text-emerald-900 border-none text-[8px] px-1 py-0 shadow-sm">
            {produce.category}
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white rounded-3xl group h-full flex flex-col">
      <div className="aspect-square relative overflow-hidden">
        <SecureImage 
          path={produce.image_url} 
          bucket="produce_images"
          alt={produce.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
          fallback="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"
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
          <Link 
            to={`/farm/${produce.farm_id}`}
            className="absolute bottom-3 left-3 right-3"
          >
            <Badge className="w-full justify-start bg-emerald-900/80 hover:bg-emerald-900 text-white border-none backdrop-blur-md py-1.5 shadow-lg transition-colors">
              <MapPin className="w-3 h-3 mr-1.5 text-emerald-400" />
              <span className="truncate text-[10px]">{produce.farms.name}</span>
            </Badge>
          </Link>
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

        <div className="flex flex-wrap gap-1 mb-4">
          {produce.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-[8px] px-1.5 py-0 border-slate-200 text-slate-400 font-medium">
              #{tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{produce.quantity} left</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};