import { initMap, addMarker } from "./map-init.js";
import { getStoresByTerritory, getAllStores } from "./magasins-firestore.js";

let currentMap;

document.addEventListener("DOMContentLoaded", async () => {
    const select = document.getElementById("territorySelect");

    async function loadTerritory(territory) {
        let stores = territory === "all"
            ? await getAllStores()
            : await getStoresByTerritory(territory);

        const first = stores[0] || { lat: 16.24, lon: -61.53 }; // fallback Gpe

        currentMap = initMap({ lat: first.lat, lng: first.lon }, 11);

        stores.forEach(store => addMarker(store));
    }

    select.addEventListener("change", () => {
        const val = select.value.toLowerCase();
        loadTerritory(val === "tous" ? "all" : val);
    });

    loadTerritory("all");
});