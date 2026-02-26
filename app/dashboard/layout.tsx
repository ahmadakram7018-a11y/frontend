'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  BarChart3, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Generate Plan', href: '/dashboard/generate-plan', icon: PlusCircle },
  { label: 'My Plans', href: '/dashboard/my-plans', icon: Library },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'To-Do List', href: '/dashboard/todo', icon: CheckSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Set sidebar open on desktop, closed on mobile initially
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] flex relative">
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1F3C]/95 backdrop-blur-2xl border-r border-blue-500/10 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:bg-[#0A1F3C]/80",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col p-6 relative">
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-6 right-6 p-2 text-blue-400/60 hover:text-blue-300 lg:hidden transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <span className="text-blue-50 font-black text-xl">P</span>
            </div>
            <h1 className="text-xl font-black text-blue-100 tracking-tight">Planexa</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                      active 
                        ? "bg-blue-600 text-blue-50 shadow-lg shadow-blue-600/20 border border-blue-400/30" 
                        : "text-blue-400/60 hover:bg-blue-500/10 hover:text-blue-200"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", active ? "text-blue-50" : "text-blue-500/40 group-hover:text-blue-400")} />
                    <span className="font-bold tracking-tight">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Admin Dashboard Link */}
            {user?.role === 'admin' && (
              <Link href="/admin">
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-blue-400/60 hover:bg-blue-500/10 hover:text-blue-200 mt-4 border border-dashed border-blue-500/20"
                >
                  <ShieldCheck className="w-5 h-5 text-blue-500/40 group-hover:text-blue-400" />
                  <span className="font-bold tracking-tight">Admin Dashboard</span>
                </motion.div>
              </Link>
            )}
          </nav>

          <div className="mt-auto space-y-2">
            <button 
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-blue-400/60 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              <span className="font-bold tracking-tight">Logout</span>
            </button>
            
            <div className="p-4 rounded-3xl bg-blue-500/5 border border-blue-500/10 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center border-2 border-blue-400/20">
                  <User className="w-5 h-5 text-blue-50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-blue-100 truncate">{user?.name}</p>
                  <p className="text-xs text-blue-400/50 truncate font-bold uppercase tracking-widest">{user?.profession}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header 
          className={cn(
            "h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40 transition-all duration-300",
            scrolled ? "bg-[#020617]/80 backdrop-blur-md border-b border-blue-500/10" : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-blue-400/60 hover:text-blue-300 transition-colors">
              <Menu />
            </button>
          </div>

          <div className="hidden md:flex items-center bg-blue-500/5 border border-blue-500/10 rounded-2xl px-4 py-2 w-96 group focus-within:border-blue-500/50 transition-all">
            <Search className="w-4 h-4 text-blue-500/40 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search plans, tasks..." 
              className="bg-transparent border-none focus:ring-0 text-blue-100 text-sm placeholder:text-blue-500/40 ml-2 w-full font-bold"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 text-blue-400/60 hover:text-blue-300 transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]" />
            </button>
            <div className="w-[1px] h-6 bg-blue-500/10 mx-1 sm:mx-2" />
            <button className="p-2 text-blue-400/60 hover:text-blue-300 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
