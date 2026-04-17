"use client";

import { useState } from "react";
import { TriggerConfig, ZONES } from "./triggerConfig";
import { useTriggerSimulationStore } from "@/hooks/use-trigger-simulation-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Flame, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fireSimulationTrigger } from "@/lib/api";

interface TriggerCardProps {

  config: TriggerConfig;
}

export function TriggerCard({ config }: TriggerCardProps) {
  const { cardStatus, setCardStatus } = useTriggerSimulationStore();
  const [zone, setZone] = useState(ZONES[0].id);
  const [intensity, setIntensity] = useState([50]); // Default medium

  const status = cardStatus[config.id] || 'idle';

  const handleFire = async () => {
    setCardStatus(config.id, 'firing');
    try {
      const intensityLabel = intensity[0] <= 33 ? 'low' : intensity[0] <= 66 ? 'medium' : 'high';
      await fireSimulationTrigger({
        triggerId: config.id,
        zone,
        intensity: intensityLabel,
        adminId: 'admin-001' // Mock admin ID
      });
      setCardStatus(config.id, 'fired');

      setTimeout(() => setCardStatus(config.id, 'idle'), 5000);
    } catch (err) {
      console.error(err);
      setCardStatus(config.id, 'error');
      setTimeout(() => setCardStatus(config.id, 'idle'), 5000);
    }
  };

  const getIntensityLabel = () => {
    if (intensity[0] <= 33) return 'Low (50)';
    if (intensity[0] <= 66) return 'Medium (200)';
    return 'High (500)';
  };

  return (
    <Card className={cn(
      "glass border-white/[0.05] hover:border-white/[0.1] transition-all group relative overflow-hidden",
      status === 'firing' && "ring-2 ring-primary animate-pulse"
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-3 rounded-2xl bg-white/[0.03]",
            config.color === 'blue' && "text-blue-400",
            config.color === 'emerald' && "text-emerald-400",
            config.color === 'cyan' && "text-cyan-400",
            config.color === 'orange' && "text-orange-400",
            config.color === 'red' && "text-red-400",
          )}>
            <config.icon className="size-6" />
          </div>
          <Badge variant="outline" className="bg-white/[0.03] border-white/10 text-[10px] uppercase font-black tracking-widest text-primary">
            ₹{config.payout} / User
          </Badge>
        </div>

        <h3 className="text-lg font-display font-black text-white mb-1">{config.name}</h3>
        <p className="text-xs text-white/40 mb-6 font-medium">{config.threshold}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Target Zone</label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="h-9 glass border-none text-xs font-bold text-white/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {ZONES.map(z => (
                  <SelectItem key={z.id} value={z.id} className="text-xs font-medium text-white/70 focus:bg-primary/20 focus:text-white">
                    {z.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/20">Intensity</label>
              <span className="text-[10px] font-black text-primary uppercase italic">{getIntensityLabel()}</span>
            </div>
            <Slider 
              value={intensity} 
              onValueChange={setIntensity} 
              max={100} 
              step={1} 
              className="py-2"
            />
          </div>

          <Button 
            onClick={handleFire}
            disabled={status !== 'idle'}
            className={cn(
              "w-full h-11 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
              status === 'fired' ? "bg-emerald-500 hover:bg-emerald-600" :
              status === 'error' ? "bg-red-500 hover:bg-red-600" :
              "bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(255,70,37,0.3)]"
            )}
          >
            {status === 'firing' ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : status === 'fired' ? (
              <CheckCircle2 className="size-4 mr-2" />
            ) : status === 'error' ? (
              <AlertCircle className="size-4 mr-2" />
            ) : (
              <Flame className="size-4 mr-2" />
            )}
            {status === 'idle' && "Fire Trigger"}
            {status === 'firing' && "Deploying..."}
            {status === 'fired' && "Fired ✓"}
            {status === 'error' && "Failed ✗"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
