'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, hasSession } from '@/lib/api';

interface HeaderProps {
  onToggleSidebar: () => void;
  onSearchChange?: (query: string) => void;
}

export default function Header({ onToggleSidebar, onSearchChange }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; studentId: number } | null>(null);

  useEffect(() => {
    const updateUser = () => {
      setUser(getCurrentUser());
    };
    updateUser();

    window.addEventListener('auth-change', updateUser);
    return () => window.removeEventListener('auth-change', updateUser);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (onSearchChange) onSearchChange(q);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[72px] bg-[#0d1320]/90 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:px-7 border-b border-slate-800/80">
      {/* Left Area: Mobile Drawer Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:bg-[#151f32] hover:text-white transition-colors"
          type="button"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="relative flex items-center w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-slate-400 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search companies, roles, applications..."
            className="w-full h-10 pl-11 pr-4 rounded-lg bg-[#111827]/90 border border-slate-700/60 text-slate-200 placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
          />
        </div>
      </div>

      {/* Right Area: Notifications & Profile Pill */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#111827]/70 border border-slate-700/50 text-slate-300 hover:bg-[#151f32] hover:text-white transition-colors"
            type="button"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#22d3ee] ring-2 ring-[#0d1320]" />
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#151f32] border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[13px] font-bold text-white uppercase tracking-wider font-display">
                  Placement Alerts
                </span>
                <span className="text-[11px] text-[#22d3ee] font-mono-code font-semibold">Active</span>
              </div>
              <div className="py-2 flex flex-col gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/25 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#60a5fa]">Placement Session Active</span>
                    <span className="text-[10px] text-slate-400">Live</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Connected to campus placement database. All applications sync seamlessly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800 hover:opacity-90 transition-opacity"
            type="button"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[13px] text-white font-bold leading-tight font-display">
                {user?.name || 'Student Account'}
              </span>
              <span className="font-mono-code text-[11px] text-[#22d3ee]/90 font-medium truncate max-w-[140px]">
                {user?.email || 'Logged In'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#22d3ee] flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#3b82f6]/50 shadow-sm shrink-0 font-display">
              {initials}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#151f32] border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col gap-2">
              <div className="p-2 rounded-lg bg-[#0d1320] border border-slate-800">
                <p className="text-xs font-bold text-white font-display truncate">
                  {user?.name || 'Candidate'}
                </p>
                <p className="text-[11px] text-slate-400 font-mono-code truncate">
                  {user?.email || 'student@university.edu'}
                </p>
              </div>

              <button
                onClick={handleLogout}
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out &amp; Lock Console</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
