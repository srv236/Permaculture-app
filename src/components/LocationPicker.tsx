"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Check, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLat?: number;
  initialLng?: number;
  onConfirm: (lat: number, lng: number, address: string) => void;
}

const CENTER_PIN_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -100%)",
  zIndex: 10,
  pointerEvents: "none",
};

type MapStyle = "standard" | "hybrid" | "satellite";

export const LocationPicker = ({
  open,
  onOpenChange,
  initialLat,
  initialLng,
  onConfirm,
}: LocationPickerProps) => {
  const isValidCoord = (num: any) => typeof num === "number" && !isNaN(num);

  const [position, setPosition] = useState<[number, number]>(() => {
    const defaultPos: [number, number] = [20.5937, 78.9629];
    if (isValidCoord(initialLat) && isValidCoord(initialLng)) {
      return [initialLat as number, initialLng as number];
    }
    return defaultPos;
  });

  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const [isSearchReady, setIsSearchReady] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_REST_KEY;

  // Dynamically load Mappls SDK
  useEffect(() => {
    if (!open || sdkLoaded) return;

    // Remove existing scripts to avoid duplicates
    const existingScript = document.querySelector('script[src*="mappls.com"]');
    if (existingScript) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement("script");
    // Official Mappls v3 SDK endpoint as per GitHub README (August 2025)
    script.src = `https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=${MAPPLS_KEY}&libraries=search`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "strict-origin-when-cross-origin";
    
    // Diagnostic log for the user (masked for security)
    console.log(`Mappls SDK: Loading official v3 from sdk.mappls.com with key ${MAPPLS_KEY.substring(0, 4)}...`);

    script.onload = () => {
      console.log("Mappls SDK: Script loaded successfully.");
      setSdkLoaded(true);
      // Brief delay to ensure internal SDK objects are fully parsed
      setTimeout(() => setIsSearchReady(true), 500);
    };
    script.onerror = () => {
      console.error(`Mappls SDK: Failed to load. Check your whitelist for 'http://localhost:8080' and ensure the key has Map SDK permissions.`);
    };
    document.head.appendChild(script);

    return () => {
      // We don't remove the script on cleanup to keep it available globally
    };
  }, [open, MAPPLS_KEY, sdkLoaded]);

  // Initialize Mappls Map
  useEffect(() => {
    if (!open || !containerRef.current || mapRef.current || !sdkLoaded) return;

    const mappls = (window as any).mappls;
    if (!mappls) return;

    try {
      // v3 requires explicit initialization in some environments
      if (typeof mappls.initialize === "function") {
        mappls.initialize(MAPPLS_KEY);
      }

      const map = new mappls.Map(containerRef.current, {
        center: { lat: position[0], lng: position[1] },
        zoom: 13,
        zoomControl: false,
        locationControl: false,
      });

      map.addListener("moveend", () => {
        const center = map.getCenter();
        const newPos: [number, number] = [center.lat, center.lng];
        setPosition(newPos);
        updateAddress(center.lat, center.lng);
      });

      mapRef.current = map;
    } catch (err) {
      console.error("Error initializing Mappls Map:", err);
    }

    return () => {
      if (mapRef.current) {
        // Mappls SDK cleanup if needed
        mapRef.current = null;
      }
    };
  }, [open, MAPPLS_KEY, sdkLoaded]);

  // Handle style changes
  useEffect(() => {
    if (!mapRef.current || !sdkLoaded) return;
    
    try {
      // Mappls style mapping
      const styleId = mapStyle === "hybrid" ? "hybrid" : mapStyle === "satellite" ? "satellite" : "standard";
      mapRef.current.setStyle(styleId);
    } catch (err) {
      console.warn("Mappls: Style change not supported or failed", err);
    }
  }, [mapStyle, sdkLoaded]);

  // Sync position if initial values change
  useEffect(() => {
    if (open && mapRef.current && isValidCoord(initialLat) && isValidCoord(initialLng)) {
      const newPos = { lat: initialLat as number, lng: initialLng as number };
      mapRef.current.setCenter(newPos);
      mapRef.current.setZoom(16);
    }
  }, [initialLat, initialLng, open]);

  const updateAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://atlas.mappls.com/api/places/eloc/reverse?lat=${lat}&lng=${lng}&access_token=${MAPPLS_KEY}`
      );
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        setCurrentAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error("Mappls reverse geocoding error:", error);
    }
  };

  const handleInputChange = async (val: string) => {
    setSearchQuery(val);
    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const mappls = (window as any).mappls;
    if (!mappls || !mappls.search) {
      return;
    }

    try {
      // Use the Mappls SDK's internal search handler to avoid CORS issues
      new mappls.search(val, { 
        location: { lat: position[0], lng: position[1] }, // v3 requires object format
        region: "ind"
      }, (data: any) => {
        if (data && Array.isArray(data)) {
          // Map SDK results to our suggestion format
          const formatted = data.map((item: any) => ({
            placeName: item.placeName || item.pname,
            placeAddress: item.placeAddress || item.addr,
            eLoc: item.eLoc || item.eloc
          }));
          setSuggestions(formatted);
          setShowSuggestions(true);
        } else if (data && data.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      });
    } catch (error) {
      console.error("Mappls SDK search error:", error);
    }
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    setSearchQuery(suggestion.placeName);
    setShowSuggestions(false);
    setLoading(true);

    const mappls = (window as any).mappls;
    if (!mappls) return;

    try {
      // Use the SDK to get precise coordinates for the eLoc
      // The SDK methods handle the auth and CORS headers internally
      new mappls.getDetails({ eloc: suggestion.eLoc }, (data: any) => {
        if (data && (data.results || data.products)) {
          const place = (data.results || data.products)[0];
          const lat = parseFloat(place.latitude || place.lat);
          const lng = parseFloat(place.longitude || place.lng || place.lon);
          
          if (isValidCoord(lat) && isValidCoord(lng)) {
            const newPos = { lat, lng };
            setPosition([lat, lng]);
            setCurrentAddress(suggestion.placeName + ", " + suggestion.placeAddress);
            
            if (mapRef.current) {
              mapRef.current.panTo(newPos);
              mapRef.current.setZoom(16);
            }
          }
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Mappls SDK getDetails error:", error);
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(position[0], position[1], currentAddress);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Set Farm Location
          </DialogTitle>
          <DialogDescription>
            Search for your farm's address or drag the map to position the pin exactly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 relative flex flex-col">
          {/* Search Bar */}
          <div className="px-6 py-3 bg-white/80 backdrop-blur-md z-30 border-b border-emerald-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={isSearchReady ? "Search address or village..." : "Loading smart search..."}
                className="pl-10 h-12 rounded-2xl border-slate-200 focus:ring-emerald-500 shadow-sm disabled:opacity-50"
                value={searchQuery}
                disabled={!isSearchReady}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-full px-5 py-4 text-left hover:bg-emerald-50 border-b border-slate-50 last:border-0 transition-colors flex flex-col gap-1"
                      onClick={() => handleSelectSuggestion(s)}
                    >
                      <span className="text-sm font-bold text-slate-800">{s.placeName}</span>
                      <span className="text-xs text-slate-400 truncate">{s.placeAddress}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative bg-slate-100">
            <div ref={containerRef} className="w-full h-full" id="mappls-map-container" />
            
            {/* Style Toggle Overlay */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-white flex flex-col">
                <button
                  onClick={() => setMapStyle("standard")}
                  className={cn(
                    "p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold",
                    mapStyle === "standard" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  Standard
                </button>
                <button
                  onClick={() => setMapStyle("hybrid")}
                  className={cn(
                    "p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold",
                    mapStyle === "hybrid" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  Hybrid
                </button>
                <button
                  onClick={() => setMapStyle("satellite")}
                  className={cn(
                    "p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold",
                    mapStyle === "satellite" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  Satellite
                </button>
              </div>
            </div>

            {/* Center Pin Overlay */}
            <div style={CENTER_PIN_STYLE}>
              <div className="relative group">
                <MapPin className="w-12 h-12 text-emerald-600 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300" fill="white" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/30 rounded-full blur-[2px]" />
              </div>
            </div>
            
            {/* Coordinates Display Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl z-20 border border-emerald-100/50 animate-in fade-in slide-in-from-bottom-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Verified Location</p>
                  <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                    {currentAddress || "Locating precise address..."}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-100 italic">
                      {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </span>
                  </div>
                </div>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mt-1" />}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50/50 backdrop-blur-sm border-t border-slate-100 gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="rounded-2xl h-12 px-6 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 h-12 rounded-2xl px-10 flex items-center gap-2 text-white font-bold shadow-lg shadow-emerald-200"
          >
            <Check className="w-5 h-5" />
            Confirm Farm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
