import { db } from '../lib/db';
import { randomUUID } from 'crypto';

async function run() {
  // Clear existing pending/test requests to keep it clean (optional, but good for verification)
  await db.query("DELETE FROM fraud_requests WHERE status = 'PENDING'");

  const mocks = [
    { 
      id: randomUUID(), 
      worker_id: 1001, 
      zone_name: 'Velachery', 
      amount: 1500, 
      features: { 
        latency_ms: 45.5,
        vpn_detected: false,
        cell_mismatch_count: 0,
        mock_location_enabled: false,
        satellite_count: 18
      } 
    },
    { 
      id: randomUUID(), 
      worker_id: 1002, 
      zone_name: 'Guindy', 
      amount: 2200, 
      features: { 
        latency_ms: 120.0,
        vpn_detected: true,
        cell_mismatch_count: 4, // Trigger: impossible_location
        mock_location_enabled: false,
        satellite_count: 12
      } 
    },
    { 
      id: randomUUID(), 
      worker_id: 1003, 
      zone_name: 'Adyar', 
      amount: 3500, 
      features: { 
        latency_ms: 30.0,
        vpn_detected: false,
        cell_mismatch_count: 0,
        mock_location_enabled: true,
        satellite_count: 2, // Trigger: gps_spoof
        is_emulator: true
      } 
    },
    { 
      id: randomUUID(), 
      worker_id: 1004, 
      zone_name: 'Kolathur', 
      amount: 800, 
      features: { 
        latency_ms: 250.0,
        vpn_detected: true,
        cell_mismatch_count: 3, // Trigger: vpn_spoof
        mock_location_enabled: false,
        satellite_count: 9
      } 
    },
    { 
      id: randomUUID(), 
      worker_id: 1005, 
      zone_name: 'Mylapore', 
      amount: 4200, 
      features: { 
        latency_ms: 35.0,
        vpn_detected: false,
        cell_mismatch_count: 1,
        mock_location_enabled: false,
        satellite_count: 15,
        account_age_days: 5 // New account
      } 
    }
  ];

  for (const m of mocks) {
    await db.query(
      'INSERT INTO fraud_requests (id, worker_id, zone_name, request_type, amount, status, raw_features) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [m.id, m.worker_id, m.zone_name, 'CLAIM', m.amount, 'PENDING', JSON.stringify(m.features)]
    );
    console.log(`Successfully created mock request for worker #${m.worker_id} in ${m.zone_name}`);
  }
}

run().then(() => {
    console.log("Mock data insertion complete.");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
