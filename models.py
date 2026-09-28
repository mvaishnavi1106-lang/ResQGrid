from database import get_db


def get_all_zones():
    conn = get_db()

    rows = conn.execute("""
        SELECT * FROM zones
        ORDER BY risk_score DESC
    """).fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_zone(zone_id):
    conn = get_db()

    row = conn.execute(
        "SELECT * FROM zones WHERE id = ?",
        (zone_id,)
    ).fetchone()

    conn.close()

    return dict(row) if row else None


def get_all_resources():
    conn = get_db()

    rows = conn.execute("""
        SELECT
            z.id,
            z.zone_name,
            r.ambulances_available,
            r.ambulances_required,
            r.rescue_teams_available,
            r.rescue_teams_required,
            r.relief_kits_available,
            r.relief_kits_required
        FROM resources r
        JOIN zones z ON z.id = r.zone_id
    """).fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_all_shelters():
    conn = get_db()

    rows = conn.execute("""
        SELECT
            id,
            shelter_name,
            latitude,
            longitude,
            capacity,
            occupied,
            (capacity - occupied) AS available
        FROM shelters
    """).fetchall()

    conn.close()

    return [dict(row) for row in rows]


def get_disaster_data(zone_id):
    conn = get_db()

    row = conn.execute("""
        SELECT * FROM disaster_data
        WHERE zone_id = ?
    """, (zone_id,)).fetchone()

    conn.close()

    return dict(row) if row else None