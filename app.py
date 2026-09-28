import os
from flask import send_from_directory
import webbrowser
from threading import Timer
from flask import Flask, request, jsonify
from flask_cors import CORS

from database import init_db, get_db
from data_generator import seed_database

from models import (
    get_all_zones,
    get_all_resources,
    get_all_shelters,
    get_zone,
    get_disaster_data
)

from risk_engine import (
    calculate_flood_risk,
    calculate_heavy_rain_risk,
    calculate_earthquake_impact,
    get_risk_level,
    calculate_distance
)

from resource_optimizer import calculate_allocation


app = Flask(__name__)
CORS(app)

init_db()
seed_database()


@app.route("/")
def home():
    return send_from_directory(
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend"),
        "index.html"
    )
@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend"),
        filename
    )

# --------------------------------------------------
# ZONES
# --------------------------------------------------

@app.route("/api/zones", methods=["GET"])
def zones():

    return jsonify({
        "success": True,
        "zones": get_all_zones()
    })


# --------------------------------------------------
# RESOURCES
# --------------------------------------------------

@app.route("/api/resources", methods=["GET"])
def resources():

    return jsonify({
        "success": True,
        "resources": get_all_resources()
    })


# --------------------------------------------------
# SHELTERS
# --------------------------------------------------

@app.route("/api/shelters", methods=["GET"])
def shelters():

    return jsonify({
        "success": True,
        "shelters": get_all_shelters()
    })


# --------------------------------------------------
# RECOMMENDATIONS
# --------------------------------------------------

@app.route("/api/recommendations", methods=["GET"])
def recommendations():

    zones = get_all_zones()

    result = []

    for zone in zones:

        allocation = calculate_allocation(
            zone["risk_score"],
            zone["population"],
            zone["accessibility"]
        )

        result.append({
            "zone": zone["zone_name"],
            "priority": allocation["priority"],
            "recommendation": (
                f"Deploy {allocation['ambulances']} ambulances, "
                f"{allocation['rescue_teams']} rescue teams, "
                f"{allocation['shelters']} shelters and "
                f"{allocation['relief_kits']} relief kits."
            ),
            "reason": allocation["reason"]
        })

    return jsonify({
        "success": True,
        "recommendations": result
    })


# --------------------------------------------------
# CHECK RISK
# --------------------------------------------------

@app.route("/api/check-risk", methods=["POST"])
def check_risk():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": "JSON request body required."
        }), 400

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    disaster_type = data.get("disaster_type")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "error": "latitude and longitude are required."
        }), 400

    if not disaster_type:
        return jsonify({
            "success": False,
            "error": "disaster_type is required."
        }), 400

    allowed_disasters = [
        "Flood",
        "Heavy Rain",
        "Earthquake"
    ]

    if disaster_type not in allowed_disasters:
        return jsonify({
            "success": False,
            "error": "Invalid disaster type."
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "error": "Invalid latitude or longitude."
        }), 400

    zones = get_all_zones()

    if not zones:
        return jsonify({
            "success": False,
            "error": "No zones available."
        }), 404

    # ----------------------------------------------
    # FIND NEAREST ZONE
    # ----------------------------------------------

    nearest_zone = min(
        zones,
        key=lambda zone: calculate_distance(
            latitude,
            longitude,
            zone["latitude"],
            zone["longitude"]
        )
    )

    zone = nearest_zone

    disaster = get_disaster_data(zone["id"])

    if not disaster:
        return jsonify({
            "success": False,
            "error": "Disaster data unavailable."
        }), 404

    distance = calculate_distance(
        latitude,
        longitude,
        zone["latitude"],
        zone["longitude"]
    )

    # ----------------------------------------------
    # CALCULATE ONLY SELECTED DISASTER
    # ----------------------------------------------

    if disaster_type == "Flood":

        risk_score = calculate_flood_risk(
            disaster["rainfall"],
            disaster["water_level"],
            zone["population"],
            zone["accessibility"],
            disaster["previous_flood"]
        )

        risk_factor = {
            "rainfall": disaster["rainfall"],
            "water_level": disaster["water_level"],
            "previous_flood": disaster["previous_flood"]
        }

    elif disaster_type == "Heavy Rain":

        risk_score = calculate_heavy_rain_risk(
            disaster["rainfall"],
            zone["population"],
            zone["accessibility"]
        )

        risk_factor = {
            "rainfall": disaster["rainfall"]
        }

    else:

        risk_score = calculate_earthquake_impact(
            disaster["earthquake_magnitude"],
            max(disaster["earthquake_distance"], 1),
            zone["population"],
            disaster["building_vulnerability"],
            zone["accessibility"]
        )

        risk_factor = {
            "earthquake_magnitude": disaster["earthquake_magnitude"],
            "earthquake_distance": disaster["earthquake_distance"],
            "building_vulnerability": disaster["building_vulnerability"]
        }

    # ----------------------------------------------
    # RISK LEVEL
    # ----------------------------------------------

    risk_level = get_risk_level(risk_score)

    # ----------------------------------------------
    # RESOURCE ALLOCATION
    # ----------------------------------------------

    allocation = calculate_allocation(
        risk_score,
        zone["population"],
        zone["accessibility"]
    )

    # ----------------------------------------------
    # NEAREST SHELTER
    # ----------------------------------------------

    shelters = get_all_shelters()

    nearest_shelter = None

    if shelters:

        nearest_shelter = min(
            shelters,
            key=lambda shelter: calculate_distance(
                latitude,
                longitude,
                shelter["latitude"],
                shelter["longitude"]
            )
        )

    # ----------------------------------------------
    # RECOMMENDATION
    # ----------------------------------------------

    recommendation = (
        f"For {disaster_type}, deploy "
        f"{allocation['ambulances']} ambulances, "
        f"{allocation['rescue_teams']} rescue teams, "
        f"{allocation['shelters']} shelters and "
        f"{allocation['relief_kits']} relief kits."
    )

    # ----------------------------------------------
    # RESPONSE
    # ----------------------------------------------

    response = {
        "success": True,

        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "nearest_zone": zone["zone_name"],
            "distance_from_zone_km": round(distance, 2)
        },

        "disaster_type": disaster_type,

        "risk_score": risk_score,

        "risk_level": risk_level,

        "risk_factor": risk_factor,

        "population_exposure": zone["population"],

        "nearest_shelter": nearest_shelter,

        "recommended_resources": {
            "ambulances": allocation["ambulances"],
            "rescue_teams": allocation["rescue_teams"],
            "shelters": allocation["shelters"],
            "relief_kits": allocation["relief_kits"]
        },

        "recommendation": recommendation,

        "reason": allocation["reason"]
    }

    return jsonify(response)


# --------------------------------------------------
# SIMULATION
# --------------------------------------------------

@app.route("/api/simulate", methods=["POST"])
def simulate():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": "JSON request body required."
        }), 400

    disaster_type = data.get(
        "disaster_type",
        "Flood"
    )

    zone_id = data.get("zone_id")

    if not zone_id:
        return jsonify({
            "success": False,
            "error": "zone_id is required."
        }), 400

    zone = get_zone(zone_id)

    if not zone:
        return jsonify({
            "success": False,
            "error": "Zone not found."
        }), 404

    disaster = get_disaster_data(zone_id)

    if disaster_type == "Flood":

        rainfall = float(
            data.get(
                "rainfall",
                disaster["rainfall"]
            )
        )

        water_level = float(
            data.get(
                "water_level",
                disaster["water_level"]
            )
        )

        score = calculate_flood_risk(
            rainfall,
            water_level,
            zone["population"],
            zone["accessibility"],
            disaster["previous_flood"]
        )

    elif disaster_type == "Heavy Rain":

        rainfall = float(
            data.get(
                "rainfall",
                disaster["rainfall"]
            )
        )

        score = calculate_heavy_rain_risk(
            rainfall,
            zone["population"],
            zone["accessibility"]
        )

    else:

        magnitude = float(
            data.get(
                "magnitude",
                disaster["earthquake_magnitude"]
            )
        )

        distance = float(
            data.get(
                "distance",
                disaster["earthquake_distance"]
            )
        )

        score = calculate_earthquake_impact(
            magnitude,
            distance,
            zone["population"],
            disaster["building_vulnerability"],
            zone["accessibility"]
        )

    level = get_risk_level(score)

    allocation = calculate_allocation(
        score,
        zone["population"],
        zone["accessibility"]
    )

    return jsonify({
        "success": True,

        "simulation": {
            "zone": zone["zone_name"],
            "disaster_type": disaster_type,
            "risk_score": score,
            "risk_level": level,
            "recommended_resources": allocation
        }
    })


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)