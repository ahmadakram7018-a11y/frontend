'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Plus,
  Zap,
  Star,
  Library,
  Settings,
  CheckSquare
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentPlans, setRecentPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, plansRes] = await Promise.all([
          api.get('/api/analytics'),
          api.get('/api/plans')
        ]);
        setAnalytics(analyticsRes.data);
        setRecentPlans(plansRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Tasks', value: analytics?.total_tasks || 0, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Completed', value: analytics?.completed_tasks || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Focus Hours', value: Math.round(analytics?.total_focus_hours || 0), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Growth %', value: Math.round(analytics?.completion_percentage || 0), icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/5 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-white/5 rounded-3xl" />
          <div className="h-96 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-blue-700 to-blue-900 shadow-2xl shadow-blue-900/40 border border-blue-500/20">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-100 text-[10px] font-black mb-4 border border-blue-400/20 uppercase tracking-widest"
          >
            <Star className="w-3 h-3 fill-blue-300" />
            Active Plan Session
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-50 mb-3 tracking-tight">
            Welcome, <span className="text-blue-400">{user?.name}</span>!
          </h1>
          <p className="text-blue-200/80 text-base sm:text-lg font-bold max-w-md leading-relaxed">
            {analytics?.ai_suggestion || "You're doing great! Keep up the momentum and reach your learning goals faster."}
          </p>
        </div>
        
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 h-full w-1/3 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-[32px] border-blue-400 rounded-full blur-3xl" />
        </div>
        <Rocket className="absolute -bottom-4 -right-4 w-32 h-32 sm:w-48 sm:h-48 text-blue-400/10 -rotate-12 pointer-events-none" />
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-blue-500/10 group hover:border-blue-400/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 bg-blue-500/10")}>
                <stat.icon className={cn("w-6 h-6 text-blue-400")} />
              </div>
              <div>
                <p className="text-blue-400/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-xl sm:text-2xl font-black text-blue-100">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Plans */}
        <section className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl sm:text-2xl font-black text-blue-100 flex items-center gap-2">
              <Library className="w-6 h-6 text-blue-500" />
              Recent Plans
            </h2>
            <Link href="/dashboard/my-plans" className="text-[10px] sm:text-sm font-black text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group uppercase tracking-widest text-nowrap">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {recentPlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="glass p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-blue-500/10 hover:border-blue-400/40 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                      {plan.profession}
                    </div>
                    <div className="text-[10px] text-blue-400/30 font-black uppercase tracking-widest">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-blue-100 mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-400/50 mb-6 flex-1 line-clamp-2 font-medium">
                    {plan.duration || "Self-paced study journey"}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-blue-400/40 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{Math.round(plan.progress_percentage)}%</span>
                    </div>
                    <div className="h-2 bg-blue-500/5 rounded-full overflow-hidden border border-blue-500/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${plan.progress_percentage}%` }}
                        className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link href="/dashboard/generate-plan">
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "rgba(37, 99, 235, 0.05)" }}
                className="h-full min-h-[160px] border-2 border-dashed border-blue-500/10 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center p-6 sm:p-8 gap-4 group transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 border border-blue-400/20">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 group-hover:text-blue-50 transition-colors" />
                </div>
                <div className="text-center">
                  <h4 className="text-base sm:text-lg font-black text-blue-100 uppercase tracking-tighter">Create New Plan</h4>
                  <p className="text-[10px] font-bold text-blue-400/40 uppercase tracking-widest">Launch AI Architect</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Action Sidebar */}
        <aside className="space-y-6 sm:space-y-8">
          <section className="glass p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-blue-500/20 bg-blue-500/5">
            <h2 className="text-xl font-black text-blue-100 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Add Quick Todo', href: '/dashboard/todo', icon: CheckSquare },
                { label: 'Analyze Performance', href: '/dashboard/analytics', icon: TrendingUp },
                { label: 'System Settings', href: '#', icon: Settings },
              ].map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-400/30 hover:bg-blue-500/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <action.icon className="w-5 h-5 text-blue-400/40" />
                      <span className="text-sm font-black text-blue-200 group-hover:text-blue-100">{action.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-500/20 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              ))}
            </div>
          </section>

          <section className="glass p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-blue-500/10 overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-lg sm:text-xl font-black text-blue-100 mb-2">Upgrade to Pro</h2>
              <p className="text-[10px] font-bold text-blue-400/50 mb-6 uppercase tracking-widest leading-relaxed">Unlock advanced AI analysis and unlimited plans.</p>
              <button className="w-full py-4 bg-blue-600 text-blue-50 font-black text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 border border-blue-400/30">
                COMING SOON
              </button>
            </div>
            <Star className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 text-blue-400/5 -rotate-12" />
          </section>
        </aside>
      </div>
    </div>
  );
}
