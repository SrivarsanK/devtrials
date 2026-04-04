'use client';

import { useDashboardStore } from '@/store/dashboardStore';
import { useReserveHealth } from '@/hooks/useReserveHealth';
import { getLossRatioStatus } from '@/constants/thresholds';
import { GlobalStatusBanner } from './GlobalStatusBanner';
import { MetricCard } from './MetricCard';
import { CityCard } from './CityCard';
import { cn } from '@/lib/utils';
import {
  Wallet,
  AlertTriangle,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from 'lucide-react';

export function ReserveHealthWidget() {
  const { loading } = useReserveHealth();
  const reserveHealth = useDashboardStore((s) => s.reserveHealth);

  if (loading || !reserveHealth) {
    return (
      <div className="space-y-10">
        <div className="w-full rounded-3xl glass-subtle p-8 animate-pulse border border-white/5">
          <div className="h-10 bg-white/5 rounded-xl w-3/4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-subtle rounded-2xl p-8 animate-pulse border border-white/5 h-32" />
          ))}
        </div>
      </div>
    );
  }

  const lossRatioColor = getLossRatioStatus(reserveHealth.lossRatioPercent) === 'GREEN'
    ? 'green'
    : getLossRatioStatus(reserveHealth.lossRatioPercent) === 'AMBER'
    ? 'amber'
    : 'red';

  const coverageColor = reserveHealth.coverageRatioPercent >= 120 ? 'green' : reserveHealth.coverageRatioPercent >= 90 ? 'amber' : 'red';

  return (
    <div className="space-y-12">
      {/* Global Status Section */}
      <section>
          <GlobalStatusBanner />
      </section>

      {/* High Level Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          label="Total Liquidity Pool"
          value={`₹${reserveHealth.reserveBalanceCrores} Cr`}
          color="green"
          icon={Wallet}
        />
        <MetricCard
          label="Aggregated Liability"
          value={`₹${reserveHealth.activeLiabilityCrores} Cr`}
          color="white"
          icon={AlertTriangle}
        />
        <MetricCard
          label="Liquidity / Liability"
          value={`${reserveHealth.coverageRatioPercent}%`}
          color={coverageColor}
          icon={Shield}
        />
        <MetricCard
          label="Claim Velocity Index"
          value={`${reserveHealth.lossRatioPercent}%`}
          color={lossRatioColor}
          icon={TrendingUp}
        />
        <MetricCard
          label="Weekly Inflow"
          value={`₹${reserveHealth.weeklyPremiumInflowLakhs} L`}
          color="blue"
          icon={ArrowUpRight}
        />
        <MetricCard
          label="Weekly Outflow"
          value={`₹${reserveHealth.weeklyClaimsOutflowLakhs} L`}
          color="white"
          icon={ArrowDownRight}
        />
      </section>

      {/* Regional Segmentation */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="size-8 rounded-lg bg-secondary/10 flex items-center justify-center shadow-lg neon-secondary">
                <Layers className="size-5 text-secondary" />
           </div>
           <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">Regional Nodes</h2>
           <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        
        <div className="space-y-6">
          {reserveHealth.cities.map((city) => (
            <CityCard
              key={city.city}
              cityData={city}
              defaultExpanded={city.city === 'Chennai'}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
