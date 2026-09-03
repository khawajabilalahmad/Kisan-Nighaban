import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Bounding box for Pakistan
const PAKISTAN_BOUNDS = [
  [23.5, 60.5], // South-West
  [37.5, 78.0]  // North-East
];
const CENTER = [30.3753, 69.3451];

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ initialPosition, onConfirm }) {
  const [position, setPosition] = useState(initialPosition || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCenter, setSearchCenter] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Pakistan')}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchCenter([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text" 
          placeholder="Search city or area..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
        />
        <button 
          type="submit" 
          disabled={isSearching}
          className="bg-primary/10 hover:bg-primary/20 text-primary p-2.5 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
        >
          <Search size={18} />
        </button>
      </form>

      <div className="w-full h-96 rounded-xl overflow-hidden shadow-inner relative z-0 border border-slate-200 dark:border-white/10">
        <MapContainer 
          center={CENTER} 
          zoom={5} 
          minZoom={5}
          maxBounds={PAKISTAN_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapUpdater center={searchCenter} />
        </MapContainer>
      </div>
      <button 
        onClick={() => onConfirm(position)}
        disabled={!position}
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3 transition-colors disabled:opacity-50 shadow-md"
      >
        {position ? 'Confirm Selected Location' : 'Tap on the map to pin'}
      </button>
    </div>
  );
}
