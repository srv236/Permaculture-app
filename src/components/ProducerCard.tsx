"use client";

import { Producer } from "@/types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Phone, Mail, CheckCircle2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface ProducerCardProps {
  producer: Producer;
}

export const ProducerCard = ({ producer }: ProducerCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-[2.5rem] group">
      <CardHeader className="p-8 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-emerald-50 shadow-sm">
                <AvatarImage src={producer.picture_url} alt={producer.name} className="object-cover" />
                <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-2xl">
                  {producer.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {producer.has_completed_course && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                {producer.farm_name || "Unnamed Farm"}
              </h3>
              <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                {producer.name}
                {producer.has_completed_course && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none rounded-full text-[10px] px-2 py-0 h-5">
                    Certified
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{producer.locations?.join(", ") || "Location not specified"}</span>
          </div>
          <a href={`tel:${producer.phone}`} className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{producer.phone}</span>
          </a>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Produce</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Fresh</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {producer.produce && producer.produce.length > 0 ? (
              producer.produce.slice(0, 4).map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 hover:border-emerald-100 hover:shadow-sm transition-all"
                >
                  <span className="font-bold text-slate-900 truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight truncate">{item.variety || 'Standard'}</span>
                  <span className="text-emerald-700 font-bold mt-2 text-lg">{item.price}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">No produce listed currently.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-2xl h-12 font-bold shadow-lg shadow-emerald-100">
            Contact Producer
          </Button>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-100">
            <ExternalLink className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};