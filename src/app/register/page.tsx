'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState('Rohan Verma');
  const [email, setEmail] = useState('rohan.verma@univ.edu');
  const [password, setPassword] = useState('ApexSecure2025!');
  const [confirmPassword, setConfirmPassword] = useState('ApexSecure2025!');
  const [college, setCollege] = useState('National Institute of Technology (NIT)');
  const [gradYear, setGradYear] = useState('2025');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState('8.9');
  const [agreed, setAgreed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMatch = password && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch || !agreed) return;
    setIsLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      router.push('/');
    } catch {
      setError('Could not create this account. The email may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 text-xs font-semibold font-mono-code">
            Student Onboarding
          </span>
          <span className="text-xs text-slate-400 font-mono-code">Cycle 2024-25</span>
        </div>
        <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display mt-1">
          Create Placement Account
        </h1>
        <p className="text-sm text-slate-400 font-sans">
          Calibrate your academic credentials, TPO tracking index, and recruitment telemetry profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section 1: Account & Security Credentials */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <h2 className="text-base font-bold text-white font-display">
                Section 1: Security &amp; Candidate Credentials
              </h2>
            </div>
            <span className="text-xs font-mono-code text-[#3b82f6]">Account Access</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Full Name *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  className="w-full h-11 bg-[#080e1b] rounded-lg pl-10 pr-4 text-xs text-white border border-slate-700/80 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Official University Email *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  school
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohan.verma@univ.edu"
                  className="w-full h-11 bg-[#080e1b] rounded-lg pl-10 pr-4 text-xs text-white border border-slate-700/80 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
          </div>

          {/* Password & Strength Meter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Create Master Password *
              </label>
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
                  className="w-full h-11 bg-[#080e1b] rounded-lg pl-10 pr-10 text-xs text-white border border-slate-700/80 focus:outline-none focus:border-[#3b82f6] font-mono-code"
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

              {/* 3-Segment Strength Meter */}
              <div className="w-full h-1.5 rounded-full overflow-hidden mt-1 flex gap-1 bg-[#151f32]">
                <div
                  className={`h-full w-1/3 rounded-full transition-colors ${hasMinLength ? 'bg-[#3b82f6]' : 'bg-slate-700'
                    }`}
                />
                <div
                  className={`h-full w-1/3 rounded-full transition-colors ${hasMinLength && hasUppercase ? 'bg-[#22d3ee]' : 'bg-slate-700'
                    }`}
                />
                <div
                  className={`h-full w-1/3 rounded-full transition-colors ${hasMinLength && hasUppercase && hasSpecialSymbol
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                    }`}
                />
              </div>

              {/* Rules Checklist */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-mono-code">
                <span
                  className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" /> 8+ Chars
                </span>
                <span
                  className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" /> Uppercase
                </span>
                <span
                  className={`flex items-center gap-1 ${hasSpecialSymbol ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" /> Special Symbol
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Confirm Master Password *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  verified
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 bg-[#080e1b] rounded-lg pl-10 pr-4 text-xs text-white border border-slate-700/80 focus:outline-none focus:border-[#3b82f6] font-mono-code"
                />
              </div>

              <div className="h-5 flex items-center gap-1.5 text-xs text-slate-400 font-mono-code mt-1">
                <span className="material-symbols-outlined text-[14px]">
                  {isMatch ? 'check_circle' : 'info'}
                </span>
                <span className={isMatch ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {isMatch ? 'Passwords correspond correctly' : 'Both passwords must correspond'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Profile & Department */}
        <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee]" />
              <h2 className="text-base font-bold text-white font-display">
                Section 2: Academic Profile &amp; Department
              </h2>
            </div>
            <span className="text-xs font-mono-code text-[#22d3ee]">Campus Calibration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-7">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                College / University Name *
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. IIT, NIT, BITS"
                className="h-11 px-4 rounded-lg bg-[#080e1b] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Graduation Year *
              </label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="h-11 px-3 rounded-lg bg-[#080e1b] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="2025">Class of 2025 (Immediate)</option>
                <option value="2026">Class of 2026 (Pre-final)</option>
                <option value="2027">Class of 2027</option>
                <option value="2028">Class of 2028</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-8">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Branch / Specialization *
              </label>
              <input
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="h-11 px-4 rounded-lg bg-[#080e1b] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-4">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                CGPA / %
              </label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.9 / 10"
                className="h-11 px-4 rounded-lg bg-[#080e1b] border border-slate-700/80 text-xs text-white focus:outline-none focus:border-[#3b82f6] font-mono-code"
              />
            </div>
          </div>
        </div>

        {/* Consent & Submit */}
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-0.5 w-4 h-4 rounded bg-[#080e1b] accent-[#3b82f6] cursor-pointer"
            />
            <span className="text-xs text-slate-300">
              I agree to the{' '}
              <span className="text-[#3b82f6] underline">Placement Cell privacy terms</span> and
              authorized campus recruiter data sharing protocols.
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] hover:from-blue-600 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{isLoading ? 'Creating account...' : 'Create Placement Account'}</span>
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </button>

          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-[#3b82f6] transition-colors flex items-center gap-1 font-sans"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Already have an account? Back to Login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
