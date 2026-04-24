/// <reference types="google.maps" />
"use client";

import { useEffect, useRef, useState } from "react";
import { Map, AdvancedMarker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface LocationPickerProps {
  address: string;
  latitude: number | "";
  longitude: number | "";
  onLocationChange: (lat: number, lng: number, address: string) => void;
  className?: string;
}

// Default to India center
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 4;

export const LocationPicker = ({
  address,
  latitude,
  longitude,
  onLocationChange,
  className = "",
}: LocationPickerProps) => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const geocodingLibrary = useMapsLibrary("geocoding");
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | undefined>(
    latitude && longitude ? { lat: Number(latitude), lng: Number(longitude) } : undefined
  );
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({ lat: Number(latitude), lng: Number(longitude) });
      
      // Auto-center and zoom once when map and coordinates are first available
      if (map && !hasCentered) {
        map.setCenter({ lat: Number(latitude), lng: Number(longitude) });
        map.setZoom(15);
        setHasCentered(true);
      }
    }
  }, [latitude, longitude, map, hasCentered]);

  // Use the NEW Places API Web Component
  useEffect(() => {
    const container = autocompleteContainerRef.current;
    if (!placesLibrary || !container) return;

    // Type assertion to bypass strict Typescript errors for new beta elements
    const places = placesLibrary as unknown as { PlaceAutocompleteElement: unknown };
    if (!places.PlaceAutocompleteElement) return;

    const AutocompleteConstructor = places.PlaceAutocompleteElement as new (options?: unknown) => HTMLElement & { 
      addEventListener: (type: string, listener: (event: Event) => void) => void, 
      removeEventListener: (type: string, listener: (event: Event) => void) => void 
    };
    const autocompleteElement = new AutocompleteConstructor({
      includedRegionCodes: ["in"],
    });
    autocompleteElement.setAttribute('id', 'location-search');
    autocompleteElement.setAttribute('name', 'location-search');

    const handleSelect = async (event: Event) => {
      try {
        const customEvent = event as Event & { placePrediction: { toPlace: () => google.maps.places.Place } };
        const place = customEvent.placePrediction.toPlace();
        await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] });
        
        if (!place.location) return;

        const lat = place.location.lat();
        const lng = place.location.lng();
        const newAddress = place.formattedAddress || place.displayName || "";

        setMarkerPosition({ lat, lng });
        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(15);
        }
        
        onLocationChange(lat, lng, newAddress);
      } catch (err) {
        console.error("Failed to fetch place details", err);
      }
    };

    autocompleteElement.addEventListener('gmp-select', handleSelect);
    
    // Fallback for beta channel
    autocompleteElement.addEventListener('gmp-placeselect', async (event: Event) => {
        try {
            const customEvent = event as Event & { place: google.maps.places.Place };
            const place = customEvent.place;
            await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] });
            if (!place.location) return;
            const lat = place.location.lat();
            const lng = place.location.lng();
            const newAddress = place.formattedAddress || place.displayName || "";

            setMarkerPosition({ lat, lng });
            if (map) {
                map.setCenter({ lat, lng });
                map.setZoom(15);
            }
            onLocationChange(lat, lng, newAddress);
        } catch (err) {
            console.error("Error fetching place", err);
        }
    });

    container.innerHTML = '';
    container.appendChild(autocompleteElement);

    return () => {
      autocompleteElement.removeEventListener('gmp-select', handleSelect);
      container.innerHTML = '';
    };
  }, [placesLibrary, map, onLocationChange]);

  // Handle marker drag
  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !geocodingLibrary) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    // Reverse geocode
    const geocoder = new geocodingLibrary.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results.length > 0) {
        const newAddress = response.results[0].formatted_address;
        
        // Let the parent update the display text via onLocationChange
        onLocationChange(lat, lng, newAddress);
      } else {
        onLocationChange(lat, lng, address); // keep old if missing
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      onLocationChange(lat, lng, address);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <style>{`
        gmp-place-autocomplete {
          position: relative;
          --gmp-mat-font-family: inherit;
          --gmp-mat-color-primary: #059669;
          --gmp-mat-color-surface: #ffffff;
          --gmp-mat-color-on-surface: #0f172a;
          --gmp-mat-color-on-surface-variant: #334155;
          --gmp-mat-spacing-small: 12px;
          
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          height: 48px;
          display: block;
          background: white;
          transition: all 0.2s;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          color: #0f172a;
        }

        gmp-place-autocomplete:focus-within {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        /* Ensure typed text is visible */
        gmp-place-autocomplete::part(input) {
          height: 100%;
          width: 100%;
          padding: 0 12px;
          font-size: 0.95rem;
          border: none;
          background: transparent;
          color: #0f172a;
          outline: none;
        }

        gmp-place-autocomplete::part(prediction-list) {
          position: absolute; /* Force overlay to prevent pushing form elements */
          top: 100%;
          left: 0;
          z-index: 50;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          margin-top: 8px;
          padding: 8px;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
          background: white;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        gmp-place-autocomplete::part(prediction-item) {
          border-radius: 0.75rem;
          padding: 10px 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #475569; /* Make secondary text readable (slate-600) */
          cursor: pointer;
        }
        
        gmp-place-autocomplete::part(prediction-item-main-text) {
          color: #0f172a; /* Make primary text dark */
        }

        gmp-place-autocomplete::part(prediction-item):hover,
        gmp-place-autocomplete::part(prediction-item-selected) {
          background-color: #ecfdf5; /* Match site theme (emerald-50) */
        }

        gmp-place-autocomplete::part(prediction-item-match) {
          color: #059669; /* Match site theme (emerald-600) */
          font-weight: 700;
        }
      `}</style>
      <div className="space-y-2">
        <Label className="text-emerald-800 font-semibold ml-1">Search Farm Location</Label>
        <div 
          className="w-full relative [&>gmp-place-autocomplete]:w-full [&>gmp-place-autocomplete]:block" 
          ref={autocompleteContainerRef}
        ></div>
        {address && (
          <div className="flex items-start gap-2 mt-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-800 font-medium leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold block mb-0.5">Current Address</span>
              {address}
            </p>
          </div>
        )}
        <p className="text-xs text-slate-400 ml-1 italic">Type to search or drag the pin on the map</p>
      </div>

      <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-slate-200 relative">
        <Map
          defaultCenter={latitude && longitude ? { lat: Number(latitude), lng: Number(longitude) } : DEFAULT_CENTER}
          defaultZoom={latitude && longitude ? 15 : DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={true}
          mapId="e8c5be880ebdaebd" // Optional map ID for advanced markers features
        >
          {latitude && longitude && markerPosition && (
            <AdvancedMarker
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            >
              <div className="w-8 h-8 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-xl transform -translate-y-1/2 cursor-grab active:cursor-grabbing">
                <MapPin className="w-4 h-4" />
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </div>
    </div>
  );
};
