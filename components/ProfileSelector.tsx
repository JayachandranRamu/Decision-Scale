import React from 'react';
import { Profile } from '../types';
import { Briefcase, Utensils, Heart, Plus, Clock, ArrowRight, Trash2, Activity, Home, GraduationCap, Smartphone, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileSelectorProps {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onCreate: (template: string) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelect, onCreate, onDelete, onToggleStar }) => {
  
  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(ts));
  };

  const templates = [
    { id: 'job', name: 'Job Decision', icon: <Briefcase size={22} className="text-white" />, description: 'Compare salary & culture', color: 'bg-indigo-500' },
    { id: 'house', name: 'Home Buying', icon: <Home size={22} className="text-white" />, description: 'Location, size, price', color: 'bg-emerald-500' },
    { id: 'education', name: 'University', icon: <GraduationCap size={22} className="text-white" />, description: 'Course, cost, prestige', color: 'bg-violet-500' },
    { id: 'tech', name: 'Gadgets', icon: <Smartphone size={22} className="text-white" />, description: 'Features vs price', color: 'bg-slate-700' },
    { id: 'food', name: 'Dining Out', icon: <Utensils size={22} className="text-white" />, description: 'Taste vs health', color: 'bg-orange-500' },
    { id: 'life', name: 'Life Choice', icon: <Heart size={22} className="text-white" />, description: 'Major decisions', color: 'bg-rose-500' },
    { id: 'blank', name: 'Custom', icon: <Plus size={22} className="text-slate-600" />, description: 'Start from scratch', color: 'bg-white border-2 border-dashed border-slate-300' },
  ] as const;

  // Sort: Starred first, then by Last Modified
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.starred === b.starred) {
      return b.lastModified - a.lastModified;
    }
    return a.starred ? -1 : 1;
  });

  return (
    <div className="h-screen w-full bg-slate-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-16 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <Activity size={32} className="text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">DecisionScale</h1>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            A weighted decision matrix tool. Compare your options objectively by assigning values to pros and cons, and visualize the outcome.
          </p>
        </header>

        {/* Start New Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Plus size={16} /> Create New
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {templates.map((t, idx) => {
               const isCustom = t.id === 'blank';
               return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCreate(t.id)}
                  className="group relative flex flex-col p-5 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all text-left h-48 justify-between overflow-hidden"
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110
                    ${t.color}
                  `}>
                    {t.icon}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {t.description}
                    </p>
                  </div>

                  {/* Decorative background element */}
                  {!isCustom && (
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${t.color}`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Recent Decisions Section */}
        {sortedProfiles.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} /> Your Decisions
                </h2>
                <span className="text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-full">{sortedProfiles.length}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {sortedProfiles.map(profile => (
                <div 
                    key={profile.id} 
                    className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* BACKGROUND CLICK TARGET - Opens the decision */}
                  <div 
                    onClick={() => onSelect(profile.id)}
                    className="absolute inset-0 z-0 cursor-pointer hover:bg-slate-50 transition-colors"
                  />

                  {/* CONTENT LAYER - pointer-events-none ensures clicks pass through to background */}
                  {/* INTERACTIVE ELEMENTS - pointer-events-auto ensures buttons capture clicks */}
                  <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
                    
                    <div className="flex-1 flex items-center gap-5">
                       <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0 transition-colors">
                          {profile.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                                {profile.name}
                            </h4>
                            {profile.starred && (
                              <Star size={16} className="fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span>Edited {formatDate(profile.lastModified)}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{profile.categories.length} Options</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-3 pointer-events-auto">
                      <button 
                          onClick={() => onToggleStar(profile.id)}
                          className={`p-2.5 rounded-xl transition-all
                            ${profile.starred 
                              ? 'opacity-100 text-amber-400 hover:bg-amber-50' 
                              : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-400 hover:bg-amber-50'}
                          `}
                          title={profile.starred ? "Unstar" : "Star"}
                      >
                          <Star size={20} className={profile.starred ? "fill-amber-400" : ""} />
                      </button>

                      <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden group-hover:block" />

                      <button 
                          onClick={() => onDelete(profile.id)}
                          className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Delete decision"
                      >
                          <Trash2 size={20} />
                      </button>
                      
                      <div className="p-2 text-slate-300 group-hover:text-indigo-400 transition-colors">
                          <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};