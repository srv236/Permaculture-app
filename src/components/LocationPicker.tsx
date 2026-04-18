"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Search, MapPin, Loader2, Target, Navigation } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
}

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LocationTracker = ({ onMove }: { onMove: (lat: number, lng: number) => void }) => {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      onMove(center.lat, center.lng);
    },
  });
  return null;
};

export const LocationPicker = ({ 
  onLocationSelect, 
  initialLat = 20.5937, 
  initialLng = 78.9629,
  initialAddress = "" 
}: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [mapCenter, setMapCenter] = useState<[number, number]>([initialLat, initialLng]);
  const [currentPos, setCurrentPos] = useState({ lat: initialLat, lng: initialLng });
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundAddress, setFoundAddress] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setFoundAddress(null);
    try {
      // Added addressdetails=1 and limit=1 for better precision
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setMapCenter([newLat, newLng]);
        setCurrentPos({ lat: newLat, lng: newLng });
        setFoundAddress(display_name);
        // Automatically update the search query with the standardized address
        setSearchQuery(display_name);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setCurrentPos({ lat: latitude, lng: longitude });
        
        // Reverse geocode to get the address for current location
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setSearchQuery(data.display_name);
            setFoundAddress(data.display_name);
          }
        } catch (e) {}
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
      }
    );
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentPos.lat}&lon=${currentPos.lng}`
      );
      const data = await response.json();
      const finalAddress = data.display_name || searchQuery;
      
      onLocationSelect({
        address: finalAddress,
        lat: currentPos.lat,
        lng: currentPos.lng
      });
    } catch (error) {
      console.error("Geocoding error:", error);
      onLocationSelect({
        address: searchQuery,
        lat: currentPos.lat,
        lng: currentPos.lng
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search farm location..." 
            className="pl-10 h-11 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
          />
        </div>
        <Button 
          type="button" 
          variant="secondary" 
          className="h-11 px-4 rounded-xl"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="h-11 px-4 rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50"
          onClick={handleUseMyLocation}
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {foundAddress && (
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-2 items-start">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-[10px] text-blue-800 leading-tight">
            <span className="font-bold">Match Found:</span> {foundAddress}
          </div>
        </div>
      )}

      <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          <LocationTracker onMove={(lat, lng) => setCurrentPos({ lat, lng })} />
        </MapContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000] mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm mb-1 border border-slate-200">
              <span className="text-[10px] font-bold text-emerald-700 whitespace-nowrap">Target Location</span>
            </div>
            <MapPin className="w-8 h-8 text-emerald-600 drop-shadow-md animate-bounce" />
            <div className="w-1.5 h-1.5 bg-black/20 rounded-full blur-[1px]" />
          </div>
        </div>

        <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-[10px] font-mono text-slate-500">
          {currentPos.lat.toFixed(6)}, {currentPos.lng.toFixed(6)}
        </div>
      </div>

      <Button 
        type="button" 
        className="w-full h-11 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none shadow-none font-bold rounded-xl"
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
        Confirm Pin Position
      </Button>
      
      <p className="text-[10px] text-slate-400 text-center italic">
        Drag the map to position the green pin exactly on your farm.
      </p>
    </div>
  );
};

// Add Info icon to imports since it's used in the feedback box
import { Info as LucideInfo } from "lucide-react";