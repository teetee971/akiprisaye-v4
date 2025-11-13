// map-init.js
export function initMap(containerId) {
  const map = L.map(containerId, {
    zoomControl: false,
    preferCanvas: true,
  }).setView([16.265, -61.551], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  return map;
}