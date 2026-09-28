// RESQGRID Command Center Map

const map = L.map("dashboardMap").setView([13.0827, 80.2707], 11);


// OpenStreetMap base map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// Chennai boundary area
const chennaiBounds = L.latLngBounds(
    [12.80, 79.95],
    [13.35, 80.45]
);


// Keep map focused on Chennai
map.setMaxBounds(chennaiBounds);
map.setMinZoom(10);


// Selected location
let selectedLocationMarker = null;


// Selected location data
let selectedLatitude = null;
let selectedLongitude = null;
let selectedPlaceName = "";


// -----------------------------------------
// CLICK CHENNAI MAP
// -----------------------------------------

map.on("click", function (event) {

    selectedLatitude = event.latlng.lat;
    selectedLongitude = event.latlng.lng;

    // Remove previous marker
    if (selectedLocationMarker) {
        map.removeLayer(selectedLocationMarker);
    }

    // Add new selected-location marker
    selectedLocationMarker = L.marker([
        selectedLatitude,
        selectedLongitude
    ]).addTo(map);


    // Temporary popup
    selectedLocationMarker.bindPopup(`
        <div style="min-width:220px;">
            <h3>📍 Selected Location</h3>

            <p>
                <b>Finding place...</b>
            </p>

            <p>
                Latitude:
                ${selectedLatitude.toFixed(5)}
            </p>

            <p>
                Longitude:
                ${selectedLongitude.toFixed(5)}
            </p>
        </div>
    `).openPopup();


    // -----------------------------------------
    // GET PLACE NAME
    // -----------------------------------------

    fetch(
        "https://nominatim.openstreetmap.org/reverse" +
        "?format=json" +
        "&lat=" + selectedLatitude +
        "&lon=" + selectedLongitude +
        "&zoom=18" +
        "&addressdetails=1"
    )

    .then(function (response) {
        return response.json();
    })

    .then(function (data) {

        const address = data.address || {};

        selectedPlaceName =
            address.suburb ||
            address.neighbourhood ||
            address.city_district ||
            address.town ||
            address.city ||
            "Selected Chennai Location";


        selectedLocationMarker.bindPopup(`
            <div style="min-width:240px;">

                <h3>📍 Selected Location</h3>

                <p>
                    <b>Place:</b>
                    ${selectedPlaceName}
                </p>

                <p>
                    <b>Latitude:</b>
                    ${selectedLatitude.toFixed(5)}
                </p>

                <p>
                    <b>Longitude:</b>
                    ${selectedLongitude.toFixed(5)}
                </p>

                <p>
                    <b>Status:</b>
                    Ready for risk assessment
                </p>

            </div>
        `).openPopup();


        console.log(
            "Selected place:",
            selectedPlaceName
        );

    })

    .catch(function (error) {

        console.error(
            "Place lookup failed:",
            error
        );

        selectedPlaceName =
            "Selected Chennai Location";


        selectedLocationMarker.bindPopup(`
            <div style="min-width:220px;">

                <h3>📍 Selected Location</h3>

                <p>
                    <b>Place:</b>
                    Selected Chennai Location
                </p>

                <p>
                    <b>Latitude:</b>
                    ${selectedLatitude.toFixed(5)}
                </p>

                <p>
                    <b>Longitude:</b>
                    ${selectedLongitude.toFixed(5)}
                </p>

            </div>
        `).openPopup();

    });

});


// -----------------------------------------
// MAP SIZE FIX
// -----------------------------------------

setTimeout(function () {
    map.invalidateSize();
}, 500);