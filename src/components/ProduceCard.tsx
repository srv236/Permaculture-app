import { Produce } from "../types/farm";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export const ProduceCard = ({ produce }: { produce: Produce }) => {
  return (
    <Card className="overflow-hidden border-none shadow-sm bg-slate-50/50">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={produce.image_url || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400"} 
          alt={produce.name}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-sm">{produce.name}</h4>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {produce.price}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground italic mb-1">{produce.variety}</p>
        {produce.description && (
          <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-tight">
            {produce.description}
          </p>
        )}
        <p className="text-[10px] font-medium text-emerald-600">{produce.quantity}</p>
      </CardContent>
    </Card>
  );
};