import React from 'react';
import { CompanyDrive } from '@/types';

interface CompanyDriveCardProps {
  company: CompanyDrive;
  onSelect?: () => void;
}

export default function CompanyDriveCard({ company, onSelect }: CompanyDriveCardProps) {
  const getAccentColor = () => {
    switch (company.statusColor) {
      case 'emerald':
        return 'bg-emerald-400';
      case 'tertiary':
        return 'bg-[#8b5cf6]';
      case 'primary':
        return 'bg-[#3b82f6]';
      case 'secondary':
      default:
        return 'bg-[#22d3ee]';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#111827] p-5 border border-slate-800/90 shadow-md hover:shadow-xl hover:bg-[#151f32] hover:border-slate-700 transition-all flex flex-col justify-between group">
      {/* Left accent notch */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getAccentColor()}`} />

      <div className="pl-2">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#151f32] border border-slate-700/80 flex items-center justify-center p-2 shadow-inner text-[#22d3ee]">
              <span className="material-symbols-outlined text-[24px]">
                {company.logoIcon}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white group-hover:text-[#22d3ee] transition-colors font-display">
                  {company.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#1f293d] font-mono-code text-[10px] text-[#22d3ee] uppercase font-bold">
                  {company.category}
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                {company.industry}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="text-slate-500 hover:text-white transition-colors p-1"
            title="Bookmark Drive"
          >
            <span className="material-symbols-outlined text-[18px]">
              {company.isPinned ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>

        {/* Location tag */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-sans">
          <span className="material-symbols-outlined text-[15px] text-slate-500">
            location_on
          </span>
          <span>{company.locations}</span>
        </div>

        {/* Specs Box */}
        <div className="mt-3 pt-3 flex flex-col gap-2 bg-[#0d1320] border border-slate-800/80 rounded-lg p-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Roles Open:</span>
            <span
              className="text-white font-medium text-right truncate max-w-[180px]"
              title={company.rolesOpen.join(', ')}
            >
              {company.rolesOpen.join(', ')}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">CTC Package:</span>
            <span className="font-mono-code text-[#22d3ee] font-bold">
              {company.ctcRange}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Eligibility:</span>
            <span className="font-mono-code text-slate-200">
              CGPA ≥ {company.eligibilityCgpa.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151f32] text-xs font-semibold text-slate-200 border border-slate-700/60">
            <span
              className={`w-2 h-2 rounded-full ${
                company.statusColor === 'emerald'
                  ? 'bg-emerald-400'
                  : company.statusColor === 'secondary'
                  ? 'bg-[#22d3ee] animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                  : 'bg-[#3b82f6]'
              }`}
            />
            <span>{company.status}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pl-2">
        <button
          onClick={onSelect}
          type="button"
          className="w-full h-10 rounded-lg bg-[#151f32] hover:bg-[#3b82f6] text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-700/80 hover:border-transparent shadow-sm"
        >
          <span>View Application History & Details</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
