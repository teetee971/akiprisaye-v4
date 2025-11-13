export function openGPS(lat, lng, name = "") {
  const encoded = encodeURIComponent(name);

  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  window.open(url, "_blank");
}