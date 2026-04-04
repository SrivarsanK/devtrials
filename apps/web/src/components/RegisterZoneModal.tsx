"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerZone } from "@/lib/api";
import { Loader2, MapPin, Globe, ArrowUpRight } from "lucide-react";

interface RegisterZoneModalProps {
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export default function RegisterZoneModal({ onSuccess, children }: RegisterZoneModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    lat: "",
    lon: "",
    accuWeatherKey: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        city: formData.city,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        accuWeatherKey: formData.accuWeatherKey || undefined,
      };

      if (isNaN(payload.lat) || isNaN(payload.lon)) {
        throw new Error("Invalid latitude or longitude coordinates");
      }

      await registerZone(payload);
      setOpen(false);
      setFormData({ name: "", city: "", lat: "", lon: "", accuWeatherKey: "" });
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children || (
          <div className="h-12 px-8 rounded-xl bg-primary text-white font-bold uppercase flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,70,37,0.3)] group/btn text-sm border-none cursor-pointer">
            Register New Zone
            <ArrowUpRight className="size-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass border-white/10 bg-black/80 backdrop-blur-2xl">
        <DialogHeader>
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Globe className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-display font-black uppercase text-foreground">Register Territory</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Expand GigShield&apos;s parametric coverage to a new metropolitan cluster.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Zone Name</Label>
              <Input
                id="name"
                required
                placeholder="e.g. Bandra West"
                className="h-11 glass border-white/5 bg-white/5 focus-visible:ring-primary/30"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">City</Label>
              <Input
                id="city"
                required
                placeholder="e.g. Mumbai"
                className="h-11 glass border-white/5 bg-white/5 focus-visible:ring-primary/30"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Latitude</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground opacity-40" />
                <Input
                  id="lat"
                  required
                  placeholder="19.0760"
                  className="h-11 pl-9 glass border-white/5 bg-white/5 focus-visible:ring-primary/30"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lon" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Longitude</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground opacity-40" />
                <Input
                  id="lon"
                  required
                  placeholder="72.8777"
                  className="h-11 pl-9 glass border-white/5 bg-white/5 focus-visible:ring-primary/30"
                  value={formData.lon}
                  onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="key" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">AccuWeather Key</Label>
              <span className="text-[9px] font-mono text-muted-foreground opacity-40 italic">Optional</span>
            </div>
            <Input
              id="key"
              placeholder="e.g. 206671"
              className="h-11 glass border-white/5 bg-white/5 focus-visible:ring-primary/30"
              value={formData.accuWeatherKey}
              onChange={(e) => setFormData({ ...formData, accuWeatherKey: e.target.value })}
            />
          </div>

          {error && <p className="text-xs font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase transition-all shadow-[0_0_20px_rgba(255,70,37,0.3)] hover:scale-[1.02] border-none"
          >
            {loading ? <Loader2 className="animate-spin size-5" /> : "Confirm Expansion"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
