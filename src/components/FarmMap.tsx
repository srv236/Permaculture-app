"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Farm } from '@/types/farm';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapRefresher = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

interface FarmMapProps {
  farms: Farm[];
}

export const FarmMap = ({ farms }: FarmMapProps) => {
  const farmsWithCoords = farms.filter(f => f.latitude && f.longitude);
  
  const center: [number, number] = farmsWithCoords.length > 0 
    ? [farmsWithCoords[0].latitude!, farmsWithCoords[0].longitude!]
    : [20.5937, 78.9629];

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative z-0">
      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        key={farms.length}
      >
        <MapRefresher />
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