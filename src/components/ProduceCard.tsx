"use client";

import { Produce } from "../types/farm";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { MapPin, ShoppingBag, Tag } from "lucide-react";
import { SecureImage } from "./SecureImage";

interface ProduceCardProps {
  produce: Produce & { farms?: { name: string } };
  showFarm?: boolean;
}

export const ProduceCard = ({ produce, showFarm = false }: ProduceCardProps) => {
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
            {produce.variety && (
              <p className="text-[10px] text-slate-400 font-medium truncate italic">{produce.variety}</p>
            )}
          </div>
          <span className="text-xs font-bold text-emerald-600 whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-lg">
            ₹{produce.price_value}
          </span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{produce.quantity_value} {produce.quantity_unit} left</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">per {produce.price_unit}</span>
        </div>
      </CardContent>
    </Card>
  );
};