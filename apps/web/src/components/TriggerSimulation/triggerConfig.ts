import { CloudRain, Wind, Waves, Barrier, ThermometerSun } from "lucide-react";

export interface TriggerConfig {
  id: string;
  name: string;
  icon: any;
  threshold: string;
  payout: number;
  color: string;
}

export const TRIGGER_CONFIGS: TriggerConfig[] = [
  {
    id: 'RAIN',
    name: 'Heavy Rainfall',
    icon: CloudRain,
    threshold: '>50mm / 3hr',
    payout: 800,
    color: 'blue'
  },
  {
    id: 'AQI',
    name: 'Air Quality Crisis',
    icon: Wind,
    threshold: 'AQI > 300',
    payout: 600,
    color: 'emerald'
  },
  {
    id: 'FLOOD',
    name: 'Flood Zone Alert',
    icon: Waves,
    threshold: 'IMD Priority Alert',
    payout: 800,
    color: 'cyan'
  },
  {
    id: 'CIVIL',
    name: 'Civil Disruption',
    icon: Barrier,
    threshold: 'Section 144 / Bandh',
    payout: 700,
    color: 'orange'
  },
  {
    id: 'HEAT',
    name: 'Extreme Heat',
    icon: ThermometerSun,
    threshold: 'Feels-like > 45°C',
    payout: 500,
    color: 'red'
  }
];

export const ZONES = [
  { id: 'tambaram', name: 'Chennai - Tambaram' },
  { id: 'tnagar', name: 'Chennai - T. Nagar' },
  { id: 'velachery', name: 'Chennai - Velachery' },
  { id: 'andheri', name: 'Mumbai - Andheri' },
  { id: 'dadar', name: 'Mumbai - Dadar' },
  { id: 'dwarka', name: 'Delhi - Dwarka' },
  { id: 'rohini', name: 'Delhi - Rohini' },
];
