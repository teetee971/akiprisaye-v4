import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Car, Footprints } from 'lucide-react';
import { getStoresByTerritory } from '../services/mapService';
import { getActiveTerritories, TERRITORIES } from '../constants/territories';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 11);
  }, [position, map]);
  return null;
}

export default function Carte() {
  const [territory, setTerritory] = useState('GP'); // Code territoire
  const [stores, setStores] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  // Helper function to open Google Maps navigation with user feedback
  const handleGPS = (lat, lon, mode) => {
    // Validate coordinates
    if (typeof lat !== 'number' || typeof lon !== 'number' || 
        isNaN(lat) || isNaN(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error('Invalid coordinates provided');
      alert('Coordonnées invalides. Impossible d\'ouvrir la navigation.');
      return;
    }
    // Validate travel mode
    if (mode !== 'driving' && mode !== 'walking') {
      console.error('Invalid travel mode. Must be "driving" or "walking"');
      alert('Mode de transport invalide.');
      return;
    }
    
    try {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=${mode}`;
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        alert('Le navigateur a bloqué l\'ouverture de Google Maps. Veuillez autoriser les popups pour ce site.');
      }
    } catch (error) {
      console.error('Error opening navigation:', error);
      alert('Erreur lors de l\'ouverture de la navigation. Veuillez réessayer.');
    }
  };

  // Construire la liste des territoires actifs
  const activeTerritories = getActiveTerritories();
  const territoryPositions = {};
  activeTerritories.forEach(t => {
    territoryPositions[t.code] = [t.center.lat, t.center.lng];
  });

  useEffect(() => {
    // Utiliser le code territoire pour récupérer les magasins
    const territoryObj = TERRITORIES[territory];
    if (territoryObj) {
      setStores(getStoresByTerritory(territoryObj.name));
    }
  }, [territory]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Géolocalisation refusée', err),
      );
    }
  }, []);

  const defaultPosition = territoryPositions[territory] || [16.265, -61.551]; // Guadeloupe par défaut
  const currentTerritory = TERRITORIES[territory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold mb-6 text-blue-400">
          🗺️ Carte Interactive des Magasins
        </h1>

        {/* Territory Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Sélectionner un territoire
          </label>
          <select
            value={territory}
            onChange={(e) => setTerritory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {activeTerritories.map((t) => (
              <option key={t.code} value={t.code}>
                {t.flag} {t.name} ({t.type})
              </option>
            ))}
          </select>
        </div>

        {/* Map Container */}
        <div className="rounded-lg overflow-hidden border border-slate-700 shadow-xl h-[600px] bg-slate-800">
          <MapContainer
            center={defaultPosition}
            zoom={currentTerritory?.zoom || 11}
            style={{ height: '100%', width: '100%' }}
          >
            {/* Utiliser un thème plus clair et lisible */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapUpdater position={territoryPositions[territory]} />
            
            {stores.map((store, index) => (
              <Marker key={index} position={[store.lat, store.lon]}>
                <Popup>
                  <div className="text-slate-900">
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-slate-600">{store.category}</p>
                    <p className="text-xs text-slate-500">{currentTerritory?.name || territory}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleGPS(store.lat, store.lon, 'driving')}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        title="Naviguer en voiture"
                      >
                        <Car size={14} />
                      </button>
                      <button
                        onClick={() => handleGPS(store.lat, store.lon, 'walking')}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        title="Naviguer à pied"
                      >
                        <Footprints size={14} />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {userPosition && (
              <Marker
                position={userPosition}
                icon={L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })}
              >
                <Popup>
                  <div className="text-slate-900">
                    <h3 className="font-semibold">Votre position</h3>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Store List */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Magasins en {currentTerritory?.name || territory} ({stores.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store, index) => (
              <div
                key={index}
                className="border border-slate-700 rounded-lg p-4 bg-slate-800/50 hover:border-blue-500 transition shadow-lg"
              >
                <h3 className="font-semibold text-slate-100 mb-1">{store.name}</h3>
                <p className="text-slate-400 text-sm mb-2">{store.category}</p>
                <p className="text-slate-500 text-xs mb-3">
                  📍 {store.lat.toFixed(4)}°, {store.lon.toFixed(4)}°
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGPS(store.lat, store.lon, 'driving')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition border border-blue-500/30"
                  >
                    <Car size={16} />
                    <span>En voiture</span>
                  </button>
                  <button
                    onClick={() => handleGPS(store.lat, store.lon, 'walking')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30 transition border border-green-500/30"
                  >
                    <Footprints size={16} />
                    <span>À pied</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {stores.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">🗺️ Aucun magasin référencé pour ce territoire</p>
              <p className="text-sm">Les données sont en cours de collecte pour ce territoire.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}