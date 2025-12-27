import React from 'react';
import { Factor } from '../types';
import { Trash2, GripVertical } from 'lucide-react';

interface FactorRowProps {
  factor: Factor;
  type: 'pro' | 'con';
  onUpdate: (id: string, updates: Partial<Factor>) => void;
  onRemove: (id: string) => void;
}

export const FactorRow: React.FC<FactorRowProps> = ({ factor, type, onUpdate, onRemove }) => {
  const isPro = type === 'pro';
  
  return (
    <div className="group w-full flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className={`p-1 rounded ${isPro ? 'text-emerald-400' : 'text-rose-400'}`}>
        <GripVertical size={14} className="opacity-20 group-hover:opacity-100 cursor-move" />
      </div>
      
      <input
        type="text"
        value={factor.description}
        onChange={(e) => onUpdate(factor.id, { description: e.target.value })}
        placeholder={isPro ? "e.g., Cost effective" : "e.g., High maintenance"}
        className="flex-1 min-w-0 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:ring-0 px-2 py-1 text-sm text-slate-700 placeholder-slate-400 transition-colors outline-none"
      />

      <div className="flex items-center gap-1.5 bg-slate-50 rounded-md px-1.5 py-1 border border-slate-100 shrink-0">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
          Weight
        </span>
        <input
          type="number"
          min="1"
          max="99"
          value={factor.weight}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            onUpdate(factor.id, { weight: Math.max(0, val) });
          }}
          className={`w-9 text-center bg-white rounded border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isPro ? 'text-emerald-600' : 'text-rose-600'}`}
        />
      </div>

      <button
        onClick={() => onRemove(factor.id)}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
        title="Remove factor"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};