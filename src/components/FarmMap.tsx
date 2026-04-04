"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Farm } from '@/types/farm';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FarmMapProps {
  farms: Farm[];
}

export const FarmMap = ({ farms }: FarmMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter farms that have coordinates
  const farmsWithCoords = farms.filter(f => f.latitude && f.longitude);
  
  if (!isClient) {
    return <div className="h-full w-full bg-slate-100 flex items-center justify-center"><MapPin className="w-8 h-8 text-slate-400" /></div>;
  }

  // Default center (India) if no farms have coordinates
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const center: [number, number] = farmsWithCoords.length > 0 
    ? [farmsWithCoords[0].latitude!, farmsWithCoords[0].longitude!] 
    : defaultCenter;

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative z-0">
      <MapContainer 
        center={center} 
        zoom={farmsWithCoords.length > 0 ? 6 : 4} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {farmsWithCoords.map((farm) => (
          <Marker 
            key={farm.id} 
            position={[farm.latitude!, farm.longitude!]}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-emerald-900 text-lg mb-1">{farm.name}</h3>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {farm.address || "Location details available"}
                </p>
                <Link to={`/farm/${farm.id}`}>
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">
                    View Farm
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};