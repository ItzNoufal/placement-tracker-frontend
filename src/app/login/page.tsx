'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setPassword(''), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch {
      setIsLoading(false);
      setError('Incorrect email or password, or the backend is not running.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-[#22d3ee]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] flex items-center justify-center shadow-lg shadow-blue-500/30 text-white mb-3">
            <span className="material-symbols-outlined text-[28px]">roofing</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            Apex Placement Console
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Executive Career Orchestration &amp; Recruitment Hub
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="rounded-2xl bg-[#111827]/90 backdrop-blur-xl border border-slate-800 p-7 shadow-2xl flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Identifier */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Roll No / University Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  mail
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. 21BCS1084 or student@univ.edu"
                  className="w-full h-11 bg-[#080e1b] rounded-lg pl-10 pr-4 text-xs text-white placeholder:text-slate-500 border border-slate-700/80 focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                  Master Password
                </label>
                <Link
                  href="#forgot"
                  className="text-[11px] text-[#22d3ee] hover:underline font-mono-code"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 bg-[#080e1b] rounded-lg pl-10 pr-10 text-xs text-white placeholder:text-slate-500 border border-slate-700/80 focus:outline-none focus:border-[#3b82f6] transition-colors font-mono-code"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Utilities Row: Remember */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded bg-[#080e1b] accent-[#3b82f6] cursor-pointer"
                />
                <span className="text-xs text-slate-400">Remember this device</span>
              </label>

              <span className="text-[11px] text-emerald-400 font-mono-code flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Session Ready
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full h-11 rounded-lg bg-gradient-to-r from-[#3b82f6] via-[#3b82f6] to-[#22d3ee] hover:from-blue-600 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 font-mono-code">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>AUTHORIZING...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    <span>Redirecting to Console...</span>
                  </div>
                ) : (
                  <>
                    <span>Login to Console</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Account Switcher Banner */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-[#22d3ee] font-semibold hover:underline ml-1 inline-flex items-center gap-0.5"
              >
                <span>Register student onboarding</span>
                <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footprint Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-slate-800/80 shadow-sm text-slate-400 text-[11px] font-mono-code">
            <span className="material-symbols-outlined text-[#22d3ee] text-[15px]">
              verified_user
            </span>
            <span>
              Protected with <strong className="text-slate-200">Spring Boot JWT</strong> &amp;{' '}
              <strong className="text-slate-200">AES-256</strong> Encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
