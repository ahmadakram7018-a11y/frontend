'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Loader2,
  CheckCircle2,
  Layers,
  Award,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-blue-100/40 font-black animate-pulse uppercase tracking-[0.2em]">Aggregating Intelligence</p>
      </div>
    );
  }

  if (!data) return null;

  const dailyProgressData = Object.entries(data.daily_progress).map(([date, count]) => ({
    name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    tasks: count
  }));

  const weeklyProgressData = Object.entries(data.weekly_progress).map(([week, count]) => ({
    name: week,
    tasks: count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { label: 'Completion rate', value: `${Math.round(data.completion_percentage)}%`, icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Weekly Velocity', value: data.weekly_completion_count, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Focus Intensity', value: `${Math.round(data.total_focus_hours)}h`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Total Tasks', value: data.total_tasks, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20 shadow-xl shadow-blue-500/10">
            <Activity className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Growth Analytics</h1>
        </div>
        <p className="text-blue-100/40 font-medium ml-1">Visualize your professional journey and AI-driven performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className={cn("p-4 rounded-3xl group-hover:scale-110 transition-transform duration-500", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-blue-100/40 text-xs font-black uppercase tracking-widest leading-none">{stat.label}</p>
                <h3 className="text-3xl font-black text-white leading-none">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Daily Velocity
                  </h2>
                  <p className="text-sm text-blue-100/40 font-medium">Task completion frequency over the last 7 days.</p>
                </div>
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-black uppercase tracking-widest">
                  Live Sync
                </div>
             </div>

             <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={dailyProgressData}>
                      <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 700 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 700 }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F2A50', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '20px',
                          color: '#fff',
                          fontWeight: 'bold',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tasks" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorTasks)" 
                        animationDuration={1500}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </section>

          <section className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Weekly Milestone Performance
                  </h2>
                  <p className="text-sm text-blue-100/40 font-medium">Comparative output across the last 4 weeks.</p>
                </div>
             </div>

             <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 700 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 700 }} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ 
                          backgroundColor: '#0F2A50', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '20px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Bar 
                        dataKey="tasks" 
                        fill="#6366f1" 
                        radius={[8, 8, 0, 0]} 
                        barSize={40}
                        animationDuration={1500}
                      />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </section>
        </div>

        {/* AI Insight Sidebar */}
        <aside className="space-y-8">
           <section className="relative overflow-hidden p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-blue-800 shadow-2xl shadow-indigo-500/20">
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white leading-tight">AI Behavior Insight</h3>
                <p className="text-blue-100 text-lg font-medium leading-relaxed italic">
                  "{data.ai_suggestion}"
                </p>
                <div className="pt-4 flex items-center gap-3 text-white/60 font-black text-xs uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Insight updated just now
                </div>
              </div>
              <Star className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 -rotate-12 pointer-events-none" />
           </section>

           <section className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Consistency Target
              </h3>
              <div className="relative h-48 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                        data={[
                          { name: 'Completed', value: data.completed_tasks },
                          { name: 'Remaining', value: data.total_tasks - data.completed_tasks }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                       >
                         {data.tasks !== 0 ? [
                            <Cell key="cell-0" fill="#3b82f6" stroke="none" />,
                            <Cell key="cell-1" fill="rgba(255,255,255,0.05)" stroke="none" />
                         ] : <Cell key="cell-empty" fill="rgba(255,255,255,0.05)" stroke="none" />}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{Math.round(data.completion_percentage)}%</span>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Overall</span>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-100/40 uppercase tracking-widest">Efficiency Status</span>
                    <span className="text-sm font-bold text-emerald-400">Optimal</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-emerald-500 rounded-full" />
                 </div>
              </div>
           </section>

           <div className="p-1 rounded-[3rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
             <div className="bg-[#0A1F3C] rounded-[2.8rem] p-10 space-y-4">
                <h4 className="text-white font-black text-xl">Weekly Focus</h4>
                <p className="text-blue-100/40 text-sm font-medium leading-relaxed">
                  Your most productive hours were between <span className="text-white">9 AM and 12 PM</span> this week.
                </p>
                <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
                  View full report
                </button>
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
