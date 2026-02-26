'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Trash2, 
  ExternalLink,
  Calendar,
  Clock,
  Briefcase,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MyPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('all');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/plans');
      setPlans(res.data);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/api/plans/${id}`);
      setPlans(plans.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProfession === 'all' || plan.profession.toLowerCase() === filterProfession.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const professions = ['all', ...Array.from(new Set(plans.map(p => p.profession)))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-blue-400/40 font-black animate-pulse uppercase tracking-[0.2em]">Synchronizing Plans</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-400/20 shadow-xl shadow-blue-500/10">
              <Library className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-blue-100 tracking-tight">Your Architected Plans</h1>
          </div>
          <p className="text-blue-400/40 font-bold ml-1 uppercase tracking-widest text-[9px] sm:text-[10px]">Manage and track your AI-powered learning journeys.</p>
        </div>

        <Link href="/dashboard/generate-plan">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-blue-50 font-black rounded-xl sm:rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors border border-blue-400/20 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            New Master Plan
          </motion.button>
        </Link>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400/30" />
          <input 
            type="text" 
            placeholder="Search plans by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-blue-500/5 border border-blue-500/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-blue-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-blue-500/20 font-bold text-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 rounded-xl sm:rounded-2xl p-2 px-4 shrink-0">
          <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500/40" />
          <select 
            value={filterProfession}
            onChange={(e) => setFilterProfession(e.target.value)}
            className="bg-transparent border-none text-blue-400/60 font-black text-[10px] sm:text-xs outline-none focus:ring-0 appearance-none pr-4 capitalize tracking-widest w-full"
          >
            {professions.map(p => (
              <option key={p} value={p} className="bg-[#0A1F3C] text-blue-100">{p}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-20 sm:py-32 glass rounded-[2rem] sm:rounded-[4rem] border-blue-500/10 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-400/10">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-blue-100 mb-2 uppercase tracking-tighter">No plans architected yet.</h3>
          <p className="text-blue-400/40 mb-8 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Ready to launch your first AI-driven study journey?</p>
          <Link href="/dashboard/generate-plan">
             <button className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-blue-50 font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-blue-600/20 border border-blue-400/20 uppercase tracking-widest text-xs sm:text-sm">
               Generate Your First Plan
             </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, idx) => (
              <motion.div
                layout
                key={plan.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group glass rounded-[2rem] sm:rounded-[2.5rem] border-blue-500/10 hover:border-blue-400/40 transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                
                <div className="p-6 sm:p-8 flex flex-col h-full relative z-10">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="flex flex-col gap-2">
                      <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest w-fit">
                        {plan.profession}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-blue-400/30 font-black uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(plan.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePlan(plan.id)}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500/5 text-blue-500/20 hover:text-blue-400 hover:bg-blue-500/10 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-blue-100 mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight uppercase tracking-tighter">
                    {plan.title}
                  </h3>
                  
                  <p className="text-blue-400/40 text-xs sm:text-sm font-bold mb-6 sm:mb-8 flex-1 line-clamp-2 leading-relaxed">
                    {plan.duration || "Self-paced study journey curated by AI."}
                  </p>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest sm:tracking-[0.2em]">
                      <span className="text-blue-400/40">Current Progress</span>
                      <span className="text-blue-100">{Math.round(plan.progress_percentage)}%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-blue-500/5 rounded-full overflow-hidden border border-blue-500/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${plan.progress_percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link href={`/dashboard/my-plans/${plan.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 hover:border-blue-400/30 text-blue-100 font-black rounded-xl sm:rounded-2xl transition-all uppercase tracking-widest text-[9px] sm:text-[10px]">
                        View Plan
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
