import { Producer } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, User, CheckCircle2, ExternalLink } from "lucide-react";
import { ProduceCard } from "./ProduceCard";
import { ContactButtons } from "./ContactButtons";
import { SecureImage } from "./SecureImage";

export const ProducerCard = ({ producer }: { producer: Producer }) => {
  const mapsUrl = producer.google_maps_url || 
    (producer.latitude && producer.longitude 
      ? `https://www.google.com/maps/search/?api=1&query=${producer.latitude},${producer.longitude}`
      : null);

  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-emerald-50/50 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white shrink-0">
            <SecureImage 
              path={producer.picture_url}
              bucket="profile_pictures"
              alt={producer.name}
              className="w-full h-full"
              coordinates={producer.latitude ? { lat: producer.latitude, lng: producer.longitude } : undefined}
              fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-emerald-900">{producer.farm_name}</h3>
              {producer.is_verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
              )}
            </div>
            <p className="text-sm font-medium text-emerald-700">{producer.name}</p>
            
            {producer.address && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                {producer.address}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {producer.locations?.map((loc, i) => (
                <span key={i} className="flex items-center text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-slate-600 border border-emerald-100">
                  {loc}
                </span>
              ))}
              {mapsUrl && (
                <a 
                  href={mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full text-white hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Map
                </a>
              )}
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
          {producer.produce?.map((item) => (
            <ProduceCard key={item.id} produce={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};