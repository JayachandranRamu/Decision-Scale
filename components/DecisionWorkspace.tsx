import React, { useState, useEffect } from 'react';
import { Category, ScoredCategory, Profile } from '../types';
import { CategoryCard } from './CategoryCard';
import { Meter } from './Meter';
import { Button } from './Button';
import { Plus, LayoutGrid, Activity, RotateCcw, ArrowLeft, Trash2, MoreHorizontal, Star } from 'lucide-react';

interface DecisionWorkspaceProps {
  profile: Profile;
  onUpdate: (updatedProfile: Profile) => void;
  onBack: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
}

const INITIAL_CATEGORY_TEMPLATE: Category = {
  id: 'temp-1',
  name: 'Option A',
  pros: [],
  cons: []
};

export const DecisionWorkspace: React.FC<DecisionWorkspaceProps> = ({ profile, onUpdate, onBack, onDelete, onToggleStar }) => {
  const [categories, setCategories] = useState<Category[]>(profile.categories);
  const [profileName, setProfileName] = useState(profile.name);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setCategories(profile.categories);
    setProfileName(profile.name);
  }, [profile.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate({
        ...profile,
        name: profileName,
        categories: categories,
        lastModified: Date.now()
      });
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [categories, profileName]);

  const addCategory = () => {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: `Option ${String.fromCharCode(65 + categories.length)}`, 
      pros: [],
      cons: []
    };
    setCategories([...categories, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const resetAll = () => {
     if (confirm('Reset all data in this profile?')) {
        setCategories([INITIAL_CATEGORY_TEMPLATE]);
     }
  };

  const scoredCategories: ScoredCategory[] = categories.map(cat => {
    const totalPros = cat.pros.reduce((acc, curr) => acc + curr.weight, 0);
    const totalCons = cat.cons.reduce((acc, curr) => acc + curr.weight, 0);
    return {
      ...cat,
      totalPros,
      totalCons,
      score: totalPros - totalCons
    };
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500">
                <ArrowLeft size={20} />
            </Button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg hidden sm:block">
                    <Activity size={18} />
                </div>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="text-lg font-bold text-slate-800 tracking-tight bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:ring-0 focus:outline-none transition-all px-1 max-w-[200px] sm:max-w-xs"
                />
            </div>
        </div>
        
        <div className="flex items-center gap-2 relative">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleStar}
                className={profile.starred ? "text-amber-400 hover:text-amber-500" : "text-slate-400 hover:text-amber-400"}
            >
                <Star size={20} className={profile.starred ? "fill-amber-400" : ""} />
            </Button>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            <Button onClick={addCategory} size="sm" className="hidden sm:flex">
                <Plus size={16} className="mr-2" /> Add Category
            </Button>
            <Button onClick={addCategory} size="sm" className="flex sm:hidden">
                <Plus size={16} />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="text-slate-500">
                <MoreHorizontal size={20} />
            </Button>

            {/* Header Dropdown Menu */}
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <button 
                            onClick={() => { resetAll(); setShowMenu(false); }} 
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                            <RotateCcw size={16} /> Reset Data
                        </button>
                        <div className="h-[1px] bg-slate-100 my-1" />
                        <button 
                            onClick={() => { onDelete(); setShowMenu(false); }} 
                            className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                            <Trash2 size={16} /> Delete Decision
                        </button>
                    </div>
                </>
            )}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel: Category Editors */}
        <div className="w-full md:w-1/2 lg:w-3/5 h-1/2 md:h-full flex flex-col border-r border-slate-200 bg-slate-50/50">
            <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-20 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <LayoutGrid size={16} /> Configuration
                </h2>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {categories.length} Options
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                {categories.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <p className="mb-4">No categories yet.</p>
                        <Button onClick={addCategory}>Create your first option</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                        {categories.map(cat => (
                            <div key={cat.id} className="min-h-[400px]">
                                <CategoryCard 
                                    category={cat} 
                                    onUpdate={updateCategory}
                                    onRemove={removeCategory}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Panel: Visualization Meter */}
        <div className="w-full md:w-1/2 lg:w-2/5 h-1/2 md:h-full bg-slate-100 relative shadow-inner overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-slate-50/50 to-rose-50/50 pointer-events-none" />
             <div className="h-full w-full p-8 md:p-12 relative z-10">
                <Meter categories={scoredCategories} />
             </div>
        </div>

      </main>
    </div>
  );
};