import { TERRITORIES } from "./territories.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -----------------------------------------
//  CONFIG FIREBASE
// -----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAs0uisnGSK7OIrFqQPFYF6E-ctNOPY0Sw",
    authDomain: "a-ki-pri-sa-ye.firebaseapp.com",
    projectId: "a-ki-pri-sa-ye",
    storageBucket: "a-ki-pri-sa-ye.appspot.com",
    messagingSenderId: "379907916421",
    appId: "1:379907916421:web:3f16c0a862ed7ced362175"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let map;
let markers = [];

// -----------------------------------------
// STYLE PREMIUM GOOGLE MAPS
// -----------------------------------------
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9d2d8" }]
  }
];

// -----------------------------------------
//  ICÔNE MAGASIN PREMIUM BLEUE
// -----------------------------------------
const storeIcon = {
    url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
    scaledSize: new google.maps.Size(40, 40)
};

// -----------------------------------------
// INIT GOOGLE MAPS
// -----------------------------------------
function initMap(lat = 14.6, lon = -53.0, zoom = 3) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng: lon },
        zoom,
        mapTypeId: "roadmap",
        styles: mapStyle,
        disableDefaultUI: false
    });
}

// -----------------------------------------
// Charger magasins par territoire
// -----------------------------------------
export async function loadTerritory(territoryId) {
    const t = TERRITORIES.find(x => x.id === territoryId);
    initMap(t.center.lat, t.center.lon, t.zoom);

    markers.forEach(m => m.setMap(null));
    markers = [];

    const q = territoryId === "all"
        ? query(collection(db, "stores"))
        : query(collection(db, "stores"), where("territory", "==", territoryId));

    const snap = await getDocs(q);

    snap.forEach(doc => placeMarker(doc.data()));
}

// -----------------------------------------
// Crée un marqueur avec popup + GPS
// -----------------------------------------
function placeMarker(store) {
    if (!store.lat || !store.lon) return;

    const marker = new google.maps.Marker({
        position: { lat: store.lat, lng: store.lon },
        map,
        title: store.name,
        icon: storeIcon
    });

    markers.push(marker);

    const popup = `
        <div style="font-size:15px;color:black;">
            <strong>${store.name}</strong><br>
            ${store.address}<br><br>

            <button onclick="openGPS(${store.lat}, ${store.lon})"
             style="background:#1e90ff;color:white;padding:7px 12px;border:none;border-radius:6px;">
                📍 Démarrer GPS
            </button>
        </div>
    `;

    const info = new google.maps.InfoWindow({ content: popup });
    marker.addListener("click", () => info.open(map, marker));
}

window.openGPS = function(lat, lon) {
    window.open(`https://maps.google.com/?q=${lat},${lon}`, "_blank");
};

// -----------------------------------------
// INIT PAGE
// -----------------------------------------
window.onload = () => {
    const select = document.getElementById("territorySelect");
    select.innerHTML = TERRITORIES.map(t =>
        `<option value="${t.id}">${t.flag} ${t.name}</option>`
    ).join("");

    select.addEventListener("change", () => loadTerritory(select.value));

    initMap();
};