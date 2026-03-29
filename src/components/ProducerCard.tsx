import { Producer } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, User, CheckCircle2 } from "lucide-react";
import { ProduceCard } from "./ProduceCard";
import { ContactButtons } from "./ContactButtons";

export const ProducerCard = ({ producer }: { producer: Producer }) => {
  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-emerald-50/50 pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
            <AvatarImage src={producer.picture_url} alt={producer.name} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-emerald-900">{producer.farm_name}</h3>
              {producer.is_verified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
              )}
            </div>
            <p className="text-sm font-medium text-emerald-700">{producer.name}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {producer.locations?.map((loc, i) => (
                <span key={i} className="flex items-center text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-slate-600 border border-emerald-100">
                  <MapPin className="w-3 h-3 mr-1 text-emerald-500" />
                  {loc}
                </span>
              ))}
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