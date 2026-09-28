import math


def calculate_allocation(
    risk_score,
    population,
    accessibility
):
    """
    Generates resource requirements based on
    risk, population and accessibility.
    """

    if risk_score >= 75:
        priority = "Critical"

        ambulances = max(
            3,
            math.ceil(population / 7000)
        )

        rescue_teams = max(
            2,
            math.ceil(population / 15000)
        )

        relief_kits = max(
            300,
            math.ceil(population * 0.015)
        )

        shelters = max(
            2,
            math.ceil(population / 10000)
        )

    elif risk_score >= 50:
        priority = "High"

        ambulances = max(
            2,
            math.ceil(population / 10000)
        )

        rescue_teams = max(
            1,
            math.ceil(population / 20000)
        )

        relief_kits = max(
            200,
            math.ceil(population * 0.01)
        )

        shelters = max(
            1,
            math.ceil(population / 15000)
        )

    elif risk_score >= 25:
        priority = "Moderate"

        ambulances = max(
            1,
            math.ceil(population / 20000)
        )

        rescue_teams = 1

        relief_kits = max(
            100,
            math.ceil(population * 0.005)
        )

        shelters = 1

    else:
        priority = "Low"

        ambulances = 1
        rescue_teams = 1
        relief_kits = max(
            50,
            math.ceil(population * 0.002)
        )
        shelters = 1

    if accessibility == "Poor":
        ambulances += 1
        rescue_teams += 1

    reason = (
        f"{priority} risk + "
        f"population exposure of {population:,} + "
        f"{accessibility.lower()} accessibility."
    )

    return {
        "priority": priority,
        "ambulances": ambulances,
        "rescue_teams": rescue_teams,
        "relief_kits": relief_kits,
        "shelters": shelters,
        "reason": reason
    }