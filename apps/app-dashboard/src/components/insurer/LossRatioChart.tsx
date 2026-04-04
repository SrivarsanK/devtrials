'use client';

import { useMemo, useState, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { useLossRatio } from '@/hooks/useLossRatio';
import { LOSS_RATIO_GREEN, LOSS_RATIO_AMBER } from '@/constants/thresholds';
import { LossRatioDataPoint } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, Calendar, Info } from 'lucide-react';

const MARGIN = { top: 40, right: 60, bottom: 40, left: 60 };
const WIDTH = 800;
const HEIGHT = 400;
const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

export function LossRatioChart() {
  const { data, loading } = useLossRatio();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const xScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
        .range([0, innerWidth]),
    [data]
  );

  const yScale = useMemo(
    () => d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]),
    []
  );

  const areaGenerator = useMemo(
    () =>
      d3
        .area<LossRatioDataPoint>()
        .x((d) => xScale(new Date(d.date)))
        .y0(innerHeight)
        .y1((d) => yScale(d.lossRatioPercent))
        .curve(d3.curveMonotoneX),
    [xScale, yScale]
  );

  const lineGenerator = useMemo(
    () =>
      d3
        .line<LossRatioDataPoint>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.lossRatioPercent))
        .curve(d3.curveMonotoneX),
    [xScale, yScale]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || data.length === 0) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - svgRect.left) * (WIDTH / svgRect.width) - MARGIN.left;
      const clampedMouseX = Math.max(0, Math.min(mouseX, innerWidth));
      
      const bisector = d3.bisector((d: LossRatioDataPoint) => new Date(d.date)).left;
      const date = xScale.invert(clampedMouseX);
      const index = bisector(data, date, 1);
      
      const d0 = data[index - 1];
      const d1 = data[index];
      
      let nearest = 0;
      if (d0 && d1) {
        nearest =
          date.getTime() - new Date(d0.date).getTime() <
          new Date(d1.date).getTime() - date.getTime()
            ? index - 1
            : index;
      } else if (d0) {
        nearest = index - 1;
      } else {
        nearest = index;
      }
      
      setHoveredIndex(Math.max(0, Math.min(data.length - 1, nearest)));
    },
    [data, xScale]
  );

  if (loading) {
    return (
      <div className="glass card-glow rounded-3xl p-8 animate-pulse h-[450px] w-full border border-white/5">
        <div className="h-8 w-48 bg-white/5 rounded-xl mb-6" />
        <div className="h-[300px] w-full bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (data.length === 0) return null;

  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = xScale.ticks(6);

  return (
    <div className="glass-strong card-glow rounded-3xl border border-white/5 p-8 h-full w-full relative overflow-hidden group">
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <header className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg neon-primary">
                <TrendingUp className="size-6 text-primary" />
            </div>
            <div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none">Loss Ratio Velocity</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-60">30-Day Aggregated Stream</p>
            </div>
        </div>
        <div className="flex items-center gap-3 glass-subtle px-4 py-2 rounded-xl border-white/5">
            <Calendar className="size-3.5 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">L30 Analytics</span>
        </div>
      </header>
      
      <div className="relative">
        <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto overflow-visible cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <defs>
            <linearGradient id="lossRatioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            </defs>

            <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {/* Y grid lines and labels */}
            {yTicks.map((tick) => (
                <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
                <line x1={0} x2={innerWidth} stroke="white" strokeDasharray="4 4" strokeOpacity={0.05} />
                <text x={-15} y={4} textAnchor="end" fill="white" fillOpacity={0.4} fontSize={10} fontWeight="900" style={{ fontFamily: 'var(--font-mono)' }}>
                    {tick}
                </text>
                </g>
            ))}

            {/* X axis labels */}
            {xTicks.map((tick, i) => (
                <text
                key={i}
                x={xScale(tick)}
                y={innerHeight + 30}
                textAnchor="middle"
                fill="white"
                fillOpacity={0.4}
                fontSize={10}
                fontWeight="900"
                style={{ fontFamily: 'var(--font-mono)' }}
                >
                {d3.timeFormat('%d %b')(tick).toUpperCase()}
                </text>
            ))}

            {/* Area fill */}
            <path d={areaGenerator(data) || undefined} fill="url(#lossRatioGradient)" className="transition-all duration-1000" />

            {/* Line stroke */}
            <path
                d={lineGenerator(data) || undefined}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={3}
                filter="url(#glow)"
                className="transition-all duration-1000"
            />

            {/* Target line */}
            <line
                x1={0}
                x2={innerWidth}
                y1={yScale(LOSS_RATIO_GREEN)}
                y2={yScale(LOSS_RATIO_GREEN)}
                stroke="var(--fs-green)"
                strokeDasharray="8 4"
                strokeWidth={1}
                strokeOpacity={0.5}
            />
            <text x={innerWidth - 5} y={yScale(LOSS_RATIO_GREEN) - 10} textAnchor="end" fill="var(--fs-green)" fontSize={9} fontWeight="900" className="uppercase tracking-widest opacity-60">
                L-Threshold
            </text>

            {/* Hover crosshair + dot */}
            {hoveredIndex !== null && data[hoveredIndex] && (
                <g className="transition-all duration-200">
                <line
                    x1={xScale(new Date(data[hoveredIndex].date))}
                    x2={xScale(new Date(data[hoveredIndex].date))}
                    y1={0}
                    y2={innerHeight}
                    stroke="var(--secondary)"
                    strokeOpacity={0.3}
                    strokeDasharray="4 4"
                    pointerEvents="none"
                />
                <circle
                    cx={xScale(new Date(data[hoveredIndex].date))}
                    cy={yScale(data[hoveredIndex].lossRatioPercent)}
                    r={6}
                    fill="var(--secondary)"
                    className="neon-secondary"
                    pointerEvents="none"
                />
                </g>
            )}
            </g>
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (
            <div
            className="absolute rounded-2xl p-4 glass-strong border border-white/10 shadow-2xl pointer-events-none z-20 min-w-[200px]"
            style={{
                left: Math.min(xScale(new Date(data[hoveredIndex].date)) + MARGIN.left + 20, WIDTH - 220),
                top: Math.max(yScale(data[hoveredIndex].lossRatioPercent) + MARGIN.top - 100, 0),
            }}
            >
            <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {d3.timeFormat('%A, %b %d')(new Date(data[hoveredIndex].date))}
                </p>
                <div className="size-2 bg-secondary rounded-full neon-secondary" />
            </div>
            <div className="space-y-3">
                <div>
                   <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50 mb-0.5">Loss Ratio</p>
                   <p className="text-3xl font-display font-black text-white leading-none uppercase italic">
                     {data[hoveredIndex].lossRatioPercent}%
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                    <div>
                        <p className="text-[8px] font-black text-success uppercase tracking-widest mb-1">Premiums</p>
                        <p className="text-sm font-display font-black text-white tabular-nums tracking-tighter">₹{data[hoveredIndex].premiumsCollectedLakhs}L</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-danger uppercase tracking-widest mb-1">Claims</p>
                        <p className="text-sm font-display font-black text-white tabular-nums tracking-tighter">₹{data[hoveredIndex].claimsPaidLakhs}L</p>
                    </div>
                </div>
            </div>
            </div>
        )}
      </div>
      
      <footer className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="size-2 bg-success rounded-full opacity-60" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Normal Range &lt; 65%</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2 bg-warning rounded-full opacity-60" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Caution 65-80%</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2 bg-danger rounded-full opacity-60" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Critical &gt; 80%</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Info className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">Data latency ~140ms</span>
        </div>
      </footer>
    </div>
  );
}
