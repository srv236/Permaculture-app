"use client";

import { Map, Marker, ZoomControl } from "pigeon-maps";
import { Farm } from "@/types/farm";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { SecureImage } from "./SecureImage";

interface MapDisplayProps {
  farms: Farm[];
}

export const MapDisplay = ({ farms }: MapDisplayProps) => {
  const navigate = useNavigate();
  
  // Filter farms that have coordinates
  const farmsWithCoords = farms.filter(f => f.latitude && f.longitude);
  
  // Default center (can be improved to center on user or average of farms)
  const defaultCenter: [number, number] = farmsWithCoords.length > 0 
    ? [farmsWithCoords[0].latitude!, farmsWithCoords[0].longitude!]
    : [20.5937, 78.9629]; // Center of India

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
      <Map 
        defaultCenter={defaultCenter} 
        defaultZoom={5}
        metaWheelZoom={true}
      >
        <ZoomControl />
        {farmsWithCoords.map((farm) => (
          <Marker 
            key={farm.id}
            width={50}
            anchor={[farm.latitude!, farm.longitude!]} 
            onClick={() => navigate(`/farm/${farm.id}`)}
          >
            <div className="group relative cursor-pointer">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-emerald-600 transform transition-transform group-hover:scale-125 group-hover:z-50">
                <SecureImage 
                  path={farm.picture_url}
                  bucket="profile_pictures"
                  alt={farm.name}
                  className="w-full h-full"
                  fallback="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=100"
                />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <Card className="p-2 whitespace-nowrap shadow-xl border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900">{farm.name}</p>
                  <p className="text-[10px] text-slate-500">Click to view farm</p>
                </Card>
              </div>
            </div>
          </Marker>
        ))}
      </Map>
      
      {farmsWithCoords.length === 0 && (
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 p-6 rounded-2xl shadow-xl text-center max-w-xs">
            <p className="text-slate-600 font-medium">No farms with coordinates found to display on the map.</p>
          </div>
        </div>
      )}
    </div>
  );
};