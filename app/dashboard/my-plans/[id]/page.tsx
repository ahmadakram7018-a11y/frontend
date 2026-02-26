'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Loader2, 
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Star,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import api from '@/lib/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PlanDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  // Plan Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', profession: '', duration: '' });

  // Task Edit State
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', focus_hours: 0, priority: 'medium' });

  // Custom Modal States
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/plans/${id}`);
      setPlan(res.data);
      setEditForm({
        title: res.data.title,
        profession: res.data.profession,
        duration: res.data.duration || ''
      });
    } catch (err) {
      console.error('Failed to fetch plan:', err);
      router.push('/dashboard/my-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/api/plans/${id}`, editForm);
      setPlan({ ...plan, ...res.data });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update plan:', err);
    }
  };

  const confirmDeletePlan = async () => {
    try {
      await api.delete(`/api/plans/${id}`);
      router.push('/dashboard/my-plans');
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      await api.patch(`/api/tasks/${taskId}/toggle`);
      setPlan((prev: any) => {
        const updatedTasks = prev.tasks.map((t: any) => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const completed = updatedTasks.filter((t: any) => t.completed).length;
        return {
          ...prev,
          tasks: updatedTasks,
          progress_percentage: (completed / updatedTasks.length) * 100
        };
      });
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const res = await api.patch(`/api/tasks/${editingTask.id}`, taskForm);
      setPlan((prev: any) => ({
        ...prev,
        tasks: prev.tasks.map((t: any) => t.id === editingTask.id ? res.data : t)
      }));
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await api.delete(`/api/tasks/${taskToDelete}`);
      setPlan((prev: any) => {
        const updatedTasks = prev.tasks.filter((t: any) => t.id !== taskToDelete);
        const completed = updatedTasks.filter((t: any) => t.completed).length;
        return {
          ...prev,
          tasks: updatedTasks,
          progress_percentage: updatedTasks.length > 0 ? (completed / updatedTasks.length) * 100 : 0
        };
      });
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const openTaskEdit = (task: any) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      focus_hours: task.focus_hours || 0,
      priority: task.priority || 'medium'
    });
  };

  // --- REUSABLE MODAL COMPONENT ---
  const Modal = ({ isOpen, onClose, title, children }: any) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020817]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl glass border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 transition-colors">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-blue-100/40 font-black animate-pulse uppercase tracking-[0.2em]">Retriving AI Journey</p>
      </div>
    );
  }

  if (!plan) return null;

  const completedTasks = plan.tasks.filter((t: any) => t.completed).length;
  const totalTasks = plan.tasks.length;

  return (
    <div className="space-y-12 pb-24">
      {/* Plan Header */}
      <header className="relative p-12 rounded-[4rem] bg-gradient-to-br from-blue-700 to-indigo-900 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start justify-between">
          <div className="flex-1 space-y-6">
            <button 
              onClick={() => router.push('/dashboard/my-plans')}
              className="px-6 py-2.5 bg-white/10 border border-white/10 text-white rounded-full flex items-center gap-2 hover:bg-white/20 transition-all text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Plans
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
                  {plan.profession}
                </div>
                {plan.progress_percentage === 100 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <Award className="w-3 h-3" />
                    Completed Journey
                  </div>
                )}
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-auto p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all flex items-center gap-2 text-xs font-bold"
                >
                  {isEditing ? <ChevronUp className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {isEditing ? 'Cancel Edit' : 'Edit Plan'}
                </button>
                <button 
                  onClick={() => setShowDeletePlanModal(true)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl text-red-200 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdatePlan} className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/40 ml-2">Title</label>
                      <input 
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/40 ml-2">Profession</label>
                      <input 
                        type="text"
                        value={editForm.profession}
                        onChange={(e) => setEditForm({...editForm, profession: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-white/40 ml-2">Duration</label>
                      <input 
                        type="text"
                        value={editForm.duration}
                        onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg">
                    Save Plan Changes
                  </button>
                </form>
              ) : (
                <>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                    {plan.title}
                  </h1>
                  <p className="text-xl text-blue-100/60 font-medium max-w-2xl leading-relaxed">
                    {plan.duration || "Structured learning journey designed by AI for maximum focus and retention."}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:w-80 space-y-8">
            <div className="glass p-8 rounded-[2.5rem] border-white/10 bg-white/5 space-y-6">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-white/40">
                <span>Progress Tracker</span>
                <span className="text-white">{Math.round(plan.progress_percentage)}%</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${plan.progress_percentage}%` }}
                  className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{completedTasks}/{totalTasks}</span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tasks Complete</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Layers className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tasks Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Daily Roadmap
          </h2>
          <div className="flex items-center gap-4 text-sm font-bold text-blue-100/40">
            <span>Filter: Date Range</span>
            <div className="w-[1px] h-4 bg-white/10" />
            <span>Sort: Chronological</span>
          </div>
        </div>

        <div className="space-y-4">
          {plan.tasks.map((task: any, idx: number) => {
            const isExpanded = expandedTask === task.id;
            const priorityColors = {
              low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              high: 'bg-red-500/10 text-red-400 border-red-500/20',
            };

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "group glass rounded-[2rem] border-white/5 hover:border-blue-500/30 transition-all duration-300 overflow-hidden",
                  task.completed && "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0",
                  isExpanded && "border-blue-500/40 shadow-2xl shadow-blue-500/10"
                )}
              >
                <div className="p-8 flex items-center gap-8">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shrink-0 border-2",
                      task.completed 
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40" 
                        : "bg-white/5 border-white/10 text-white/20 hover:border-blue-500 hover:text-blue-500"
                    )}
                  >
                    {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>

                  <div className="flex-1 min-w-0" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0",
                        priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium
                      )}>
                        {task.priority} Priority
                      </span>
                      {task.scheduled_date && (
                        <div className="flex items-center gap-1.5 text-xs text-blue-100/30 font-bold uppercase tracking-tighter shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.scheduled_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <h3 className={cn(
                      "text-xl font-bold text-white transition-all line-clamp-1",
                      task.completed && "line-through text-white/40"
                    )}>
                      {task.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-8 shrink-0">
                    <div className="hidden lg:flex flex-col items-end">
                      <div className="flex items-center gap-2 text-white/80 font-black">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {task.focus_hours}h
                      </div>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Focus Target</span>
                    </div>
                    <button 
                      onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white/40 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5"
                    >
                      <div className="p-8 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                              <Target className="w-3.5 h-3.5" />
                              Objective & Context
                            </h4>
                            <p className="text-blue-100/70 text-lg leading-relaxed font-medium">
                              {task.description || "No detailed description provided for this task."}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5" />
                              Expected Outcome
                            </h4>
                            <p className="text-emerald-100/60 leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">
                              {task.expected_outcome || "Complete this task to progress towards your plan milestones."}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-12">
                          <div className="space-y-4">
                             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Task Metadata</h4>
                             <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <span className="text-xs font-bold text-white/40">Status</span>
                                  <span className={cn("text-xs font-black uppercase tracking-widest", task.completed ? "text-emerald-400" : "text-amber-400")}>
                                    {task.completed ? "Done" : "Pending"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <span className="text-xs font-bold text-white/40">Difficulty</span>
                                  <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                                    AI Optimized
                                  </span>
                                </div>
                             </div>
                          </div>

                          <div className="flex gap-4">
                            <button 
                              onClick={() => openTaskEdit(task)}
                              className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all border border-white/5"
                            >
                              Edit Task
                            </button>
                            <button 
                              onClick={() => setTaskToDelete(task.id)}
                              className="p-4 bg-red-500/5 hover:bg-red-500/10 rounded-2xl text-red-400 transition-all border border-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Completion Celebration (Conditional) */}
      {plan.progress_percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-16 rounded-[4rem] glass border-emerald-500/20 bg-emerald-500/5 text-center space-y-8"
        >
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500/30">
            <Award className="w-12 h-12 text-emerald-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white">Legendary Achievement!</h2>
            <p className="text-xl text-emerald-100/60 max-w-2xl mx-auto leading-relaxed">
              You've successfully completed the entire AI-architected journey for <span className="text-white font-bold">"{plan.title}"</span>. 
              Your consistency and focus are outstanding.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
             <button onClick={() => router.push('/dashboard/analytics')} className="px-12 py-5 bg-emerald-500 text-blue-900 font-black rounded-[2rem] hover:scale-105 transition-all text-lg">
                Analyze Growth
             </button>
             <button onClick={() => router.push('/dashboard/generate-plan')} className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] hover:bg-white/10 transition-all text-lg">
                Architect New Mission
             </button>
          </div>
        </motion.div>
      )}
      {/* Task Update Modal */}
      <Modal 
        isOpen={!!editingTask} 
        onClose={() => setEditingTask(null)}
        title="Update Task Intelligence"
      >
        <form onSubmit={handleUpdateTask} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/40 ml-2 tracking-widest">Task Title</label>
              <input 
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-white/40 ml-2 tracking-widest">Detailed Description</label>
              <textarea 
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/40 ml-2 tracking-widest">Focus Hours</label>
                <input 
                  type="number"
                  step="0.5"
                  value={taskForm.focus_hours}
                  onChange={(e) => setTaskForm({...taskForm, focus_hours: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/40 ml-2 tracking-widest">Priority Level</label>
                <select 
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                >
                  <option value="low" className="bg-[#020817]">Low</option>
                  <option value="medium" className="bg-[#020817]">Medium</option>
                  <option value="high" className="bg-[#020817]">High</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest text-sm">
            Synchronize Changes
          </button>
        </form>
      </Modal>

      {/* Task Delete Confirmation Modal */}
      <Modal 
        isOpen={!!taskToDelete} 
        onClose={() => setTaskToDelete(null)}
        title="Confirm Task Deletion"
      >
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/20">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-blue-100/60 font-medium text-lg leading-relaxed">
            Are you sure you want to remove this task from your roadmap? This action will recalibrate your progress.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setTaskToDelete(null)}
              className="flex-1 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDeleteTask}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-600/20"
            >
              Delete Task
            </button>
          </div>
        </div>
      </Modal>

      {/* Plan Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeletePlanModal} 
        onClose={() => setShowDeletePlanModal(false)}
        title="Destroy Mission Roadmap"
      >
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/20">
            <Layers className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-blue-100/60 font-medium text-lg leading-relaxed">
            Warning: You are about to permanently delete this entire study plan and all associated tasks. This cannot be undone.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowDeletePlanModal(false)}
              className="flex-1 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
            >
              Keep My Plan
            </button>
            <button 
              onClick={confirmDeletePlan}
              className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-600/20"
            >
              Confirm Destruction
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
