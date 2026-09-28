// ==========================================
// RESQGRID - CITIZEN RISK CHECK
// ==========================================

const API_URL = "http://127.0.0.1:5000";

const selectedLocation =
    document.getElementById("selectedLocation");

const selectedCoordinates =
    document.getElementById("selectedCoordinates");

const disasterType =
    document.getElementById("disasterType");

const checkRiskBtn =
    document.getElementById("checkRiskBtn");

const resultLocation =
    document.getElementById("resultLocation");

const selectedDisasterLabel =
    document.getElementById("selectedDisasterLabel");

const disasterRiskLabel =
    document.getElementById("disasterRiskLabel");

const selectedDisasterRisk =
    document.getElementById("selectedDisasterRisk");

const disasterIcon =
    document.getElementById("disasterIcon");

const riskBadge =
    document.getElementById("riskBadge");

const riskScore =
    document.getElementById("riskScore");

const riskMessage =
    document.getElementById("riskMessage");

const populationExposure =
    document.getElementById("populationExposure");

const roadAccess =
    document.getElementById("roadAccess");

const rainfallValue =
    document.getElementById("rainfallValue");

const nearestShelter =
    document.getElementById("nearestShelter");

const ambulances =
    document.getElementById("ambulances");

const rescueTeams =
    document.getElementById("rescueTeams");

const reliefKits =
    document.getElementById("reliefKits");

const recommendation =
    document.getElementById("recommendation");


// ==========================================
// VARIABLES
// ==========================================

let selectedLatitude = null;
let selectedLongitude = null;
let selectedMarker = null;

let selectedPlaceName =
    "Select a location on the map";


// ==========================================
// CHENNAI MAP
// ==========================================

const map = L.map("citizenMap", {
    zoomControl: true,
    scrollWheelZoom: true
}).setView(
    [13.0827, 80.2707],
    12
);


// ==========================================
// CHENNAI BOUNDS
// ==========================================

const chennaiBounds = L.latLngBounds(
    [12.80, 79.95],
    [13.35, 80.45]
);

map.setMaxBounds(chennaiBounds);
map.setMinZoom(10);


// ==========================================
// MAP TILES
// ==========================================

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================================
// MAP DISPLAY FIX
// ==========================================

setTimeout(function () {
    map.invalidateSize();
}, 500);

window.addEventListener(
    "resize",
    function () {
        map.invalidateSize();
    }
);


// ==========================================
// PLACE NAME
// ==========================================

async function getPlaceName(
    latitude,
    longitude
) {

    try {

        const url =
            "https://nominatim.openstreetmap.org/reverse" +
            "?format=jsonv2" +
            "&lat=" + latitude +
            "&lon=" + longitude +
            "&zoom=18" +
            "&addressdetails=1" +
            "&accept-language=en";

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Reverse geocoding failed"
            );
        }

        const data =
            await response.json();

        const address =
            data.address || {};


        // Prefer actual local area

        const area =
            address.suburb ||
            address.neighbourhood ||
            address.city_district ||
            address.quarter ||
            address.village ||
            address.town ||
            address.city;


        const city =
            address.city ||
            address.town ||
            address.municipality;


        if (
            area &&
            city &&
            area.toLowerCase() !==
            city.toLowerCase()
        ) {

            return area + ", " + city;

        }


        if (area) {
            return area;
        }


        if (data.display_name) {

            const parts =
                data.display_name
                    .split(",")
                    .map(function (part) {
                        return part.trim();
                    });

            if (parts.length >= 2) {

                return (
                    parts[0] +
                    ", " +
                    parts[1]
                );

            }

        }


        return "Selected Chennai Location";

    }

    catch (error) {

        console.error(
            "Place lookup failed:",
            error
        );

        return "Selected Chennai Location";
    }
}


// ==========================================
// MAP CLICK
// ==========================================

map.on(
    "click",
    async function (event) {

        selectedLatitude =
            event.latlng.lat;

        selectedLongitude =
            event.latlng.lng;


        // Remove old marker

        if (selectedMarker) {

            map.removeLayer(
                selectedMarker
            );

        }


        // Create marker

        selectedMarker =
            L.marker(
                [
                    selectedLatitude,
                    selectedLongitude
                ],
                {
                    title:
                        "Selected Location"
                }
            ).addTo(map);


        // Temporary location

        selectedPlaceName =
            "Finding place...";

        selectedLocation.textContent =
            "Finding place...";


        selectedCoordinates.textContent =
            "Latitude: " +
            selectedLatitude.toFixed(6) +
            " | Longitude: " +
            selectedLongitude.toFixed(6);


        selectedMarker
            .bindPopup(
                "<div style='min-width:220px'>" +
                "<strong>📍 Selected Location</strong>" +
                "<br><br>" +
                "Finding place..." +
                "</div>"
            )
            .openPopup();


        // Reverse geocode

        selectedPlaceName =
            await getPlaceName(
                selectedLatitude,
                selectedLongitude
            );


        // Update selected location

        selectedLocation.textContent =
            selectedPlaceName;


        // Update popup

        selectedMarker
            .bindPopup(
                "<div style='min-width:230px'>" +
                "<strong>📍 " +
                selectedPlaceName +
                "</strong>" +
                "<br><br>" +
                "<b>Latitude:</b> " +
                selectedLatitude.toFixed(6) +
                "<br>" +
                "<b>Longitude:</b> " +
                selectedLongitude.toFixed(6) +
                "<br><br>" +
                "<span style='color:#15803d;font-weight:bold'>" +
                "✓ Location selected" +
                "</span>" +
                "</div>"
            )
            .openPopup();

    }
);


// ==========================================
// CHECK RISK
// ==========================================

checkRiskBtn.addEventListener(
    "click",
    async function () {

        if (
            selectedLatitude === null ||
            selectedLongitude === null
        ) {

            alert(
                "Please click on the Chennai map to select your location first."
            );

            return;
        }


        const selectedDisaster =
            disasterType.value;


        checkRiskBtn.disabled =
            true;

        checkRiskBtn.textContent =
            "Checking Risk...";


        try {

            const response =
                await fetch(
                    API_URL +
                    "/api/check-risk",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                latitude:
                                    selectedLatitude,

                                longitude:
                                    selectedLongitude,

                                disaster_type:
                                    selectedDisaster
                            })
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Backend returned HTTP " +
                    response.status
                );

            }


            const data =
                await response.json();


            console.log(
                "RESQGRID Risk Response:",
                data
            );


            if (!data.success) {

                throw new Error(
                    data.error ||
                    "Unable to calculate risk."
                );

            }


            // ==================================
            // LOCATION
            // ==================================

            resultLocation.textContent =
                selectedPlaceName;


            // ==================================
            // DISASTER
            // ==================================

            selectedDisasterLabel.textContent =
                selectedDisaster +
                " Risk Score";


            disasterRiskLabel.textContent =
                selectedDisaster +
                " Risk";


            selectedDisasterRisk.textContent =
                Math.round(
                    data.risk_score
                ) +
                "/100";


            // ==================================
            // ICON
            // ==================================

            if (
                selectedDisaster === "Flood"
            ) {

                disasterIcon.textContent =
                    "🌊";

            }

            else if (
                selectedDisaster ===
                "Heavy Rain"
            ) {

                disasterIcon.textContent =
                    "🌧️";

            }

            else {

                disasterIcon.textContent =
                    "🌎";

            }


            // ==================================
            // SCORE
            // ==================================

            riskScore.textContent =
                Math.round(
                    data.risk_score
                );


            riskBadge.textContent =
                data.risk_level;


            // ==================================
            // MESSAGE
            // ==================================

            riskMessage.textContent =
                selectedDisaster +
                " risk assessment completed for " +
                selectedPlaceName +
                ".";


            // ==================================
            // POPULATION
            // ==================================

            populationExposure.textContent =
                data.population_exposure;


            // ==================================
            // ACCESSIBILITY
            // ==================================

            roadAccess.textContent =
                "Based on nearest zone";


            // ==================================
            // RAINFALL
            // ==================================

            if (
                data.risk_factor &&
                data.risk_factor.rainfall
                !== undefined
            ) {

                rainfallValue.textContent =
                    data.risk_factor.rainfall +
                    " mm";

            }

            else {

                rainfallValue.textContent =
                    "Not applicable";

            }


            // ==================================
            // SHELTER
            // ==================================

            if (
                data.nearest_shelter
            ) {

                const shelter =
                    data.nearest_shelter;


                nearestShelter.textContent =
                    shelter.name ||
                    shelter.shelter_name ||
                    shelter.location ||
                    "Nearby shelter available";

            }

            else {

                nearestShelter.textContent =
                    "No shelter information";

            }


            // ==================================
            // RESOURCES
            // ==================================

            if (
                data.recommended_resources
            ) {

                const resources =
                    data.recommended_resources;


                ambulances.textContent =
                    resources.ambulances ??
                    "—";


                rescueTeams.textContent =
                    resources.rescue_teams ??
                    "—";


                reliefKits.textContent =
                    resources.relief_kits ??
                    "—";

            }


            // ==================================
            // RECOMMENDATION
            // ==================================

            recommendation.textContent =
                data.recommendation ||
                "Follow official emergency alerts and move to a designated safe location if required.";


            // ==================================
            // SHOW RESULT
            // ==================================

            document
                .getElementById("riskResult")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }

        catch (error) {

            console.error(
                "Risk check error:",
                error
            );

            alert(
                "Risk calculation failed.\n\n" +
                error.message
            );

        }


        checkRiskBtn.disabled =
            false;

        checkRiskBtn.textContent =
            "Check My Risk";

    }
);