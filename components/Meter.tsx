import React, { useMemo } from 'react';
import { ScoredCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MeterProps {
  categories: ScoredCategory[];
}

export const Meter: React.FC<MeterProps> = ({ categories }) => {
  // 1. Calculate the dynamic range
  // We want 0 to be centered. So the scale is [-maxAbs, +maxAbs]
  const rangeLimit = useMemo(() => {
    if (categories.length === 0) return 10;
    const maxScore = Math.max(...categories.map(c => Math.abs(c.score)));
    // Add 20% padding or minimum of 10
    return Math.max(10, Math.ceil(maxScore * 1.2));
  }, [categories]);

  // Helper to convert score to percentage from top
  // Score +Limit => 0% top
  // Score 0 => 50% top
  // Score -Limit => 100% top
  const getTopPercentage = (score: number) => {
    // Invert the normalized value because CSS top 0 is the highest point
    const normalized = (score / rangeLimit) * 50; 
    return 50 - normalized;
  };

  // Generate ticks
  const ticks = useMemo(() => {
    const step = Math.ceil(rangeLimit / 5); // 5 ticks per side roughly
    const t = [];
    for (let i = -rangeLimit; i <= rangeLimit; i += step) {
        if (i === 0) continue; // Skip 0, we handle it specially
        // Only add if it's within a reasonable visual range to avoid edge clipping
        if (Math.abs(i) < rangeLimit * 0.95) t.push(i);
    }
    return t;
  }, [rangeLimit]);

  return (
    <div className="h-full w-full flex flex-col relative select-none">
      {/* Background Gradient / Scale Context */}
      <div className="absolute inset-0 flex justify-center">
        {/* The Axis Line */}
        <div className="w-1 h-full bg-slate-200 rounded-full relative">
            {/* Zero Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full z-10 shadow-sm border-2 border-white" />
            <div className="absolute top-1/2 left-6 -translate-y-1/2 text-xs font-bold text-slate-400">0</div>
        </div>
      </div>

      {/* Ticks */}
      {ticks.map(val => (
        <div 
            key={val}
            className="absolute left-1/2 w-full -translate-y-1/2 pointer-events-none flex items-center justify-center"
            style={{ top: `${getTopPercentage(val)}%` }}
        >
            <div className="w-2 h-[1px] bg-slate-300 absolute left-1/2 -translate-x-1/2"></div>
            <span className="text-[10px] text-slate-300 ml-4 font-mono">{val > 0 ? `+${val}` : val}</span>
        </div>
      ))}

      {/* Zones Labels */}
      <div className="absolute top-4 right-4 text-emerald-500/10 font-black text-6xl uppercase tracking-widest pointer-events-none select-none">
        Pros
      </div>
      <div className="absolute bottom-4 right-4 text-rose-500/10 font-black text-6xl uppercase tracking-widest pointer-events-none select-none">
        Cons
      </div>

      {/* Category Markers */}
      <div className="absolute inset-0">
        <AnimatePresence>
            {categories.map((cat) => {
                const topPct = getTopPercentage(cat.score);
                const isPositive = cat.score > 0;
                const isNegative = cat.score < 0;
                
                return (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0, x: '-50%' }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            top: `${topPct}%`,
                            x: '-50%',
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30 
                        }}
                        className="absolute left-1/2 flex items-center group z-20"
                        style={{ marginTop: '-1.5rem' }} // Offset to center the content vertically on the point
                    >
                        {/* The Line Connector */}
                        <div className={`
                            hidden md:block absolute right-1/2 w-8 h-[2px] 
                            ${isPositive ? 'bg-emerald-400' : isNegative ? 'bg-rose-400' : 'bg-slate-400'}
                            transition-all duration-300 group-hover:w-12
                        `} />

                        {/* The Bubble */}
                        <div className={`
                            relative flex items-center gap-3 pl-10 pr-4 py-2 rounded-r-xl shadow-md border-l-4
                            bg-white backdrop-blur-sm bg-opacity-90 cursor-default hover:z-30 hover:scale-105 transition-transform
                            ${isPositive ? 'border-emerald-500 shadow-emerald-500/10' : 
                              isNegative ? 'border-rose-500 shadow-rose-500/10' : 
                              'border-slate-500 shadow-slate-500/10'}
                        `}>
                             {/* Score Circle */}
                            <div className={`
                                absolute left-0 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-4 border-white
                                ${isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-slate-500'}
                            `}>
                                {cat.score}
                            </div>

                            <div className="flex flex-col min-w-[100px]">
                                <span className="font-bold text-slate-800 text-sm whitespace-nowrap truncate max-w-[160px]">
                                    {cat.name || "Untitled"}
                                </span>
                                <div className="flex text-[10px] gap-2 text-slate-500 font-medium">
                                    <span className="text-emerald-600">+{cat.totalPros}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-rose-600">-{cat.totalCons}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};