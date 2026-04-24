"use client";

import { useState } from "react";
import { Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow } from "@vis.gl/react-google-maps";
import { Farm } from "@/types/farm";
import { MapPin, Sprout, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FarmsMapProps {
  farms: Farm[];
  isGuest?: boolean;
}

const MAIN_LOCATION = {
  lat: 12.82871779569726,
  lng: 77.51220666749091,
  name: "The Art of Living Permaculture",
  address: "Art of Living International Center, Bengaluru, India",
};

export const FarmsMap = ({ farms, isGuest = false }: FarmsMapProps) => {
  const navigate = useNavigate();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showMainInfo, setShowMainInfo] = useState(false);

  // Filter out farms without valid coordinates
  const mapFarms = farms.filter(f => f.latitude && f.longitude);

  return (
    <div className="w-full h-[600px] rounded-[40px] overflow-hidden border border-emerald-100 shadow-xl bg-slate-50 relative">
      <Map
        defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
        defaultZoom={5}
        mapId="e8c5be880ebdaebd" // Important for Advanced Markers
        gestureHandling="greedy"
        disableDefaultUI={true}
      >
        {/* Main highlight marker - Always clickable */}
        <AdvancedMarker
          position={{ lat: MAIN_LOCATION.lat, lng: MAIN_LOCATION.lng }}
          onClick={() => {
            setShowMainInfo(true);
            setSelectedFarm(null);
          }}
          zIndex={100}
        >
          <div className="w-12 h-12 bg-amber-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-2xl transform -translate-y-1/2 animate-bounce cursor-pointer">
            <Star className="w-6 h-6 fill-white" />
          </div>
        </AdvancedMarker>

        {showMainInfo && (
          <InfoWindow
            position={{ lat: MAIN_LOCATION.lat, lng: MAIN_LOCATION.lng }}
            onCloseClick={() => setShowMainInfo(false)}
            pixelOffset={[0, -24]}
          >
            <div className="p-3 max-w-[250px]">
              <h3 className="font-bold text-amber-600 text-lg mb-1">{MAIN_LOCATION.name}</h3>
              <p className="text-slate-600 text-sm mb-3">{MAIN_LOCATION.address}</p>
              <Button
                size="sm"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
                onClick={() => window.open("https://maps.app.goo.gl/tYiMwmEGLiwEJBLx9", "_blank")}
              >
                View on Google Maps
              </Button>
            </div>
          </InfoWindow>
        )}

        {/* Regular Farm markers */}
        {mapFarms.map(farm => (
          <AdvancedMarker
            key={farm.id}
            position={{ lat: Number(farm.latitude), lng: Number(farm.longitude) }}
            onClick={() => {
              if (isGuest) return; // Prevent clicking for guests
              setSelectedFarm(farm);
              setShowMainInfo(false);
            }}
            zIndex={selectedFarm?.id === farm.id ? 50 : 10}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl transform -translate-y-1/2 transition-transform ${!isGuest ? 'hover:scale-110 cursor-pointer' : 'opacity-80'} ${selectedFarm?.id === farm.id ? 'bg-emerald-800 scale-125 z-50' : 'bg-emerald-600'}`}>
              <Sprout className="w-4 h-4" />
            </div>
          </AdvancedMarker>
        ))}

        {selectedFarm && !isGuest && (
          <InfoWindow
            position={{ lat: Number(selectedFarm.latitude), lng: Number(selectedFarm.longitude) }}
            onCloseClick={() => setSelectedFarm(null)}
            pixelOffset={[0, -20]}
          >
            <div className="p-2 max-w-[220px]">
              <h3 className="font-bold text-emerald-900 text-lg mb-1">{selectedFarm.name}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 md:line-clamp-3 mb-3">{selectedFarm.address}</p>
              <Button
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9"
                onClick={() => navigate(`/farm/${selectedFarm.id}`)}
              >
                View Farm Profile
              </Button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};
