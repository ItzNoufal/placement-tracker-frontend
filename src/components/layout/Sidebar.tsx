'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const navItems = [
  { label: 'Dashboard', path: '/', icon: 'grid_view' },
  { label: 'Companies', path: '/companies', icon: 'domain' },
  { label: 'Applications', path: '/applications', icon: 'work' },
  { label: 'Interviews', path: '/interviews', icon: 'schedule' },
  { label: 'Feedback', path: '/feedback', icon: 'chat' },
  { label: 'Progress', path: '/progress', icon: 'insights' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    onClose();
    logout();
    router.replace('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-[#080e1b] z-50 flex flex-col justify-between transition-transform duration-300 border-r border-slate-800/80 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* App Brand Logo */}
          <div className="h-[72px] px-6 flex items-center justify-between border-b border-slate-800/60 bg-[#080e1b]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] flex items-center justify-center shadow-md shadow-blue-500/25 text-white font-bold">
                <span className="material-symbols-outlined text-[22px]">roofing</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] tracking-wider text-white uppercase leading-none font-display">
                  Placement
                </span>
                <span className="font-mono-code text-[11px] tracking-widest text-[#22d3ee] uppercase font-semibold mt-1">
                  Tracker Console
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Main Navigation Links */}
          <div className="px-4 py-4">
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#3b82f6] text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:bg-[#151f32] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-105 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#22d3ee]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Logout */}
        <div className="px-4 py-4 border-t border-slate-800/60 bg-[#080e1b]">
          <nav className="flex flex-col gap-1">
            <button
              onClick={handleLogout}
              type="button"
              className="w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:text-red-400">
                logout
              </span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
