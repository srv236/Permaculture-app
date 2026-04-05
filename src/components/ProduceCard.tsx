import { Produce } from "../types/farm";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

interface ProduceCardProps {
  produce: Produce & { farms?: { name: string } };
  showFarm?: boolean;
}

export const ProduceCard = ({ produce, showFarm = false }: ProduceCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-sm bg-slate-50/50 group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={produce.image_url || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"} 
          alt={produce.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
        />
        {showFarm && produce.farms && (
          <Link 
            to={`/farm/${produce.farm_id}`}
            className="absolute bottom-2 left-2 right-2"
          >
            <Badge className="w-full justify-start bg-white/90 hover:bg-white text-emerald-800 border-none backdrop-blur-sm py-1 shadow-sm transition-colors">
              <MapPin className="w-3 h-3 mr-1.5 text-emerald-600" />
              <span className="truncate">From {produce.farms.name}</span>
            </Badge>
          </Link>
        )}
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-sm truncate pr-2">{produce.name}</h4>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 whitespace-nowrap bg-emerald-100 text-emerald-800 border-none">
            {produce.price}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground italic mb-1 truncate">{produce.variety}</p>
        {produce.description && (
          <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-tight min-h-[2.4em]">
            {produce.description}
          </p>
        )}
        <p className="text-[10px] font-bold text-emerald-600">{produce.quantity}</p>
      </CardContent>
    </Card>
  );
};