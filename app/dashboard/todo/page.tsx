'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Loader2,
  ChevronRight,
  TrendingUp,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';
import api from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TodoPage() {
  const [todos, setTodos] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState({ title: '', due_date: '', due_time: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todosRes, analyticsRes] = await Promise.all([
        api.get('/api/todos'),
        api.get('/api/todos/analytics')
      ]);
      setTodos(todosRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to fetch todo data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title) return;
    try {
      const res = await api.post('/api/todos', newTodo);
      setTodos([res.data, ...todos]);
      setNewTodo({ title: '', due_date: '', due_time: '' });
      setIsAdding(false);
      // Refresh analytics
      const anaRes = await api.get('/api/todos/analytics');
      setAnalytics(anaRes.data);
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await api.patch(`/api/todos/${id}/toggle`);
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      // Refresh analytics
      const anaRes = await api.get('/api/todos/analytics');
      setAnalytics(anaRes.data);
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
      // Refresh analytics
      const anaRes = await api.get('/api/todos/analytics');
      setAnalytics(anaRes.data);
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-blue-100/40 font-black animate-pulse uppercase tracking-[0.2em]">Synchronizing Checkpoints</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20 shadow-xl shadow-blue-500/10">
                <CheckSquare className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Active Checkpoints</h1>
            </div>
            <p className="text-blue-100/40 font-medium ml-1">Manage rapid tasks and daily priorities with AI precision.</p>
         </div>

         <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-4 rounded-[2rem] border-white/5 bg-blue-500/5 min-w-[200px]"
            >
               <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-100/40">Success Velocity</span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{Math.round(analytics?.completion_percentage || 0)}%</span>
                  <span className="text-[10px] font-bold text-white/20">Done today</span>
               </div>
               <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics?.completion_percentage || 0}%` }}
                    className="h-full bg-blue-500 rounded-full" 
                  />
               </div>
            </motion.div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main List */}
        <section className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex-1 p-6 glass border-blue-500/20 rounded-[2rem] bg-blue-500/5 flex items-center justify-between group hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                   </div>
                   <span className="text-lg font-bold text-blue-100/60 group-hover:text-white transition-colors">Register New Checkpoint...</span>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-100/20 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={addTodo} className="glass p-8 rounded-[2.5rem] border-white/10 space-y-6 mb-8">
                     <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Title</label>
                          <input 
                            required
                            type="text" 
                            placeholder="What needs to be done?" 
                            value={newTodo.title}
                            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Due Date</label>
                            <input 
                              type="date" 
                              value={newTodo.due_date}
                              onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Due Time</label>
                            <input 
                              type="time" 
                              value={newTodo.due_time}
                              onChange={(e) => setNewTodo({ ...newTodo, due_time: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                          </div>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button type="submit" className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                          <Plus className="w-5 h-5" />
                          Register Task
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">
                          Cancel
                        </button>
                     </div>
                  </form>
                </motion.div>
              )}
           </AnimatePresence>

           <div className="space-y-4">
              {todos.length === 0 ? (
                <div className="text-center py-24 glass rounded-[3rem] border-white/5 opacity-40">
                   <Target className="w-16 h-16 text-white/20 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-white">Your list is clear</h3>
                   <p className="text-sm">Capture immediate tasks to maintain your flow.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                   {todos.map((todo, idx) => (
                     <motion.div
                        layout
                        key={todo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={cn(
                          "group glass p-6 rounded-[2rem] border-white/5 hover:border-blue-500/30 transition-all duration-300 flex items-center gap-6",
                          todo.completed && "opacity-60 grayscale-[0.8]"
                        )}
                     >
                        <button 
                          onClick={() => toggleTodo(todo.id)}
                          className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 border-2",
                            todo.completed 
                              ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/40" 
                              : "bg-white/5 border-white/10 text-white/20 hover:border-blue-500 hover:text-blue-500"
                          )}
                        >
                           {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                           <h3 className={cn(
                             "text-lg font-bold text-white transition-all line-clamp-1",
                             todo.completed && "line-through text-white/40"
                           )}>
                             {todo.title}
                           </h3>
                           <div className="flex items-center gap-4 mt-1">
                              {todo.due_date && (
                                <div className="flex items-center gap-1.5 text-[10px] text-blue-100/30 font-black uppercase tracking-tighter">
                                   <Calendar className="w-3 h-3" />
                                   {new Date(todo.due_date).toLocaleDateString()}
                                </div>
                              )}
                              {todo.due_time && (
                                <div className="flex items-center gap-1.5 text-[10px] text-blue-100/30 font-black uppercase tracking-tighter">
                                   <Clock className="w-3 h-3" />
                                   {todo.due_time}
                                </div>
                              )}
                           </div>
                        </div>

                        <button 
                          onClick={() => deleteTodo(todo.id)}
                          className="p-3 rounded-xl bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </motion.div>
                   ))}
                </AnimatePresence>
              )}
           </div>
        </section>

        {/* Action Sidebar */}
        <aside className="space-y-8">
           <section className="glass p-8 rounded-[2.5rem] border-white/5 overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                 <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                 </div>
                 <h3 className="text-xl font-black text-white">Daily Intelligence</h3>
                 <p className="text-blue-100/40 text-sm font-medium leading-relaxed">
                   Based on your recent activity, your focus is strongest in the <span className="text-white font-bold">morning</span>.
                 </p>
                 <div className="pt-2">
                    <button className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors group">
                       Enable Smart Reminders
                       <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
              <Zap className="absolute -top-4 -right-4 w-24 h-24 text-white/5 -rotate-12 pointer-events-none" />
           </section>

           <section className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <Target className="w-5 h-5 text-indigo-400" />
                 To-Do Stats
              </h3>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/40">
                       <span>Total Capacity</span>
                       <span className="text-white">{analytics?.total_todos || 0}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-full bg-white/10 rounded-full" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-white/40">
                       <span>Execution Rate</span>
                       <span className="text-white">{analytics?.completed_todos || 0}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics?.completion_percentage || 0}%` }}
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                       />
                    </div>
                 </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-center">
                 <p className="text-xs font-bold text-indigo-300 leading-relaxed uppercase tracking-widest">
                   You are in the <span className="text-white">top 5%</span> of focused planners today.
                 </p>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
}
