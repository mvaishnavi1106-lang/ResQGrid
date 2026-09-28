import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "database"
DB_DIR.mkdir(exist_ok=True)

DB_PATH = DB_DIR / "resqgrid.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        population INTEGER DEFAULT 0,
        risk_score REAL DEFAULT 0,
        risk_level TEXT DEFAULT 'Low',
        disaster_type TEXT DEFAULT 'Flood',
        accessibility TEXT DEFAULT 'Good'
    );

    CREATE TABLE IF NOT EXISTS disaster_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER,
        rainfall REAL DEFAULT 0,
        water_level REAL DEFAULT 0,
        earthquake_magnitude REAL DEFAULT 0,
        earthquake_distance REAL DEFAULT 0,
        building_vulnerability REAL DEFAULT 0,
        previous_flood INTEGER DEFAULT 0,
        FOREIGN KEY(zone_id) REFERENCES zones(id)
    );

    CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER,
        ambulances_available INTEGER DEFAULT 0,
        ambulances_required INTEGER DEFAULT 0,
        rescue_teams_available INTEGER DEFAULT 0,
        rescue_teams_required INTEGER DEFAULT 0,
        relief_kits_available INTEGER DEFAULT 0,
        relief_kits_required INTEGER DEFAULT 0,
        FOREIGN KEY(zone_id) REFERENCES zones(id)
    );

    CREATE TABLE IF NOT EXISTS shelters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shelter_name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        capacity INTEGER DEFAULT 0,
        occupied INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS allocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER,
        ambulances INTEGER DEFAULT 0,
        rescue_teams INTEGER DEFAULT 0,
        shelters INTEGER DEFAULT 0,
        relief_kits INTEGER DEFAULT 0,
        reason TEXT,
        FOREIGN KEY(zone_id) REFERENCES zones(id)
    );
    """)

    conn.commit()
    conn.close()