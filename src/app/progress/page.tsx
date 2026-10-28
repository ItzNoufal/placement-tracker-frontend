'use client';

import React, { useState, useEffect } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { Application } from '@/types';
import { getApplications } from '@/lib/api';

export default function ProgressPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadApps = () => {
    setIsLoading(true);
    getApplications()
      .then((data) => setApps(data))
      .catch(() => setApps([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadApps();

    window.addEventListener('application-updated', loadApps);
    window.addEventListener('new-application-added', loadApps);
    window.addEventListener('auth-change', loadApps);

    return () => {
      window.removeEventListener('application-updated', loadApps);
      window.removeEventListener('new-application-added', loadApps);
      window.removeEventListener('auth-change', loadApps);
    };
  }, []);

  const total = apps.length;
  const shortlisted = apps.filter((a) => a.status === 'Shortlisted').length;
  const interviewing = apps.filter((a) => a.status === 'Interviewing' || a.status === 'Conflict Alert').length;
  const offers = apps.filter((a) => a.status === 'Selected').length;

  const pctShortlisted = total > 0 ? ((shortlisted + interviewing + offers) / total) * 100 : 0;
  const pctInterview = total > 0 ? ((interviewing + offers) / total) * 100 : 0;
  const pctOffers = total > 0 ? (offers / total) * 100 : 0;

  const funnelSteps = [
    { label: 'Applications Submitted', count: total, percentage: total > 0 ? 100 : 0, color: 'bg-[#3b82f6]' },
    { label: 'Shortlisted for Assessment', count: shortlisted + interviewing + offers, percentage: Math.round(pctShortlisted), color: 'bg-[#3b82f6]' },
    { label: 'Interviews & Tech Rounds', count: interviewing + offers, percentage: Math.round(pctInterview), color: 'bg-[#22d3ee]' },
    { label: 'Final Selected Offers', count: offers, percentage: Math.round(pctOffers), color: 'bg-emerald-400' },
  ];

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display">
            Progress &amp; Growth Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Recruitment velocity analytics, conversion funnel diagnostics, and cohort benchmarking
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code bg-[#111827] px-3.5 py-2 rounded-lg border border-slate-800 text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Metric Window: Fall 2024</span>
        </div>
      </div>

      {/* 4 Telemetry Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Pipeline Conversion"
          badge="Live Telemetry"
          badgeColor="secondary"
          value={total > 0 ? `${Math.round(pctOffers)}%` : '0%'}
          description="Application to offer conversion velocity"
          metaLeft="Conversion"
          metaRight={total > 0 ? 'Computed' : 'No Data'}
          progressPercent={Math.round(pctOffers)}
        />
        <MetricCard
          label="Assessment Rate"
          badge="Shortlist Index"
          badgeColor="primary"
          value={total > 0 ? `${Math.round(pctShortlisted)}%` : '0%'}
          subValue={`${shortlisted} Drives`}
          description="Percentage of logged applications moving to assessment"
          metaLeft="Velocity"
          metaRight={shortlisted > 0 ? 'Optimal' : 'Pending'}
          progressPercent={Math.round(pctShortlisted)}
        />
        <MetricCard
          label="Interview Stage"
          badge="Technical Rounds"
          badgeColor="secondary"
          value={String(interviewing)}
          subValue="Active"
          description="Technical, System Design, and HR rounds"
          metaLeft="Stage 03"
          metaRight={interviewing > 0 ? 'Active' : 'Awaiting'}
          progressPercent={Math.round(pctInterview)}
        />
        <MetricCard
          label="Offer Portfolio"
          badge="Selected"
          badgeColor="emerald"
          value={String(offers)}
          subValue={offers > 1 ? 'Multi-Offer' : 'Offers'}
          description="Verified placement selections &amp; letter releases"
          metaLeft="Result"
          metaRight={offers > 0 ? 'Secured' : 'In Pipeline'}
          progressPercent={offers > 0 ? 100 : 0}
        />
      </div>

      {/* Recruitment Funnel & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recruitment Funnel Card (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#22d3ee] text-[20px]">
                filter_alt
              </span>
              <h2 className="text-base font-bold text-white font-display">
                Placement Pipeline Funnel
              </h2>
            </div>
            <span className="font-mono-code text-xs text-slate-400">{total} Total Applications</span>
          </div>

          <div className="flex flex-col gap-4">
            {funnelSteps.map((step) => (
              <div key={step.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{step.label}</span>
                  <div className="flex items-center gap-2 font-mono-code">
                    <span className="text-white font-bold">{step.count} Roles</span>
                    <span className="text-[#22d3ee]">({step.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-[#151f32] overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full ${step.color} transition-all duration-700`}
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[#080e1b] border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Overall Application-to-Offer Conversion Rate:</span>
            <span className="font-mono-code text-emerald-400 font-bold text-sm">
              {total > 0 ? `${Math.round(pctOffers)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Peer Benchmark & Cohort Standing (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3b82f6] text-[20px]">
                  leaderboard
                </span>
                <h2 className="text-base font-bold text-white font-display">
                  Campus Cohort Percentile
                </h2>
              </div>
              <span className="font-mono-code text-xs text-[#22d3ee] font-bold">Active Batch</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#080e1b] border border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-sans">Current Pipeline Velocity</span>
                <span className="text-xl font-bold text-white font-display mt-0.5">
                  {total} Drives Tracked
                </span>
              </div>
              <span className="text-3xl font-extrabold text-[#22d3ee] font-mono-code">
                {total > 0 ? `${Math.min(99, Math.round(50 + total * 4))}%` : '0%'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Consistent application tracking and proactive clash resolution ensure maximum participation in placement drives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
