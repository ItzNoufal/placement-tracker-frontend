import React from 'react';
import { DebriefScorecard as DebriefType } from '@/types';

interface DebriefScorecardProps {
  scorecard: DebriefType;
  onViewAudit?: () => void;
}

export default function DebriefScorecard({ scorecard, onViewAudit }: DebriefScorecardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-[#111827] p-5 lg:p-6 border border-slate-800/90 shadow-md transition-all hover:bg-[#151f32] hover:border-slate-700 group flex flex-col gap-4">
      {/* Left accent notch */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#22d3ee] shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 pl-2">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#151f32] border border-slate-700/80 flex items-center justify-center font-display font-extrabold text-lg text-[#22d3ee] shadow-sm">
            {scorecard.initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">
                {scorecard.company}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] font-mono-code text-[11px] font-semibold border border-[#22d3ee]/25">
                {scorecard.roundType}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span>{scorecard.evaluator}</span>
              <span>•</span>
              <span className="font-mono-code text-slate-400">{scorecard.date}</span>
            </div>
          </div>
        </div>

        {/* Rating Pill */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 bg-[#151f32] px-3 py-1 rounded-lg border border-slate-700/80 shadow-inner">
            <span
              className="material-symbols-outlined text-[#22d3ee] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-mono-code font-bold text-base text-white">
              {scorecard.rating.toFixed(1)}
            </span>
            <span className="font-mono-code text-xs text-slate-500">/ 5.0</span>
          </div>
          <span className="text-[11px] text-[#22d3ee] font-mono-code font-semibold mt-1">
            {scorecard.recommendationTag}
          </span>
        </div>
      </div>

      {/* Quote Box */}
      <div className="rounded-xl bg-[#0d1320] p-4 border border-slate-800/80 relative overflow-hidden ml-2">
        <span className="material-symbols-outlined absolute top-2 right-2 text-slate-700 text-[28px] opacity-20">
          format_quote
        </span>
        <p className="text-xs text-slate-200 italic leading-relaxed relative z-10 font-sans">
          “{scorecard.highlightQuote}”
        </p>
      </div>

      {/* Competency Dimensions */}
      <div className="flex flex-col gap-2.5 ml-2 pt-1">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono-code font-semibold">
          Competency Dimension Scores
        </span>
        <div className="space-y-2">
          {scorecard.dimensions.map((dim) => (
            <div key={dim.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{dim.name}</span>
                <span className="font-mono-code text-[#22d3ee] font-semibold">
                  {dim.percentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#151f32] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    dim.color === 'secondary'
                      ? 'bg-[#22d3ee]'
                      : dim.color === 'tertiary'
                      ? 'bg-[#8b5cf6]'
                      : 'bg-[#3b82f6]'
                  }`}
                  style={{ width: `${dim.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-1 border-t border-slate-800/80 ml-2">
        <div className="flex flex-wrap gap-1.5">
          {scorecard.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded bg-[#151f32] text-slate-400 font-mono-code text-[10px] hover:text-white transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onViewAudit}
          type="button"
          className="text-[#22d3ee] hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View Full Audit Note</span>
          <span className="material-symbols-outlined text-[15px]">north_east</span>
        </button>
      </div>
    </article>
  );
}
