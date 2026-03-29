"use client";

import { Producer } from "@/types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProducerCardProps {
  producer: Producer;
}

export const ProducerCard = ({ producer }: ProducerCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-3xl">
      <CardHeader className="p-6 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-emerald-100">
              <AvatarImage src={producer.picture_url} alt={producer.name} />
              <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-xl">
                {producer.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {producer.farm_name}
                {producer.has_completed_course && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </h3>
              <p className="text-slate-500 font-medium">{producer.name}</p>
            </div>
          </div>
          {producer.has_completed_course && (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-full px-3">
              Certified
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{producer.locations?.join(", ") || "Location not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>{producer.phone}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Available Produce</h4>
          <div className="flex flex-wrap gap-2">
            {producer.produce && producer.produce.length > 0 ? (
              producer.produce.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col gap-1 min-w-[120px]"
                >
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-xs text-slate-500">{item.variety}</span>
                  <span className="text-emerald-700 font-bold mt-1">{item.price}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">No produce listed currently.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};