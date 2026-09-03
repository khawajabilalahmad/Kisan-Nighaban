import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

export default function MapPicker({ initialPosition, onConfirm }) {
  const [position, setPosition] = useState(initialPosition || null);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-64 rounded-xl overflow-hidden shadow-inner relative z-0">
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
        </MapContainer>
      </div>
      <button 
        onClick={() => onConfirm(position)}
        disabled={!position}
        className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3 transition-colors disabled:opacity-50"
      >
        {position ? 'Confirm Selected Location' : 'Tap on the map to pin'}
      </button>
    </div>
  );
}
