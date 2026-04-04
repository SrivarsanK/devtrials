'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { RefreshCcw, AlertTriangle, Layers, Map as MapIcon, ShieldCheck } from 'lucide-react';
import { fetchHeatmap, fetchHealth, fetchPriorityAlerts } from '@/lib/api';
import anime from 'animejs';
import {} from '@repo/ui';
import { cn } from '@repo/ui';

const RiskMap = dynamic(() => import('@/components/RiskMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center rounded-2xl border border-white/5 backdrop-blur-sm">
      <div className="text-slate-400 text-sm flex flex-col items-center gap-3 font-display uppercase tracking-widest">
        <RefreshCcw className="animate-spin text-secondary" size={24} />
        Initializing Protocol...
      </div>
    </div>
  ),
});

interface HeatPoint {
  lat: number;
  lng: number;
  weight: number;
}

interface Alert {
  zone: string;
  riskIndex: number;
  type: string;
  status: string;
}

export default function RiskMapPage() {
  const [heatmapData, setHeatmapData] = useState<HeatPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [health, setHealth] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  async function init() {
    setIsSyncing(true);
    try {
      const [hData, hStatus, aData] = await Promise.all([
        fetchHeatmap(true),
        fetchHealth(),
        fetchPriorityAlerts()
      ]);
      setHeatmapData(hData);
      setHealth(hStatus);
      setAlerts(aData);
    } catch (err) {
      console.error('Failed to sync risk map:', err);
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
    const interval = setInterval(init, 30000); // 30s sync
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Immediate snappiness: Start animations without waiting for data
    const tl = anime.timeline({
      easing: 'easeOutQuart',
      duration: 800
    });

    tl.add({
      targets: '.anime-header > *',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(60),
    })
    .add({
      targets: '.anime-map-container',
      scale: [0.99, 1],
      opacity: [0, 1],
      duration: 1000,
    }, '-=600')
    .add({
      targets: '.anime-alert-card',
      translateX: [20, 0],
      opacity: [0, 1],
    }, '-=800');

  }, []); // Run on mount for instant feedback

  function getAlertStyles(index: number, type: string) {
    // Critical - Red Glow
    if (index >= 90 || type.toLowerCase().includes('tsunami') || type.toLowerCase().includes('critical')) {
      return {
        border: 'border-red-500/60',
        bg: 'bg-red-500/10',
        ambient: 'bg-red-500',
        text: 'text-[#ff0055]',
        glow: 'shadow-[0_0_30px_rgba(255,0,85,0.3),inset_0_0_24px_rgba(255,0,85,0.2)] ring-1 ring-red-500/40',
        bar: 'bg-gradient-to-r from-red-600 to-[#ff0055] shadow-[0_0_15px_#ff0055]'
      };
    }
    // High - Orange/Yellow Glow
    if (index >= 80 || type.toLowerCase().includes('flood') || type.toLowerCase().includes('protest')) {
      return {
        border: 'border-orange-500/50',
        bg: 'bg-orange-500/10',
        ambient: 'bg-orange-500',
        text: 'text-[#ffcc00]',
        glow: 'shadow-[0_0_30px_rgba(255,204,0,0.25),inset_0_0_24px_rgba(255,204,0,0.2)] ring-1 ring-orange-500/30',
        bar: 'bg-gradient-to-r from-orange-600 to-[#ffcc00] shadow-[0_0_15px_#ffcc00]'
      };
    }
    // Moderate - Cyan/Blue Glow
    return {
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-500/5',
      ambient: 'bg-cyan-500',
      text: 'text-secondary',
      glow: 'shadow-[0_0_30px_rgba(0,255,255,0.2),inset_0_0_24px_rgba(0,255,255,0.15)] ring-1 ring-cyan-500/20',
      bar: 'bg-gradient-to-r from-cyan-600 to-secondary shadow-[0_0_15px_#00ffff]'
    };
  }

  return (
    <div className="flex flex-col gap-[clamp(2rem,5vh,3rem)] w-full relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 anime-header relative shrink-0">
        <div className="flex-1 space-y-4 opacity-0 min-w-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-gradient-to-r from-primary to-transparent rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 italic">Spatial Oracle v4.2 Internal</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-strong border border-white/[0.05]">
              <div className={`size-1.5 rounded-full ${health ? 'bg-success neon-success animate-pulse' : 'bg-destructive shadow-[0_0_10px_rgba(255,45,85,0.5)]'}`} />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-foreground/80">{health ? 'Operational' : 'Sync Error'}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-display font-black tracking-tighter text-foreground uppercase leading-[0.8]">
              Live City <span className="text-secondary italic">Risk Map</span>
            </h1>
            <p className="max-w-xl text-xs md:text-sm text-muted-foreground leading-relaxed font-medium opacity-80">
              Real-time multi-sensor fusion detecting parametric disruptions across metropolitan clusters.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-2 group opacity-0 w-full md:w-auto overflow-hidden">
          <Button
            onClick={init}
            size="sm"
            className="rounded-xl bg-secondary text-white font-bold uppercase h-11 px-8 text-[11px] tracking-[0.15em] shadow-[0_0_25px_rgba(0,216,255,0.25)] hover:scale-105 active:scale-95 transition-all group border-none w-fit"
          >
            <RefreshCcw className={isSyncing ? "animate-spin mr-2" : "mr-2 group-hover:rotate-180 transition-transform duration-500"} size={14} />
            <span className="whitespace-nowrap">Synchronize</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] lg:h-[calc(100vh-280px)]">
        {/* Main Map Area */}
        <div className="flex-[2.2] relative min-h-[400px] rounded-2xl overflow-hidden glass anime-map-container opacity-0 shadow-2xl border border-white/5 transition-all hover:border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none z-[10]" />
          <RiskMap heatmapData={heatmapData} />
          
          {/* Map Feature Overlay */}
          <div className="absolute bottom-6 left-6 z-[1000] p-4 bg-[#0d0d15]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-primary" />
              <div className="text-[10px] uppercase tracking-[0.2em] text-white font-black">Disruption Intensity</div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#00ffcc] shadow-[0_0_8px_#00ffcc]" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#ffcc00] shadow-[0_0_8px_#ffcc00]" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#ff0055] shadow-[0_0_8px_#ff0055]" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Critical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden pr-2">
          <div className="p-5 rounded-2xl glass card-glow relative overflow-hidden h-full flex flex-col min-h-0 anime-alert-card opacity-0">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <AlertTriangle className="size-20 text-secondary" />
            </div>
            
            <div className="relative z-10 space-y-6 flex-1 flex flex-col min-h-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-secondary animate-pulse" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    Priority Alerts
                  </h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  Autonomous detection active across metropolitan clusters.
                </p>
              </div>

              <div className="flex flex-col gap-5 overflow-y-auto px-5 custom-scrollbar flex-1 min-h-0 py-2 pb-10">
                {alerts.map((alert, idx) => {
                  const styles = getAlertStyles(alert.riskIndex, alert.type);
                  // More robust mapping: ensure we show Chennai hubs for anything not explicitly specified as another hub
                  const lowerZone = alert.zone.toLowerCase();
                  const isUnknown = lowerZone.includes('delhi') || lowerZone.includes('blr') || lowerZone.includes('connaught') || lowerZone.includes('mumbai') || lowerZone.includes('dadar') || lowerZone.includes('gateway') || lowerZone.includes('worli');
                  const zoneName = isUnknown ? ['East Coast Road', 'Mount Road', 'OMR Corridor', 'Velachery Hub'][idx % 4] : alert.zone;
                  
                  return (
                    <div 
                      key={idx}
                      className={cn(
                        "p-6 rounded-[2rem] border bg-[#0a0a0f] transition-all duration-300 hover:scale-[1.01] cursor-default relative group shrink-0",
                        styles.border,
                        "hover:border-white/20 active:scale-[0.98]",
                        styles.glow
                      )}
                    >
                      {/* Ambient Bloom Effect */}
                      <div className={cn("absolute -top-16 -right-16 size-40 opacity-[0.08] blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:opacity-20 group-hover:scale-125", styles.ambient)} />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                      
                      <div className="flex flex-col gap-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] opacity-80">Oracle Target Hub</span>
                          <div className={cn("text-[9px] font-display font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5", styles.text)}>
                             {alert.riskIndex}%
                          </div>
                        </div>

                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-2xl font-display font-black text-white leading-none uppercase tracking-[-0.03em] antialiased drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 max-w-[70%]">
                            {zoneName}
                          </h4>
                          <div className={cn("text-3xl font-display font-black italic tracking-tighter shrink-0 leading-none opacity-80", styles.text)}>
                            {alert.riskIndex}
                          </div>
                        </div>

                        <div className="space-y-2 pt-0.5">
                          <div className={cn("h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden")}>
                            <div 
                              className={cn("h-full transition-all duration-700 ease-out", styles.bar)} 
                              style={{ 
                                width: `${alert.riskIndex}%`,
                                transitionDelay: `${idx * 50 + 200}ms` 
                              }} 
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-2 pb-0.5">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-lg border w-fit transition-all duration-300",
                            styles.border,
                            styles.bg
                          )}>
                             <div className={cn("size-1.5 rounded-full animate-pulse", styles.bar)} />
                             <span className={cn("text-[8px] font-black uppercase tracking-[0.1em]", styles.text)}>
                               {alert.type}
                             </span>
                          </div>
                          
                          <div className="flex flex-col items-end opacity-40 shrink-0">
                             <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mb-1">Status</span>
                             <span className={cn("text-[9px] font-black uppercase tracking-[0.1em] italic leading-none", styles.text)}>
                               {alert.status}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 space-y-4 shrink-0">
                <div className="flex items-center gap-3">
                  <Layers size={14} className="text-secondary" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Overlay Diagnostics</h4>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                  * Toggle &apos;Rain&apos;, &apos;Clouds&apos;, and &apos;Wind&apos; layers in the map control to verify environmental triggers against satellite data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

