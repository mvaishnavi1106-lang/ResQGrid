console.log("RESQGRID Command Center loaded");


// =========================================
// BACKEND URL
// =========================================

const API_URL = "http://127.0.0.1:5000";


// =========================================
// DISASTER FILTER
// =========================================

const disasterFilter =
    document.getElementById("disasterFilter");


// =========================================
// SIMULATION ELEMENTS
// =========================================

const floodSimulation =
    document.getElementById("floodSimulation");

const earthquakeSimulation =
    document.getElementById("earthquakeSimulation");

const heavyRainSimulation =
    document.getElementById("heavyRainSimulation");

const resetSimulation =
    document.getElementById("resetSimulation");

const simulationStatus =
    document.getElementById("simulationStatus");

const simulationResult =
    document.getElementById("simulationResult");


// =========================================
// DASHBOARD VALUES
// =========================================

const activeAlerts =
    document.getElementById("activeAlerts");

const criticalZones =
    document.getElementById("criticalZones");

const ambulanceCount =
    document.getElementById("ambulanceCount");

const zoneCRisk =
    document.getElementById("zoneCRisk");


// =========================================
// RESOURCE VALUES
// =========================================

const ambulancesAvailable =
    document.getElementById("ambulancesAvailable");

const ambulancesRequired =
    document.getElementById("ambulancesRequired");

const rescueAvailable =
    document.getElementById("rescueAvailable");

const rescueRequired =
    document.getElementById("rescueRequired");

const reliefAvailable =
    document.getElementById("reliefAvailable");

const reliefRequired =
    document.getElementById("reliefRequired");

const sheltersAvailable =
    document.getElementById("sheltersAvailable");

const sheltersActivated =
    document.getElementById("sheltersActivated");


// =========================================
// AI RECOMMENDATION
// =========================================

const aiRecommendation =
    document.getElementById("aiRecommendation");


// =========================================
// DEFAULT ZONE
// =========================================

let selectedZoneId = 3;


// =========================================
// DISASTER FILTER
// =========================================

if (disasterFilter) {

    disasterFilter.addEventListener("change", function () {

        console.log(
            "Selected disaster:",
            disasterFilter.value
        );

    });

}


// =========================================
// RUN SIMULATION FUNCTION
// =========================================

async function runSimulation(disasterType) {

    simulationStatus.textContent =
        "Calculating...";

    simulationResult.innerHTML = `
        <div class="simulation-icon">
            ⏳
        </div>

        <div>
            <h3>Calculating Risk</h3>

            <p>
                RESQGRID is analyzing the selected
                disaster scenario and calculating
                emergency resource requirements.
            </p>
        </div>
    `;


    try {

        const response = await fetch(
            API_URL + "/api/simulate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    zone_id: selectedZoneId,

                    disaster_type: disasterType

                })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Simulation failed."
            );

        }


        const simulation =
            data.simulation;

        const resources =
            simulation.recommended_resources;


        // =====================================
        // STATUS
        // =====================================

        simulationStatus.textContent =
            disasterType + " Event Active";


        simulationStatus.style.background =
            "#fef0c7";

        simulationStatus.style.color =
            "#b54708";


        // =====================================
        // RISK ZONE
        // =====================================

         if (zoneCRisk) {
    zoneCRisk.textContent =
        Math.round(simulation.risk_score);
}

        // =====================================
        // RESOURCE COUNTS
        // =====================================

        ambulancesRequired.textContent =
            resources.ambulances +
            " Required";


        rescueRequired.textContent =
            resources.rescue_teams +
            " Required";


        reliefRequired.textContent =
            resources.relief_kits +
            " Required";


        // =====================================
        // RECOMMENDATION
        // =====================================

        aiRecommendation.textContent =
            "For " +
            disasterType +
            ", RESQGRID calculated a risk score of " +
            simulation.risk_score +
            "/100 for " +
            simulation.zone +
            ". The system recommends " +
            resources.ambulances +
            " ambulances, " +
            resources.rescue_teams +
            " rescue teams and " +
            resources.relief_kits +
            " relief kits.";


        // =====================================
        // SIMULATION RESULT
        // =====================================

        let icon = "⚡";

        if (disasterType === "Flood") {

            icon = "🌊";

        }

        else if (disasterType === "Heavy Rain") {

            icon = "🌧️";

        }

        else if (disasterType === "Earthquake") {

            icon = "🌎";

        }


        simulationResult.innerHTML = `

            <div class="simulation-icon">
                ${icon}
            </div>

            <div>

                <h3>
                    ${disasterType} Simulation Complete
                </h3>

                <p>
                    Zone: ${simulation.zone}<br>

                    Risk Score:
                    <strong>
                        ${simulation.risk_score}/100
                    </strong><br>

                    Risk Level:
                    <strong>
                        ${simulation.risk_level}
                    </strong>
                </p>

            </div>

        `;


        console.log(
            "Simulation result:",
            simulation
        );

    }


    catch (error) {

        console.error(
            "Simulation error:",
            error
        );


        simulationStatus.textContent =
            "Simulation Error";


        simulationResult.innerHTML = `

            <div class="simulation-icon">
                ⚠️
            </div>

            <div>

                <h3>
                    Simulation Failed
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// =========================================
// FLOOD SIMULATION
// =========================================

if (floodSimulation) {

    floodSimulation.addEventListener(
        "click",
        function () {

            runSimulation("Flood");

        }
    );

}


// =========================================
// HEAVY RAIN SIMULATION
// =========================================

if (heavyRainSimulation) {

    heavyRainSimulation.addEventListener(
        "click",
        function () {

            runSimulation("Heavy Rain");

        }
    );

}


// =========================================
// EARTHQUAKE SIMULATION
// =========================================

if (earthquakeSimulation) {

    earthquakeSimulation.addEventListener(
        "click",
        function () {

            runSimulation("Earthquake");

        }
    );

}


// =========================================
// RESET
// =========================================

if (resetSimulation) {

    resetSimulation.addEventListener(
        "click",
        function () {

            simulationStatus.textContent =
                "System Ready";


            simulationStatus.style.background =
                "#ecfdf3";


            simulationStatus.style.color =
                "#027a48";


            if (zoneCRisk) {
    zoneCRisk.textContent = "87";
}


            ambulancesRequired.textContent =
                "12 Required";


            rescueRequired.textContent =
                "05 Required";


            reliefRequired.textContent =
                "1200 Required";


            aiRecommendation.textContent =
                "Zone C has been assigned the highest priority because of its high population exposure, critical risk score and poor road accessibility. Deploy additional ambulances and rescue teams to this zone.";


            simulationResult.innerHTML = `

                <div class="simulation-icon">
                    ⚡
                </div>

                <div>

                    <h3>
                        Ready for Simulation
                    </h3>

                    <p>
                        Select a disaster scenario
                        to see how RESQGRID responds.
                    </p>

                </div>

            `;

        }
    );

}


// =========================================
// LOAD DASHBOARD DATA FROM BACKEND
// =========================================

async function loadDashboardData() {

    try {

        // =====================================
        // GET ZONES
        // =====================================

        const zonesResponse = await fetch(
            API_URL + "/api/zones"
        );

        const zonesData =
            await zonesResponse.json();


        if (!zonesData.success) {

            throw new Error(
                "Unable to load zones."
            );

        }


        const zones =
            zonesData.zones;


        // =====================================
        // ACTIVE ALERTS
        // =====================================

        const activeCount =
            zones.filter(
                zone =>
                    zone.risk_level === "High" ||
                    zone.risk_level === "Critical"
            ).length;


        activeAlerts.textContent =
            String(activeCount).padStart(2, "0");


        // =====================================
        // CRITICAL ZONES
        // =====================================

        const criticalCount =
            zones.filter(
                zone =>
                    zone.risk_level === "Critical"
            ).length;


        criticalZones.textContent =
            String(criticalCount).padStart(2, "0");


        // =====================================
        // HIGHEST RISK ZONE
        // =====================================
         if (zones.length > 0 && zoneCRisk) {

    zoneCRisk.textContent =
        Math.round(
            zones[0].risk_score
        );

}


        // =====================================
        // GET RESOURCES
        // =====================================

        const resourcesResponse =
            await fetch(
                API_URL + "/api/resources"
            );


        const resourcesData =
            await resourcesResponse.json();


        if (!resourcesData.success) {

            throw new Error(
                "Unable to load resources."
            );

        }


        const resources =
            resourcesData.resources;


        // =====================================
        // TOTAL AMBULANCES AVAILABLE
        // =====================================

        const totalAmbulances =
            resources.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.ambulances_available || 0
                    ),
                0
            );


        // =====================================
        // TOTAL AMBULANCES REQUIRED
        // =====================================

        const totalAmbulancesRequired =
            resources.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.ambulances_required || 0
                    ),
                0
            );


        // =====================================
        // TOTAL RESCUE AVAILABLE
        // =====================================

        const totalRescueTeams =
            resources.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.rescue_teams_available || 0
                    ),
                0
            );


        // =====================================
        // TOTAL RESCUE REQUIRED
        // =====================================

        const totalRescueRequired =
            resources.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.rescue_teams_required || 0
                    ),
                0
            );


        // =====================================
        // TOTAL RELIEF AVAILABLE
        // =====================================

        const totalReliefKits =
            resources.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.relief_kits_available || 0
                    ),
                0
            );


        // =====================================
        // TOTAL RELIEF REQUIRED
        // =====================================

        const totalReliefRequired =
            resources.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.relief_kits_required || 0
                    ),
                0
            );


        // =====================================
        // UPDATE TOP AMBULANCE COUNT
        // =====================================

        ambulanceCount.textContent =
            totalAmbulances;


        // =====================================
        // UPDATE AVAILABLE RESOURCES
        // =====================================

        if (ambulancesAvailable) {

            ambulancesAvailable.textContent =
                "Available: " +
                totalAmbulances;

        }


        if (rescueAvailable) {

            rescueAvailable.textContent =
                "Available: " +
                totalRescueTeams;

        }


        if (reliefAvailable) {

            reliefAvailable.textContent =
                "Available: " +
                totalReliefKits;

        }


        // =====================================
        // UPDATE REQUIRED RESOURCES
        // =====================================

        ambulancesRequired.textContent =
            totalAmbulancesRequired +
            " Required";


        rescueRequired.textContent =
            totalRescueRequired +
            " Required";


        reliefRequired.textContent =
            totalReliefRequired +
            " Required";


        // =====================================
        // GET SHELTERS
        // =====================================

        const sheltersResponse =
            await fetch(
                API_URL + "/api/shelters"
            );


        const sheltersData =
            await sheltersResponse.json();


        if (!sheltersData.success) {

            throw new Error(
                "Unable to load shelters."
            );

        }


        const shelters =
            sheltersData.shelters;


        // =====================================
        // SHELTER COUNTS
        // =====================================

        const totalShelters =
            shelters.length;


        const totalCapacity =
            shelters.reduce(
                (total, shelter) =>
                    total +
                    Number(
                        shelter.capacity || 0
                    ),
                0
            );


        const totalOccupied =
            shelters.reduce(
                (total, shelter) =>
                    total +
                    Number(
                        shelter.occupied || 0
                    ),
                0
            );


        // =====================================
        // AVAILABLE SHELTER SPACES
        // =====================================

        const availableShelterSpaces =
            totalCapacity -
            totalOccupied;


        // =====================================
        // SHELTER CAPACITY PERCENTAGE
        // =====================================

        const shelterPercentage =
            totalCapacity > 0
                ? Math.round(
                    (
                        totalOccupied /
                        totalCapacity
                    ) * 100
                )
                : 0;


        // =====================================
        // UPDATE SHELTER CARD
        // =====================================

        if (sheltersAvailable) {

            sheltersAvailable.textContent =
                "Available: " +
                totalShelters;

        }


        if (sheltersActivated) {

            sheltersActivated.textContent =
                availableShelterSpaces +
                " Spaces Available";

        }


        // =====================================
        // UPDATE TOP SHELTER CAPACITY
        // =====================================

        const shelterCapacity =
            document.querySelector(
                ".stat-card:nth-child(4) h2"
            );


        if (shelterCapacity) {

            shelterCapacity.textContent =
                shelterPercentage + "%";

        }


        console.log(
            "Dashboard data loaded successfully:",
            zones,
            resources,
            shelters
        );

    }


    catch (error) {

        console.error(
            "Dashboard data error:",
            error
        );

    }

}


// =========================================
// LOAD PRIORITY ZONES
// =========================================

async function loadPriorityZones() {

    try {

        const response =
            await fetch(
                API_URL + "/api/zones"
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                "Unable to load zones."
            );

        }


        const zones =
            data.zones;


        const riskList =
            document.getElementById(
                "riskList"
            );


        if (!riskList) {

            return;

        }


        riskList.innerHTML = "";


        zones.forEach(
            function(zone) {

                let riskClass = "low";


                if (
                    zone.risk_level ===
                    "Critical"
                ) {

                    riskClass =
                        "critical";

                }

                else if (
                    zone.risk_level ===
                    "High"
                ) {

                    riskClass =
                        "high";

                }

                else if (
                    zone.risk_level ===
                    "Moderate"
                ) {

                    riskClass =
                        "moderate";

                }


                const riskItem =
                    document.createElement(
                        "div"
                    );


                riskItem.className =
                    "risk-item";


                riskItem.innerHTML = `

                    <div>

                        <strong>
                            ${zone.zone_name}
                        </strong>

                        <p>
                            ${zone.disaster_type}
                        </p>

                    </div>

                    <div
                        class="risk-score ${riskClass}">
                        ${Math.round(
                            zone.risk_score
                        )}
                    </div>

                `;


                riskList.appendChild(
                    riskItem
                );

            }
        );


        console.log(
            "Priority zones loaded:",
            zones
        );

    }


    catch (error) {

        console.error(
            "Priority zone error:",
            error
        );

    }

}


// =========================================
// START DASHBOARD
// =========================================

loadDashboardData();

loadPriorityZones();