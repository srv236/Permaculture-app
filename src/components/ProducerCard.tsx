import { Producer } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MapPin, CheckCircle2, ExternalLink, User } from "lucide-react";
import { ProduceCard } from "./ProduceCard";
import { ContactButtons } from "./ContactButtons";
import { SecureImage } from "./SecureImage";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const ProducerCard = ({ producer }: { producer: Producer }) => {
  const mapsUrl = producer.google_maps_url || 
    (producer.latitude && producer.longitude 
      ? `https://www.google.com/maps/search/?api=1&query=${producer.latitude},${producer.longitude}`
      : null);

  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="bg-emerald-50/50 pb-4">
        <div className="flex items-start gap-4">
          <Link to={`/profile/${producer.id}`} className="shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white transition-transform group-hover:scale-105">
              <SecureImage 
                path={producer.picture_url}
                bucket="profile_pictures"
                alt={producer.name}
                className="w-full h-full"
                coordinates={producer.latitude ? { lat: producer.latitude, lng: producer.longitude } : undefined}
                fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200"
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link to={`/profile/${producer.id}`} className="hover:text-emerald-600 transition-colors truncate">
                <h3 className="text-xl font-bold text-emerald-900 truncate">{producer.farm_name || producer.name}</h3>
              </Link>
              {producer.is_verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50 shrink-0" />
              )}
            </div>
            <p className="text-sm font-medium text-emerald-700 truncate">{producer.name}</p>
            
            {producer.address && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                {producer.address}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {producer.locations?.slice(0, 2).map((loc, i) => (
                <span key={i} className="flex items-center text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-slate-600 border border-emerald-100">
                  {loc}
                </span>
              ))}
              <Link to={`/profile/${producer.id}`}>
                <Button variant="ghost" size="sm" className="h-5 text-[10px] px-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <ContactButtons 
          phone={producer.phone} 
          email={producer.email} 
          name={producer.name} 
        />
      </CardHeader>
      <CardContent className="p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Current Produce</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {producer.produce?.slice(0, 2).map((item) => (
            <ProduceCard key={item.id} produce={item} />
          ))}
          {producer.produce && producer.produce.length > 2 && (
            <Link 
              to={`/profile/${producer.id}`}
              className="col-span-full text-center py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              + {producer.produce.length - 2} more items
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};