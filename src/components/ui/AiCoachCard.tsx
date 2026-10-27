'use client';

import React, { useState } from 'react';

interface AiCoachCardProps {
  upcomingCompany?: string;
  interviewCount?: number;
}

export default function AiCoachCard({ upcomingCompany, interviewCount = 0 }: AiCoachCardProps) {
  const [started, setStarted] = useState(false);

  const heading = upcomingCompany
    ? `Priority Focus: Review System Design & Concurrency before ${upcomingCompany} round.`
    : `Priority Focus: Build core DSA & CS fundamentals for upcoming drives.`;

  const description = upcomingCompany
    ? `Historical placement telemetry indicates candidate conversion rises by +24% when system trade-offs and edge-cases are articulated clearly.`
    : `Consistent preparation habits across Data Structures, Algorithms, and System Design build compounding momentum for placement season.`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#151f32] via-[#111827] to-[#151f32] p-5 lg:p-6 border border-[#3b82f6]/30 shadow-xl flex flex-col gap-4 animate-in fade-in">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#22d3ee]/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center border border-[#3b82f6]/30 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] font-mono-code">
              AI Placement Coach
            </span>
            <span className="text-[11px] text-slate-400">Personalized Strategy Recommendation</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 text-[10px] font-mono-code font-bold uppercase">
          Live Model
        </span>
      </div>

      {/* Core Diagnostic Callout */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <h4 className="text-sm font-bold text-white font-display leading-snug">
          {heading}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div className="relative z-10 pt-1">
        <button
          onClick={() => setStarted(!started)}
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">
            {started ? 'check_circle' : 'bolt'}
          </span>
          <span>
            {started ? 'Revision Drill Active (45m Session)' : 'Start 45-Min Revision Plan'}
          </span>
        </button>
      </div>
    </div>
  );
}
