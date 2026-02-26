'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, Layout, BarChart2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-block p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm"
        >
          <Sparkles className="w-8 h-8 text-blue-400" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 text-blue-500 tracking-tight">
          Planexa
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-300/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          Your AI-driven study planner. Master your learning journey with intelligent scheduling and personalized growth analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-blue-600 text-blue-50 rounded-full font-black text-lg shadow-xl transition-all duration-300 flex items-center gap-2 group border border-blue-400/30"
            >
              Get Started
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-blue-500/30 text-blue-300 rounded-full font-black text-lg backdrop-blur-sm transition-all duration-300"
            >
              Launch Plan
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4 z-10">
        {[
          { icon: Sparkles, title: "AI-Powered", desc: "Intelligent 3-phased study plan generation." },
          { icon: Layout, title: "Smart Dashboard", desc: "Manage plans, tasks, and todos in one place." },
          { icon: BarChart2, title: "Rich Analytics", desc: "Track progress with interactive charts and insights." }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="p-8 rounded-3xl glass border-blue-500/10 group hover:border-blue-400/30 transition-all duration-500"
          >
            <div className="mb-4 p-3 rounded-2xl bg-blue-500/20 w-fit group-hover:scale-110 transition-transform duration-500">
              <feature.icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-blue-100 mb-2">{feature.title}</h3>
            <p className="text-blue-300/60 leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <footer className="mt-24 py-8 text-blue-400/30 text-sm font-black uppercase tracking-widest">
        © 2026 Planexa • Built for Excellence
      </footer>
    </main>
  );
}
