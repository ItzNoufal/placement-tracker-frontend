import React from 'react';
import { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  detail?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, detail, size = 'md' }: StatusBadgeProps) {
  switch (status) {
    case 'Selected':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shadow-[0_0_12px_rgba(34,197,94,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
          <span>Selected</span>
        </span>
      );

    case 'Interviewing':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/30 text-xs font-semibold shadow-[0_0_12px_rgba(59,130,246,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
          <span>Interviewing</span>
        </span>
      );

    case 'Shortlisted':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 text-xs font-semibold shadow-[0_0_12px_rgba(34,211,238,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee]" />
          <span>Shortlisted</span>
        </span>
      );

    case 'Conflict Alert':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold shadow-[0_0_14px_rgba(239,68,68,0.35)]">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>Conflict Alert</span>
          {detail && <span className="font-mono-code text-[11px] text-red-200">({detail})</span>}
        </span>
      );

    case 'Applied':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Applied</span>
        </span>
      );

    case 'Archived':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>Archived / Inactive</span>
        </span>
      );
  }
}
