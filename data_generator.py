from database import get_db


def seed_database():
    conn = get_db()
    cursor = conn.cursor()

    existing = cursor.execute(
        "SELECT COUNT(*) FROM zones"
    ).fetchone()[0]

    if existing > 0:
        conn.close()
        return

    zones = [
        (
            "Zone A",
            13.0827,
            80.2707,
            35000,
            72,
            "High",
            "Flood",
            "Moderate"
        ),
        (
            "Zone B",
            13.0475,
            80.2090,
            18000,
            42,
            "Moderate",
            "Earthquake",
            "Good"
        ),
        (
            "Zone C",
            12.9716,
            80.2200,
            45000,
            87,
            "Critical",
            "Flood",
            "Poor"
        ),
        (
            "Zone D",
            13.1155,
            80.2865,
            12000,
            18,
            "Low",
            "Flood",
            "Good"
        )
    ]

    cursor.executemany("""
        INSERT INTO zones (
            zone_name,
            latitude,
            longitude,
            population,
            risk_score,
            risk_level,
            disaster_type,
            accessibility
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, zones)

    disaster_data = [
        (1, 220, 3.8, 0, 0, 0, 1),
        (2, 0, 0, 5.6, 15, 65, 0),
        (3, 280, 4.5, 0, 0, 0, 1),
        (4, 70, 1.2, 0, 0, 0, 0)
    ]

    cursor.executemany("""
        INSERT INTO disaster_data (
            zone_id,
            rainfall,
            water_level,
            earthquake_magnitude,
            earthquake_distance,
            building_vulnerability,
            previous_flood
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, disaster_data)

    resources = [
        (1, 5, 6, 3, 3, 500, 525),
        (2, 4, 3, 2, 1, 300, 180),
        (3, 2, 7, 1, 3, 200, 600),
        (4, 5, 1, 2, 1, 500, 60)
    ]

    cursor.executemany("""
        INSERT INTO resources (
            zone_id,
            ambulances_available,
            ambulances_required,
            rescue_teams_available,
            rescue_teams_required,
            relief_kits_available,
            relief_kits_required
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, resources)

    shelters = [
        (
            "Chennai Relief Shelter",
            13.0827,
            80.2707,
            1000,
            680
        ),
        (
            "Community Emergency Shelter",
            13.0475,
            80.2090,
            700,
            400
        ),
        (
            "Zone C Safe Shelter",
            12.9716,
            80.2200,
            1200,
            850
        ),
        (
            "North Chennai Shelter",
            13.1155,
            80.2865,
            500,
            150
        )
    ]

    cursor.executemany("""
        INSERT INTO shelters (
            shelter_name,
            latitude,
            longitude,
            capacity,
            occupied
        )
        VALUES (?, ?, ?, ?, ?)
    """, shelters)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    from database import init_db

    init_db()
    seed_database()

    print("RESQGRID database seeded successfully.")