import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Car, Footprints, Bus, MapPin, Loader2, Clock, History, Share2, Wifi, WifiOff } from 'lucide-react';
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [recentDestinations, setRecentDestinations] = useState([]);
  const [showRecentDestinations, setShowRecentDestinations] = useState(false);

  // Constants
  const NAVIGATION_TIMEOUT = 1000; // Timeout for resetting navigation state
  const MAX_RECENT_DESTINATIONS = 5; // Maximum recent destinations to store
  const RECENT_DESTINATIONS_KEY = 'akiprisaye_recent_destinations'; // localStorage key

  // Load recent destinations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_DESTINATIONS_KEY);
    if (saved) {
      try {
        setRecentDestinations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent destinations:', e);
      }
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper function to save destination to recent history
  const saveToRecentDestinations = (store) => {
    const newDestination = {
      name: store.name,
      lat: store.lat,
      lon: store.lon,
      category: store.category,
      timestamp: Date.now()
    };

    setRecentDestinations(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(d => !(d.lat === store.lat && d.lon === store.lon));
      // Add new destination at the beginning
      const updated = [newDestination, ...filtered].slice(0, MAX_RECENT_DESTINATIONS);
      // Save to localStorage
      localStorage.setItem(RECENT_DESTINATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Helper function to estimate travel time
  const estimateTravelTime = (distance, mode) => {
    // Average speeds: driving 50km/h, walking 5km/h, transit 30km/h
    const speeds = {
      driving: 50,
      walking: 5,
      transit: 30
    };
    
    const speed = speeds[mode] || 50;
    const timeInHours = distance / speed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    return timeInMinutes;
  };

  // Helper function to format travel time
  const formatTravelTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Helper function to share store location
  const shareLocation = (store) => {
    const shareData = {
      title: `${store.name} - ${store.category}`,
      text: `Localisation de ${store.name}`,
      url: `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: copy to clipboard
      const text = `${store.name} - ${store.category}\nCoordonnées GPS: ${store.lat}, ${store.lon}\nLien: https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`;
      navigator.clipboard.writeText(text)
        .then(() => alert('Coordonnées copiées dans le presse-papier !'))
        .catch(() => alert(`${store.name}\nCoordonnées: ${store.lat}, ${store.lon}`));
    }
  };

  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Helper function to format distance
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Helper function to detect platform and open appropriate navigation app
  const handleGPS = (lat, lon, mode, storeName, store) => {
    // Check if offline
    if (!isOnline) {
      alert('Vous êtes hors ligne. Les coordonnées GPS sont disponibles ci-dessous:\nLatitude: ' + lat + '\nLongitude: ' + lon);
      return;
    }

    // Save to recent destinations if store object is provided
    if (store) {
      saveToRecentDestinations(store);
    }

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lon !== 'number' || 
        isNaN(lat) || isNaN(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error('Invalid coordinates provided');
      alert('Coordonnées invalides. Impossible d\'ouvrir la navigation.');
      return;
    }
    // Validate travel mode
    if (mode !== 'driving' && mode !== 'walking' && mode !== 'transit') {
      console.error('Invalid travel mode. Must be "driving", "walking", or "transit"');
      alert('Mode de transport invalide.');
      return;
    }
    
    setIsNavigating(true);
    
    try {
      // Detect platform
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const isAndroid = /android/i.test(userAgent);
      
      let url;
      
      // Build URL with origin if user position is available
      const origin = userPosition ? `${userPosition[0]},${userPosition[1]}` : 'current+location';
      
      // For iOS, provide options
      if (isIOS) {
        const useAppleMaps = confirm('Ouvrir dans Apple Maps ?\n\nOK = Apple Maps\nAnnuler = Google Maps');
        if (useAppleMaps) {
          // Apple Maps URL
          url = `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=${mode === 'driving' ? 'd' : mode === 'walking' ? 'w' : 'r'}`;
        } else {
          // Google Maps URL
          url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lon}&travelmode=${mode}`;
        }
      } 
      // For Android, offer Waze option
      else if (isAndroid) {
        const useWaze = confirm('Ouvrir dans Waze ?\n\nOK = Waze\nAnnuler = Google Maps');
        if (useWaze) {
          // Waze URL
          url = `https://www.waze.com/ul?ll=${lat},${lon}&navigate=yes`;
        } else {
          // Google Maps URL
          url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lon}&travelmode=${mode}`;
        }
      }
      // Default to Google Maps
      else {
        url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lon}&travelmode=${mode}`;
      }
      
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Check if popup was blocked (browsers may return null or undefined)
      if (!newWindow) {
        alert('Le navigateur a bloqué l\'ouverture de Google Maps. Veuillez autoriser les popups pour ce site.');
      }
      
      // Reset loading state after a short delay
      setTimeout(() => setIsNavigating(false), NAVIGATION_TIMEOUT);
    } catch (error) {
      console.error('Error opening navigation:', error);
      alert('Erreur lors de l\'ouverture de la navigation. Veuillez réessayer.');
      setIsNavigating(false);
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

        {/* Offline/Online Status Banner */}
        {!isOnline && (
          <div className="mb-6 bg-orange-600/20 border border-orange-500/50 rounded-lg p-4 flex items-center gap-3">
            <WifiOff size={24} className="text-orange-400" />
            <div>
              <p className="font-semibold text-orange-400">Mode hors ligne</p>
              <p className="text-sm text-slate-300">
                Vous êtes hors ligne. Les coordonnées GPS sont disponibles mais la navigation nécessite une connexion.
              </p>
            </div>
          </div>
        )}

        {/* Recent Destinations */}
        {recentDestinations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-slate-300 flex items-center gap-2">
                <History size={20} className="text-blue-400" />
                Destinations récentes
              </h2>
              <button
                onClick={() => setShowRecentDestinations(!showRecentDestinations)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {showRecentDestinations ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {showRecentDestinations && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentDestinations.map((dest, idx) => {
                  const distance = userPosition 
                    ? calculateDistance(userPosition[0], userPosition[1], dest.lat, dest.lon)
                    : null;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-600 rounded-lg p-3 bg-slate-700/50 hover:border-blue-400 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-200 text-sm">{dest.name}</h3>
                          <p className="text-xs text-slate-400">{dest.category}</p>
                          {distance && (
                            <p className="text-xs text-blue-400 mt-1">{formatDistance(distance)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleGPS(dest.lat, dest.lon, 'driving', dest.name, dest)}
                          className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs hover:bg-blue-600/40"
                          disabled={isNavigating || !isOnline}
                        >
                          <Car size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
            
            {stores.map((store, index) => {
              const distance = userPosition 
                ? calculateDistance(userPosition[0], userPosition[1], store.lat, store.lon)
                : null;
              
              return (
              <Marker key={index} position={[store.lat, store.lon]}>
                <Popup>
                  <div className="text-slate-900">
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-slate-600">{store.category}</p>
                    <p className="text-xs text-slate-500">{currentTerritory?.name || territory}</p>
                    {distance && (
                      <div className="text-xs mt-1 space-y-1">
                        <p className="text-blue-600 font-medium">
                          <MapPin size={12} className="inline mr-1" />
                          Distance: {formatDistance(distance)}
                        </p>
                        <div className="flex gap-2 text-slate-600">
                          <span title="Temps en voiture">
                            <Car size={12} className="inline mr-1" />
                            {formatTravelTime(estimateTravelTime(distance, 'driving'))}
                          </span>
                          <span title="Temps à pied">
                            <Footprints size={12} className="inline mr-1" />
                            {formatTravelTime(estimateTravelTime(distance, 'walking'))}
                          </span>
                          <span title="Temps en transport">
                            <Bus size={12} className="inline mr-1" />
                            {formatTravelTime(estimateTravelTime(distance, 'transit'))}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleGPS(store.lat, store.lon, 'driving', store.name, store)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                        title="Naviguer en voiture"
                        disabled={isNavigating || !isOnline}
                      >
                        {isNavigating ? <Loader2 size={14} className="animate-spin" /> : <Car size={14} />}
                      </button>
                      <button
                        onClick={() => handleGPS(store.lat, store.lon, 'walking', store.name, store)}
                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        title="Naviguer à pied"
                        disabled={isNavigating || !isOnline}
                      >
                        {isNavigating ? <Loader2 size={14} className="animate-spin" /> : <Footprints size={14} />}
                      </button>
                      <button
                        onClick={() => handleGPS(store.lat, store.lon, 'transit', store.name, store)}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 disabled:opacity-50"
                        title="Transports en commun"
                        disabled={isNavigating || !isOnline}
                      >
                        {isNavigating ? <Loader2 size={14} className="animate-spin" /> : <Bus size={14} />}
                      </button>
                      <button
                        onClick={() => shareLocation(store)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-700"
                        title="Partager"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
            })}

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
            {stores.map((store, index) => {
              const distance = userPosition 
                ? calculateDistance(userPosition[0], userPosition[1], store.lat, store.lon)
                : null;
              
              return (
              <div
                key={index}
                className="border border-slate-700 rounded-lg p-4 bg-slate-800/50 hover:border-blue-500 transition shadow-lg"
              >
                <h3 className="font-semibold text-slate-100 mb-1">{store.name}</h3>
                <p className="text-slate-400 text-sm mb-2">{store.category}</p>
                <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                  <span>📍 {store.lat.toFixed(4)}°, {store.lon.toFixed(4)}°</span>
                  {distance && (
                    <span className="text-blue-400 font-medium">
                      {formatDistance(distance)}
                    </span>
                  )}
                </div>
                {distance && (
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mb-3 bg-slate-900/50 rounded p-2">
                    <div className="flex items-center gap-1">
                      <Car size={12} />
                      <span>{formatTravelTime(estimateTravelTime(distance, 'driving'))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Footprints size={12} />
                      <span>{formatTravelTime(estimateTravelTime(distance, 'walking'))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bus size={12} />
                      <span>{formatTravelTime(estimateTravelTime(distance, 'transit'))}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGPS(store.lat, store.lon, 'driving', store.name, store)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition border border-blue-500/30 disabled:opacity-50"
                      disabled={isNavigating || !isOnline}
                    >
                      {isNavigating ? <Loader2 size={16} className="animate-spin" /> : <Car size={16} />}
                      <span>En voiture</span>
                    </button>
                    <button
                      onClick={() => handleGPS(store.lat, store.lon, 'walking', store.name, store)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30 transition border border-green-500/30 disabled:opacity-50"
                      disabled={isNavigating || !isOnline}
                    >
                      {isNavigating ? <Loader2 size={16} className="animate-spin" /> : <Footprints size={16} />}
                      <span>À pied</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGPS(store.lat, store.lon, 'transit', store.name, store)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30 transition border border-purple-500/30 disabled:opacity-50"
                      disabled={isNavigating || !isOnline}
                    >
                      {isNavigating ? <Loader2 size={16} className="animate-spin" /> : <Bus size={16} />}
                      <span>Transports en commun</span>
                    </button>
                    <button
                      onClick={() => shareLocation(store)}
                      className="flex items-center justify-center px-3 py-2 bg-slate-600/20 text-slate-400 rounded-lg text-sm hover:bg-slate-600/30 transition border border-slate-500/30"
                      title="Partager la localisation"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
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