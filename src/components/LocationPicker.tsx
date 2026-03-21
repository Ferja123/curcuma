import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
}

function LocationMarker({ location, setLocation }: LocationPickerProps) {
  const map = useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 17);
    }
  }, [location, map]);

  return location === null ? null : (
    <Marker 
      position={[location.lat, location.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLocation({ lat: position.lat, lng: position.lng });
        },
      }}
    ></Marker>
  );
}

export default function LocationPicker({ location, setLocation }: LocationPickerProps) {
  // Default center: Lima, Peru (since the app mentions Peru)
  const defaultCenter = { lat: -12.0464, lng: -77.0428 };

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border-2 border-slate-200 relative z-0 shadow-inner">
      <MapContainer 
        center={[location?.lat || defaultCenter.lat, location?.lng || defaultCenter.lng]} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker location={location} setLocation={setLocation} />
      </MapContainer>
      
      {!location && (
        <div className="absolute inset-0 z-[400] pointer-events-none flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 animate-bounce">
            <MapPin className="w-5 h-5" />
            Toca el mapa para elegir tu ubicación
          </div>
        </div>
      )}
    </div>
  );
}
