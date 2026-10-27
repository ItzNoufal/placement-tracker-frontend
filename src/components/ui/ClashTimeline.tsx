'use client';

import React from 'react';

interface ClashTimelineProps {
  onOpenReschedule: () => void;
  onViewDetails?: () => void;
  companyA?: string;
  timeA?: string;
  companyB?: string;
  timeB?: string;
  overlapMinutes?: number;
}

export default function ClashTimeline({
  onOpenReschedule,
  onViewDetails,
  companyA = 'Google',
  timeA = '11:00 AM – 12:00 PM',
  companyB = 'YUV',
  timeB = '11:45 AM – 12:45 PM',
  overlapMinutes = 15,
}: ClashTimelineProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-[#111827] via-[#151f32] to-[#111827] border border-red-500/40 p-5 lg:p-6 shadow-xl relative overflow-hidden animate-in fade-in">
      {/* Background ambient crimson glow */}
      <div className="absolute top-0 right-0 w-72 h-full bg-red-500/15 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Left info */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(239,68,68,0.4)]">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-base font-bold text-white font-display">
                Schedule Conflict Detected
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-mono-code font-bold uppercase tracking-wider animate-pulse">
                Action Recommended
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              <strong className="text-white">{companyA} ({timeA})</strong> clashes with{' '}
              <strong className="text-[#22d3ee]">{companyB} ({timeB})</strong>.{' '}
              <span className="text-red-400 font-bold font-mono-code">{overlapMinutes}-minute collision detected</span>.
            </p>
          </div>
        </div>

        {/* Visual Timeline Track */}
        <div className="w-full lg:w-96 bg-[#080e1b]/90 backdrop-blur rounded-xl p-3 border border-slate-800 shrink-0 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[11px] font-mono-code text-slate-400">
            <span>{timeA.split('–')[0].split('-')[0].trim()}</span>
            <span className="text-red-400 font-bold">CLASH DETECTED</span>
            <span>{timeB.split('–')[1]?.split('-')[1]?.trim() || timeB.split('–')[0]}</span>
          </div>

          {/* Timeline Track */}
          <div className="relative h-8 w-full bg-[#151f32] rounded-lg overflow-hidden flex items-center">
            <div className="absolute left-[10%] w-[50%] h-6 bg-[#3b82f6]/25 rounded text-[#3b82f6] text-[10px] font-mono-code font-bold flex items-center px-2 z-10 truncate">
              {companyA}
            </div>

            <div className="absolute left-[45%] w-[45%] h-6 bg-[#22d3ee]/20 rounded text-[#22d3ee] text-[10px] font-mono-code font-bold flex items-center justify-end px-2 z-10 truncate">
              {companyB}
            </div>

            <div className="absolute left-[45%] w-[25%] h-7 bg-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.7)] z-20 rounded border border-red-400 flex items-center justify-center">
              <span className="text-[10px] font-mono-code text-white font-extrabold uppercase tracking-tight">
                {overlapMinutes}m Overlap
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Action Bar */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenReschedule}
            type="button"
            className="h-9 px-4 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] hover:from-blue-600 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_16px_rgba(59,130,246,0.35)] transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
            <span>Reschedule {companyB} (Auto-Draft Request)</span>
          </button>
        </div>

        <span className="text-[11px] font-mono-code text-slate-400">
          Sync Status: <span className="text-emerald-400">TPO Protected</span>
        </span>
      </div>
    </section>
  );
}
