import React from 'react';
import { InterviewRound } from '@/types';

interface InterviewCardProps {
  interview: InterviewRound;
  onReschedule?: () => void;
  onOpenNotes?: () => void;
  onDelete?: () => void;
}

export default function InterviewCard({
  interview,
  onReschedule,
  onOpenNotes,
  onDelete,
}: InterviewCardProps) {
  const isClash = interview.hasClash;

  return (
    <div
      className={`rounded-xl p-4 lg:p-5 border shadow-sm transition-all relative overflow-hidden flex flex-col gap-4 ${
        isClash
          ? 'bg-[#151f32]/90 border-red-500/40 hover:border-red-400 ring-1 ring-red-500/20'
          : 'bg-[#151f32] border-slate-800 hover:border-slate-700 hover:bg-[#1f293d]/50'
      }`}
    >
      {/* Accent Notch */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isClash ? 'bg-red-500' : 'bg-[#3b82f6]'
        }`}
      />

      {/* Main Top Content */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pl-1">
        <div className="flex items-start gap-3.5">
          {/* Company Monogram */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base font-display shrink-0 border ${
              isClash
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-[#242a38] border-slate-700 text-[#3b82f6]'
            }`}
          >
            {interview.companyInitials}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-white font-display">
                {interview.company}
              </span>
              <span className="px-2 py-0.5 rounded text-[#d0bcff] bg-[#d0bcff]/15 border border-[#d0bcff]/25 text-[11px] font-mono-code font-semibold">
                Round {interview.roundNumber}
              </span>

              {isClash && (
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Clash Alert ({interview.overlapDuration})
                </span>
              )}
            </div>

            <span className="text-xs text-slate-300 mt-1 font-sans">
              {interview.roundName}
            </span>

            {interview.topics && (
              <span className="text-[11px] text-slate-400 mt-1 font-mono-code">
                Focus: {interview.topics}
              </span>
            )}
          </div>
        </div>

        {/* Date / Status Tag */}
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono-code shrink-0 self-start sm:self-auto ${
            isClash
              ? 'bg-red-500/15 text-red-300 border border-red-500/30'
              : 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/25'
          }`}
        >
          {interview.date}
        </span>
      </div>

      {/* Timing and Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 pl-1">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono-code">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#22d3ee]">schedule</span>
            <span className="text-white font-semibold">{interview.timeSlot}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="material-symbols-outlined text-[16px] text-[#3b82f6]">videocam</span>
            <span>{interview.platform}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {isClash ? (
            <button
              onClick={onReschedule}
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">auto_fix_high</span>
              <span>Resolve Clash</span>
            </button>
          ) : (
            <>
              <button
                onClick={onOpenNotes}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-[#242a38] text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                Prep Notes
              </button>
              <a
                href="#join"
                className="px-3.5 py-1.5 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span>Join Meeting</span>
              </a>
            </>
          )}

          {/* Delete button — always visible */}
          {onDelete && (
            <button
              onClick={onDelete}
              type="button"
              title="Delete interview"
              className="p-1.5 rounded-lg bg-[#1f1420] hover:bg-red-500/20 border border-slate-700/60 hover:border-red-500/40 text-slate-500 hover:text-red-400 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
