'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  profession: yup.string().required('Profession is required'),
  otherProfession: yup.string().when('profession', {
    is: 'other',
    then: (schema) => schema.required('Please specify your profession'),
  }),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const profession = watch('profession');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const finalProfession = data.profession === 'other' ? data.otherProfession : data.profession;
      
      // 1. Register
      await api.post('/api/register', {
        name: data.name,
        email: data.email,
        profession: finalProfession,
        password: data.password,
      });

      // 2. Login automatically
      const params = new URLSearchParams();
      params.append('username', data.email);
      params.append('password', data.password);

      const loginRes = await api.post('/api/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      login({
        id: loginRes.data.id,
        name: loginRes.data.username,
        email: data.email,
        profession: loginRes.data.profession,
        role: loginRes.data.role,
      }, loginRes.data.access_token);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-3xl border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-blue-100/60">Join Planexa today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Full Name"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    errors.name && "border-red-500/50 focus:ring-red-500/50"
                  )}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs ml-2">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email Address"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    errors.email && "border-red-500/50 focus:ring-red-500/50"
                  )}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs ml-2">{errors.email.message}</p>}
            </div>

            {/* Profession */}
            <div className="space-y-1">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                <select
                  {...register('profession')}
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    errors.profession && "border-red-500/50 focus:ring-red-500/50"
                  )}
                >
                  <option value="" className="bg-slate-900 text-white/50">Select Profession</option>
                  <option value="student" className="bg-slate-900">Student</option>
                  <option value="teacher" className="bg-slate-900">Teacher</option>
                  <option value="programmer" className="bg-slate-900">Programmer</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>
              {errors.profession && <p className="text-red-400 text-xs ml-2">{errors.profession.message}</p>}
            </div>

            {profession === 'other' && (
              <div className="space-y-1">
                <input
                  {...register('otherProfession')}
                  type="text"
                  placeholder="Specify Profession"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    errors.otherProfession && "border-red-500/50 focus:ring-red-500/50"
                  )}
                />
                {errors.otherProfession && <p className="text-red-400 text-xs ml-2">{errors.otherProfession.message}</p>}
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    errors.password && "border-red-500/50 focus:ring-red-500/50"
                  )}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs ml-2">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm Password"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                    errors.confirmPassword && "border-red-500/50 focus:ring-red-500/50"
                  )}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs ml-2">{errors.confirmPassword.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-100/40 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold ml-1 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
