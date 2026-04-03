-- Migration to create monitored_zones table (Phase 3 Expansion)
CREATE TABLE IF NOT EXISTS monitored_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    accuweather_key TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial data from hardcoded types.ts
INSERT INTO monitored_zones (id, name, city, lat, lon, accuweather_key)
VALUES 
('chennai_tambaram', 'Tambaram', 'Chennai', 12.9249, 80.1000, '2799768'),
('chennai_tnagar', 'T. Nagar', 'Chennai', 13.0418, 80.2341, '206671'),
('mumbai_andheri', 'Andheri', 'Mumbai', 19.1197, 72.8464, '3352413'),
('mumbai_dadar', 'Dadar', 'Mumbai', 19.0178, 72.8478, '3352500'),
('bengaluru_koramangala', 'Koramangala', 'Bengaluru', 12.9352, 77.6245, '3352271'),
('delhi_connaught', 'Connaught Place', 'Delhi', 28.6315, 77.2167, '893664')
ON CONFLICT (id) DO NOTHING;
