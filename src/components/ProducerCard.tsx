import { Producer, Produce } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MapPin, CheckCircle2, ArrowRight, User, Tag } from "lucide-react";
import { ProduceCard } from "./ProduceCard";
import { SecureImage } from "./SecureImage";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Extended type for when ProducerCard is used to display farm-related data in Index
interface ExtendedProducer extends Producer {
  farm_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  produce?: Produce[];
}

export const ProducerCard = ({ producer }: { producer: ExtendedProducer }) => {
  const mapsUrl = producer.google_maps_url || 
    (producer.latitude && producer.longitude 
      ? `https://www.google.com/maps/search/?api=1&query=${producer.latitude},${producer.longitude}`
      : null);

  const tags = producer.tags || [];

  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="bg-emerald-50/50 pb-4">
        <div className="flex items-start gap-4">
          <Link to={`/farm/${producer.id}`} className="shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
              <SecureImage 
                path={producer.picture_url}
                bucket="profile_pictures"
                alt={producer.name}
                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                coordinates={producer.latitude ? { lat: producer.latitude, lng: producer.longitude } : undefined}
                fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200"
              />
            </div>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link to={`/farm/${producer.id}`} className="hover:underline decoration-emerald-300 underline-offset-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold text-emerald-900">{producer.farm_name}</h3>
                  {producer.is_verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                  )}
                </div>
              </Link>
              <Link to={`/farm/${producer.id}`}>
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/50">
                  View Farm
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <User className="w-3 h-3" />
              {producer.name}
            </div>
            
            {producer.address && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                {producer.address}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700 border-none text-[9px] font-bold px-2 py-0.5">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <span className="text-[9px] text-slate-400 font-bold">+{tags.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Current Produce</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {producer.produce?.slice(0, 2).map((item) => (
            <ProduceCard key={item.id} produce={item} />
          ))}
        </div>
        {producer.produce && producer.produce.length > 2 && (
          <Link to={`/farm/${producer.id}`} className="block text-center mt-4 text-xs font-bold text-emerald-600 hover:underline">
            + {producer.produce.length - 2} more items
          </Link>
        )}
      </CardContent>
    </Card>
  );
};