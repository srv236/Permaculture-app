import { Producer } from "../types/farm";
import { Card, CardContent, CardHeader } from "./ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SecureImage } from "./SecureImage";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const PermafolkCard = ({ permafolk }: { permafolk: Producer }) => {
  return (
    <Card className="overflow-hidden border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <Link to={`/profile/${permafolk.id}`}>
        <CardHeader className="bg-emerald-50/30 pb-4 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white shrink-0">
              <SecureImage 
                path={permafolk.picture_url}
                bucket="profile_pictures"
                alt={permafolk.name}
                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                fallback="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{permafolk.name}</h3>
                {permafolk.is_verified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                )}
              </div>
              <p className="text-sm font-medium text-emerald-600 mb-2">Certified Permafolk</p>
            </div>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col justify-end">
        <div className="space-y-3">
          <Link to={`/profile/${permafolk.id}`} className="block">
            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              View Full Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};