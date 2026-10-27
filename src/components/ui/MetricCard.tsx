import React from 'react';

interface MetricCardProps {
  label: string;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'emerald' | 'amber';
  value: string;
  subValue?: string;
  description: string;
  metaLeft?: string;
  metaRight?: string;
  icon?: string;
  progressPercent?: number;
}

export default function MetricCard({
  label,
  badge,
  badgeColor = 'secondary',
  value,
  subValue,
  description,
  metaLeft,
  metaRight,
  icon,
  progressPercent,
}: MetricCardProps) {
  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'primary':
        return 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30';
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'secondary':
      default:
        return 'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/30';
    }
  };

  return (
    <div className="bg-[#111827] rounded-xl p-5 border border-slate-800/90 shadow-md flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-slate-700 transition-all">
      {/* Ambient background glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#1f293d]/30 blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

      {/* Top Row: Label & Tag */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold font-mono-code">
          {label}
        </span>
        {badge && (
          <span
            className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono-code font-bold uppercase tracking-wider ${getBadgeStyle()}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Value Row */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-display">
            {value}
          </span>
          {subValue && (
            <span className="text-sm font-semibold text-slate-400 font-mono-code">
              {subValue}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans mt-0.5">
          {description}
        </p>
      </div>

      {/* Progress Bar (if provided) */}
      {typeof progressPercent === 'number' && (
        <div className="w-full bg-[#151f32] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}

      {/* Footer Meta Row */}
      {(metaLeft || metaRight) && (
        <div className="flex items-center justify-between pt-1 font-mono-code text-[11px] text-slate-400 border-t border-slate-800/60">
          <span>{metaLeft}</span>
          <span className="text-[#22d3ee] font-semibold">{metaRight}</span>
        </div>
      )}
    </div>
  );
}
