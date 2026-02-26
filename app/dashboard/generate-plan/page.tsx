'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ListTodo, 
  Settings2, 
  Cpu, 
  Clock,
  CheckCircle,
  Calendar,
  Layers,
  Target,
  Award,
  Zap,
  Star
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Step = 'mode_selection' | 'discovery' | 'student_form' | 'logistics' | 'generation' | 'success';

export default function GeneratePlanPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>('mode_selection');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [logisticsFields, setLogisticsFields] = useState<any[]>([]);
  const [confirmedLogistics, setConfirmedLogistics] = useState<Record<string, any>>({});
  const [studentFormData, setStudentFormData] = useState<any>({
    goal: '',
    available_hours: 2,
    deadline: '',
    subject: '',
    topic: ''
  });
  const [finalPlan, setFinalPlan] = useState<any>(null);

  const startProfessionalFlow = async () => {
    setLoading(true);
    setStep('discovery');
    try {
      const res = await api.post('/api/planner/questions', { answers: {} });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error('Failed to fetch initial questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('generation');
    try {
      const res = await api.post('/api/planner/student-plan', studentFormData);
      setFinalPlan(res.data);
      setStep('success');
    } catch (err) {
      console.error('Student plan generation failed:', err);
      setStep('student_form');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (phase === 1) {
        // Move to phase 2: follow-up questions
        const res = await api.post('/api/planner/questions', { answers });
        if (res.data.questions && res.data.questions.length > 0) {
          setQuestions([...questions, ...res.data.questions]);
          setPhase(2);
        } else {
          // No follow-ups? Go to logistics directly
          await fetchLogistics();
        }
      } else {
        // Move to Phase 2: Logistics Extraction
        await fetchLogistics();
      }
    } catch (err) {
      console.error('Discovery submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogistics = async () => {
    const res = await api.post('/api/planner/derive-inputs', { answers });
    setLogisticsFields(res.data.derived_inputs);
    setStep('logistics');
  };

  const handleLogisticsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('generation');
    try {
      const res = await api.post('/api/planner/generate-final-plan', {
        profession: user?.profession,
        answers,
        confirmed_inputs: confirmedLogistics
      });
      setFinalPlan(res.data);
      setStep('success');
    } catch (err) {
      console.error('Plan generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12 gap-4">
      {[
        { id: 'discovery', label: 'Discovery', icon: Target },
        { id: 'logistics', label: 'Logistics', icon: Settings2 },
        { id: 'generation', label: 'AI Architect', icon: Cpu },
      ].map((s, idx) => {
        const Icon = s.icon;
        const active = step === s.id;
        const completed = (idx === 0 && step !== 'discovery') || (idx === 1 && (step === 'generation' || step === 'success'));
        
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500",
              active ? "bg-blue-600 border-blue-400 text-blue-50 shadow-lg shadow-blue-600/20 scale-110" : 
              completed ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-500/5 border-blue-500/5 text-blue-400/20"
            )}>
              {completed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              <span className="font-black text-[10px] tracking-widest uppercase">{s.label}</span>
            </div>
            {idx < 2 && <div className="w-8 h-[2px] bg-blue-500/10 rounded-full" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {step !== 'success' && step !== 'mode_selection' && renderStepIndicator()}

      <AnimatePresence mode="wait">
        {step === 'mode_selection' && (
          <motion.div
            key="mode_selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 py-12"
          >
            <div className="space-y-4">
               <h1 className="text-5xl font-black text-blue-100 tracking-tight">How should we architect?</h1>
               <p className="text-xl text-blue-400/40 font-bold uppercase tracking-wide">Select the planning intelligence level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startProfessionalFlow}
                  className="glass p-12 rounded-[3.5rem] border-blue-500/10 hover:border-blue-400/40 text-left space-y-6 group"
               >
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 transition-all border border-blue-500/20">
                     <Target className="w-8 h-8 text-blue-400 group-hover:text-blue-50" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-blue-100">Professional Mode</h3>
                    <p className="text-blue-400/50 font-medium text-lg leading-relaxed">
                      Deep discovery pipeline with 3-phased AI analysis. Ideal for career growth and complex missions.
                    </p>
                  </div>
               </motion.button>

               <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('student_form')}
                  className="glass p-12 rounded-[3.5rem] border-blue-500/10 hover:border-blue-400/40 text-left space-y-6 group"
               >
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 transition-all border border-blue-500/20">
                     <Award className="w-8 h-8 text-blue-400 group-hover:text-blue-50" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-blue-100">Academic Flow</h3>
                    <p className="text-blue-400/50 font-medium text-lg leading-relaxed">
                      Streamlined rapid planning for specific exams, subjects, or academic milestones.
                    </p>
                  </div>
               </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'student_form' && (
          <motion.div
            key="student_form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 rounded-[3rem] border-blue-500/10"
          >
             <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-blue-100">Academic Details</h2>
                <p className="text-blue-400/40 font-black uppercase tracking-widest text-[10px]">Single Phase Flow</p>
              </div>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-blue-400/40 uppercase tracking-widest ml-1">Learning Goal</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g., Master Quantum Physics Chapter 1"
                      className="w-full bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-blue-100 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                      onChange={(e) => setStudentFormData({ ...studentFormData, goal: e.target.value })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-400/40 uppercase tracking-widest ml-1">Deadline Date</label>
                    <input 
                      required
                      type="date"
                      className="w-full bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-blue-100 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                      onChange={(e) => setStudentFormData({ ...studentFormData, deadline: e.target.value })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-400/40 uppercase tracking-widest ml-1">Daily Capacity (Hours)</label>
                    <input 
                      required
                      type="number"
                      defaultValue={2}
                      className="w-full bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-blue-100 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold"
                      onChange={(e) => setStudentFormData({ ...studentFormData, available_hours: parseInt(e.target.value) })}
                    />
                 </div>
              </div>

              <div className="flex gap-4">
                 <button type="button" onClick={() => setStep('mode_selection')} className="px-8 py-5 border border-blue-500/10 text-blue-400 font-black rounded-3xl hover:bg-blue-500/10 transition-all uppercase tracking-widest text-xs">Back</button>
                 <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="flex-1 bg-blue-600 text-blue-50 font-black py-5 rounded-3xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 border border-blue-400/20"
                 >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Architect Plan"}
                    {!loading && <Award className="w-6 h-6" />}
                 </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 rounded-[3rem] border-blue-500/10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-blue-100">Discovery Phase</h2>
                <p className="text-blue-400/40 font-black uppercase tracking-widest text-[10px]">Phase {phase} of 2</p>
              </div>
            </div>

            <form onSubmit={handleDiscoverySubmit} className="space-y-8">
              {questions.filter(q => (phase === 1 ? q.id <= 3 : q.id > 3)).map((q) => (
                <div key={q.id} className="space-y-3">
                  <label className="text-lg font-black text-blue-100 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black">{q.id}</span>
                    {q.question}
                  </label>
                  <p className="text-xs font-bold text-blue-400/40 ml-11 uppercase tracking-widest">{q.hint}</p>
                  <textarea
                    required
                    value={answers[q.id.toString()] || ''}
                    onChange={(e) => setAnswers({ ...answers, [q.id.toString()]: e.target.value })}
                    className="w-full bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 text-blue-100 placeholder:text-blue-500/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[120px] font-bold"
                    placeholder="Provide your professional context..."
                  />
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-blue-50 font-black py-5 rounded-3xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-lg border border-blue-400/20"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (phase === 1 ? "Next Step" : "Analyze Goals")}
                {!loading && <ArrowRight className="w-6 h-6" />}
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === 'logistics' && (
          <motion.div
            key="logistics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 rounded-[3rem] border-blue-500/10"
          >
             <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                <Settings2 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-blue-100">Refine Logistics</h2>
                <p className="text-blue-400/40 font-black uppercase tracking-widest text-[10px]">Plan Parameters</p>
              </div>
            </div>

            <form onSubmit={handleLogisticsSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {logisticsFields.map((field) => (
                  <div key={field.id} className="space-y-3">
                    <label className="text-[10px] font-black text-blue-400/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                      {field.field_name.replace(/_/g, ' ')}
                    </label>
                    <div className="relative group">
                      <input
                        required
                        type={field.type === 'date' ? 'date' : 'text'}
                        defaultValue={field.value}
                        onChange={(e) => setConfirmedLogistics({ ...confirmedLogistics, [field.field_name]: e.target.value })}
                        className="w-full bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 text-blue-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all group-hover:border-blue-400/20 font-bold"
                        placeholder={field.hint}
                      />
                    </div>
                    <p className="text-[9px] text-blue-400/30 ml-1 font-black uppercase tracking-widest">{field.hint}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep('discovery')}
                  className="px-8 py-5 border border-blue-500/10 text-blue-400 font-black rounded-3xl hover:bg-blue-500/10 transition-all uppercase tracking-widest text-xs"
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className="flex-1 bg-blue-600 text-blue-50 font-black py-5 rounded-3xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-lg border border-blue-400/20"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Architect My Plan"}
                  {!loading && <Sparkles className="w-6 h-6" />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'generation' && (
          <motion.div
            key="generation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
              <div className="relative w-40 h-40 flex items-center justify-center">
                <Cpu className="w-20 h-20 text-blue-400 animate-bounce" />
                <div className="absolute inset-0 border-[6px] border-blue-500/10 rounded-full border-t-blue-500 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-blue-100 mb-4 tracking-tight uppercase">AI Architecting...</h2>
            <p className="text-lg text-blue-400/60 max-w-md mx-auto leading-relaxed font-bold">
              Synthesizing your professional roadmap using deep-learning models.
            </p>

            <div className="mt-12 flex gap-4">
              {[
                { icon: Layers, label: "Generating Tasks" },
                { icon: Calendar, label: "Optimizing Dates" },
                { icon: CheckCircle, label: "Final Validation" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 p-6 rounded-3xl glass border-blue-500/10">
                  <item.icon className="w-8 h-8 text-blue-500" />
                  <span className="text-[10px] font-black text-blue-400/40 uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-16 rounded-[4rem] text-center relative overflow-hidden border-blue-500/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-blue-500/30">
                <CheckCircle2 className="w-12 h-12 text-blue-400" />
              </div>
              
              <h2 className="text-5xl font-black text-blue-100 mb-4">Plan Architected!</h2>
              <p className="text-xl text-blue-400/60 mb-12 max-w-lg mx-auto leading-relaxed font-bold">
                Your professional study journey <span className="text-blue-200">"{finalPlan?.title}"</span> has been generated and synchronized.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push(`/dashboard/my-plans`)}
                  className="px-12 py-5 bg-blue-600 text-blue-50 font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg flex items-center justify-center gap-3 border border-blue-400/20"
                >
                  View Full Plan
                  <ListTodo className="w-6 h-6" />
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-12 py-5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black rounded-[2rem] hover:bg-blue-500/20 transition-all text-lg"
                >
                  Generate Another
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
