import math


# ==========================================
# FLOOD RISK
# ==========================================

def calculate_flood_risk(
    rainfall,
    water_level,
    population,
    accessibility,
    previous_flood
):
    rainfall_score = min(rainfall / 300 * 100, 100)

    water_score = min(water_level / 5 * 100, 100)

    population_score = min(
        population / 50000 * 100,
        100
    )

    accessibility_score = {
        "Good": 10,
        "Moderate": 40,
        "Poor": 80
    }.get(accessibility, 40)

    previous_score = 80 if previous_flood else 0

    score = (
        rainfall_score * 0.30 +
        water_score * 0.30 +
        population_score * 0.15 +
        accessibility_score * 0.15 +
        previous_score * 0.10
    )

    return round(min(score, 100), 2)


# ==========================================
# HEAVY RAIN RISK
# ==========================================

def calculate_heavy_rain_risk(
    rainfall,
    population,
    accessibility
):
    """
    Calculates risk caused by heavy rainfall.

    Rainfall is the main factor.
    Population and accessibility represent
    the possible impact on the selected area.
    """

    rainfall_score = min(
        rainfall / 300 * 100,
        100
    )

    population_score = min(
        population / 50000 * 100,
        100
    )

    accessibility_score = {
        "Good": 10,
        "Moderate": 40,
        "Poor": 80
    }.get(accessibility, 40)

    score = (
        rainfall_score * 0.60 +
        population_score * 0.20 +
        accessibility_score * 0.20
    )

    return round(min(score, 100), 2)


# ==========================================
# EARTHQUAKE IMPACT
# ==========================================

def calculate_earthquake_impact(
    magnitude,
    distance,
    population,
    building_vulnerability,
    accessibility
):
    magnitude_score = min(
        magnitude / 9 * 100,
        100
    )

    distance_score = max(
        0,
        100 - (distance / 100 * 100)
    )

    population_score = min(
        population / 50000 * 100,
        100
    )

    accessibility_score = {
        "Good": 10,
        "Moderate": 40,
        "Poor": 80
    }.get(accessibility, 40)

    score = (
        magnitude_score * 0.35 +
        distance_score * 0.25 +
        population_score * 0.15 +
        building_vulnerability * 0.15 +
        accessibility_score * 0.10
    )

    return round(min(score, 100), 2)


# ==========================================
# RISK LEVEL
# ==========================================

def get_risk_level(score):

    if score < 25:
        return "Low"

    elif score < 50:
        return "Moderate"

    elif score < 75:
        return "High"

    else:
        return "Critical"


# ==========================================
# DISTANCE CALCULATION
# ==========================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Haversine distance in kilometers.
    """

    earth_radius = 6371

    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    dlat = lat2 - lat1

    dlon = math.radians(
        lon2 - lon1
    )

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        *
        math.cos(lat2)
        *
        math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return earth_radius * c