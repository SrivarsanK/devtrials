import React, { useEffect, useState } from 'react';
import { fetchReserveForecast, ReserveForecast } from '@/lib/api';
import { Activity, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MLForecastCardProps {
  zoneId?: string;
  className?: string;
}

export default function MLForecastCard({ zoneId = 'ZONE_CHN_001', className }: MLForecastCardProps) {
  const [forecast, setForecast] = useState<ReserveForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    const result = await fetchReserveForecast(zoneId);
    setForecast(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId]);

  if (loading) {
     return (
        <div className={cn("p-6 rounded-2xl glass card-glow relative overflow-hidden flex items-center justify-center min-h-[220px]", className)}>
            <RefreshCw className="animate-spin text-primary size-8 opacity-50" />
        </div>
     );
  }

  if (!forecast) {
     return (
        <div className={cn("p-6 rounded-2xl glass card-glow relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] text-muted-foreground", className)}>
            <AlertTriangle className="size-8 opacity-50 mb-2 text-warning" />
            <p className="text-xs uppercase tracking-widest font-bold">Actuarial Link Down</p>
            <p className="text-[10px] mt-1 opacity-60">Reserve Engine Unreachable</p>
        </div>
     );
  }

  const isRed = forecast.reserve_status === 'RED';
  const isAmber = forecast.reserve_status === 'AMBER';
  const isGreen = forecast.reserve_status === 'GREEN';

  const statusColorClass = isRed ? "text-destructive" : isAmber ? "text-warning" : "text-success";
  const bgGlowClass = isRed ? "bg-destructive/10" : isAmber ? "bg-warning/10" : "bg-success/10";

  return (
    <div className={cn("p-6 rounded-2xl glass card-glow relative overflow-hidden group", className)}>
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000", bgGlowClass)} />
      
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Activity className={cn("size-24", statusColorClass)} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">LSTM Reserve Engine</p>
              <h4 className="text-2xl font-display font-black tracking-tight">{forecast.area}</h4>
            </div>
            <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-current", statusColorClass)}>
               {forecast.reserve_status} ALERT
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Expected 7D Claims</p>
                <p className="text-3xl font-display font-black">{forecast.predicted_claims_next_7_days}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Actuarial Liability</p>
                <p className="text-2xl font-display font-bold mt-1 text-primary">₹{(forecast.predicted_payout_next_7_days).toLocaleString()}</p>
            </div>
        </div>

        <div className="mt-2 text-[10px] font-bold text-muted-foreground">
            Risk Tier: <span className={cn("uppercase tracking-wider", statusColorClass)}>{forecast.risk_level}</span>
        </div>
      </div>
    </div>
  );
}
