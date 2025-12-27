import React from 'react';
import { Category, Factor } from '../types';
import { FactorRow } from './FactorRow';
import { Button } from './Button';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: Category;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onRemove: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onUpdate, onRemove }) => {
  const addFactor = (type: 'pros' | 'cons') => {
    const newFactor: Factor = {
      id: crypto.randomUUID(),
      description: '',
      weight: 1,
    };
    onUpdate(category.id, {
      [type]: [...category[type], newFactor]
    });
  };

  const updateFactor = (type: 'pros' | 'cons', factorId: string, updates: Partial<Factor>) => {
    const updatedFactors = category[type].map(f => 
      f.id === factorId ? { ...f, ...updates } : f
    );
    onUpdate(category.id, { [type]: updatedFactors });
  };

  const removeFactor = (type: 'pros' | 'cons', factorId: string) => {
    const updatedFactors = category[type].filter(f => f.id !== factorId);
    onUpdate(category.id, { [type]: updatedFactors });
  };

  const totalPros = category.pros.reduce((sum, f) => sum + f.weight, 0);
  const totalCons = category.cons.reduce((sum, f) => sum + f.weight, 0);
  const score = totalPros - totalCons;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
        <input
          type="text"
          value={category.name}
          onChange={(e) => onUpdate(category.id, { name: e.target.value })}
          placeholder="Category Name"
          className="flex-1 bg-transparent text-lg font-bold text-slate-800 placeholder-slate-400 focus:outline-none border-b-2 border-transparent focus:border-indigo-500 px-1"
        />
        <div className="flex items-center gap-3">
            <div className={`text-sm font-bold px-3 py-1 rounded-full ${score > 0 ? 'bg-emerald-100 text-emerald-700' : score < 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                {score > 0 ? '+' : ''}{score}
            </div>
            <button 
                onClick={() => onRemove(category.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Content - Stacked vertically to ensure inputs have enough width */}
      <div className="p-4 flex flex-col gap-6 flex-1 overflow-y-auto min-h-[300px]">
        {/* Pros Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 text-emerald-600">
            <h4 className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide">
              <TrendingUp size={16} /> Pros <span className="text-emerald-200 ml-1 bg-emerald-50 px-2 rounded-md text-xs">{totalPros} pts</span>
            </h4>
          </div>
          <div className="flex-1 space-y-1">
            {category.pros.map(pro => (
              <FactorRow
                key={pro.id}
                factor={pro}
                type="pro"
                onUpdate={(id, u) => updateFactor('pros', id, u)}
                onRemove={(id) => removeFactor('pros', id)}
              />
            ))}
            <button
              onClick={() => addFactor('pros')}
              className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-emerald-600/70 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-dashed border-emerald-200 transition-all"
            >
              <Plus size={14} /> Add Pro
            </button>
          </div>
        </div>

        {/* Cons Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3 text-rose-600">
            <h4 className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide">
              <TrendingDown size={16} /> Cons <span className="text-rose-200 ml-1 bg-rose-50 px-2 rounded-md text-xs">-{totalCons} pts</span>
            </h4>
          </div>
          <div className="flex-1 space-y-1">
            {category.cons.map(con => (
              <FactorRow
                key={con.id}
                factor={con}
                type="con"
                onUpdate={(id, u) => updateFactor('cons', id, u)}
                onRemove={(id) => removeFactor('cons', id)}
              />
            ))}
            <button
              onClick={() => addFactor('cons')}
              className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-rose-600/70 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-dashed border-rose-200 transition-all"
            >
              <Plus size={14} /> Add Con
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};