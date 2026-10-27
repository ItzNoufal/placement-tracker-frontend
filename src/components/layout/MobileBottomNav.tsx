'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileBottomNavProps {
  onQuickAdd?: () => void;
}

export default function MobileBottomNav({ onQuickAdd }: MobileBottomNavProps) {
  const pathname = usePathname();

  const mobileTabs = [
    { label: 'Overview', path: '/', icon: 'space_dashboard' },
    { label: 'Companies', path: '/companies', icon: 'domain' },
    { label: 'Applied', path: '/applications', icon: 'work' },
    { label: 'Interviews', path: '/interviews', icon: 'event' },
    { label: 'Progress', path: '/progress', icon: 'trending_up' },
  ];

  return (
    <>
      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <button
          onClick={onQuickAdd}
          className="flex items-center justify-center w-13 h-13 w-[52px] h-[52px] rounded-full bg-[#3b82f6] text-white shadow-[0_8px_24px_rgba(59,130,246,0.45)] hover:bg-blue-600 active:scale-95 transition-all"
          type="button"
          aria-label="Quick Add"
        >
          <span className="material-symbols-outlined text-[26px]">add</span>
        </button>
      </div>

      {/* Fixed Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080e1b]/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] lg:hidden">
        <div className="h-16 px-2 flex items-center justify-around">
          {mobileTabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
                  isActive ? 'text-[#22d3ee] font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
