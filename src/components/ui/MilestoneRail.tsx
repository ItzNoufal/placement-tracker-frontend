'use client';

import React from 'react';

interface MilestoneRailProps {
  applicationCount?: number;
  shortlistCount?: number;
  interviewCount?: number;
  feedbackCount?: number;
  offerCount?: number;
}

export default function MilestoneRail({
  applicationCount = 0,
  shortlistCount = 0,
  interviewCount = 0,
  feedbackCount = 0,
  offerCount = 0,
}: MilestoneRailProps) {
  // Determine progress percent
  let progressWidth = '0%';
  if (offerCount > 0) progressWidth = '100%';
  else if (feedbackCount > 0) progressWidth = '80%';
  else if (interviewCount > 0) progressWidth = '58%';
  else if (shortlistCount > 0) progressWidth = '35%';
  else if (applicationCount > 0) progressWidth = '15%';

  const stages = [
    {
      stageNumber: '01',
      title: 'Applications',
      metric: applicationCount > 0 ? `${applicationCount} Logged` : '0 Applications',
      badge: applicationCount > 0 ? 'Student Controlled' : 'Ready to Start',
      active: applicationCount > 0,
    },
    {
      stageNumber: '02',
      title: 'Shortlisted',
      metric: shortlistCount > 0 ? `${shortlistCount} Shortlisted` : '0 Shortlisted',
      badge: shortlistCount > 0 ? 'Progressed' : 'Pending',
      active: shortlistCount > 0,
    },
    {
      stageNumber: '03',
      title: 'Interviews',
      metric: interviewCount > 0 ? `${interviewCount} Scheduled` : '0 Scheduled',
      badge: interviewCount > 0 ? 'Active Focus' : 'Awaiting Invites',
      active: interviewCount > 0,
    },
    {
      stageNumber: '04',
      title: 'Feedback',
      metric: feedbackCount > 0 ? `${feedbackCount} Reviewed` : '0 Reviewed',
      badge: feedbackCount > 0 ? 'Debriefed' : 'Debrief & Learn',
      active: feedbackCount > 0,
    },
    {
      stageNumber: '05',
      title: 'Outcomes',
      metric: offerCount > 0 ? `${offerCount} Offers Secured` : '0 Offers',
      badge: offerCount > 0 ? 'Achieved' : 'Target Goal',
      active: offerCount > 0,
    },
  ];

  return (
    <section className="rounded-2xl bg-[#111827] border border-slate-800/90 p-5 lg:p-7 shadow-lg relative overflow-hidden animate-in fade-in">
      {/* Top Title & Encouraging Message Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center border border-[#3b82f6]/20">
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </div>
          <div>
            <h2 className="text-lg text-white font-bold tracking-tight font-display">
              Your Placement Journey
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Live recruitment milestone progression tracker
            </p>
          </div>
        </div>

        {/* Dynamic Encouragement Message */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-slate-200">
          <span className="material-symbols-outlined text-[16px] text-[#22d3ee]">verified</span>
          <span className="text-[12px] sm:text-[13px] font-medium">
            {applicationCount === 0 && interviewCount === 0 ? (
              <span>
                Start your journey: <strong className="text-white">+ Add your first application</strong> to initiate tracking.
              </span>
            ) : (
              <span>
                Focus on what you control:{' '}
                <strong className="text-white">
                  {applicationCount} application{applicationCount !== 1 ? 's' : ''} submitted
                </strong>{' '}
                &amp;{' '}
                <strong className="text-[#22d3ee]">
                  {interviewCount} interview{interviewCount !== 1 ? 's' : ''} tracked
                </strong>
                .
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 5-Stage Connected Horizontal Milestone Pipeline */}
      <div className="pt-7 pb-2">
        <div className="relative grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 items-start">
          {/* Subtle Glowing Connecting Rail behind nodes (Desktop) */}
          <div className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-1 bg-slate-800/90 -z-0">
            <div
              className="h-full bg-gradient-to-r from-[#3b82f6] via-[#22d3ee] to-[#3b82f6]/60 rounded-full transition-all duration-700"
              style={{ width: progressWidth }}
            />
          </div>

          {stages.map((stage, idx) => {
            const isStage3 = stage.stageNumber === '03';
            const isStage5 = stage.stageNumber === '05';
            const isStage4 = stage.stageNumber === '04';

            return (
              <div
                key={stage.stageNumber}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                {/* Node Circle */}
                {isStage3 && stage.active ? (
                  <div className="relative mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-500/50 ring-4 ring-[#3b82f6]/30 animate-pulse">
                      <span className="material-symbols-outlined text-[22px]">
                        record_voice_over
                      </span>
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#22d3ee]" />
                    </span>
                  </div>
                ) : isStage5 ? (
                  <div
                    className={`w-12 h-12 rounded-full bg-[#151f32] border-2 flex items-center justify-center shadow-lg mb-3 transition-transform ${
                      stage.active
                        ? 'border-emerald-400 text-emerald-400 shadow-emerald-500/20'
                        : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">military_tech</span>
                  </div>
                ) : isStage4 ? (
                  <div
                    className={`w-12 h-12 rounded-full bg-[#151f32] border-2 flex items-center justify-center mb-3 transition-transform ${
                      stage.active
                        ? 'border-[#d0bcff] text-[#d0bcff]'
                        : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">rate_review</span>
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full bg-[#151f32] border-2 flex items-center justify-center shadow-lg mb-3 transition-transform ${
                      stage.active
                        ? idx === 0
                          ? 'border-[#3b82f6] text-[#3b82f6] shadow-blue-500/20'
                          : 'border-[#22d3ee] text-[#22d3ee] shadow-cyan-500/20'
                        : 'border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {stage.active ? 'check' : 'radio_button_unchecked'}
                    </span>
                  </div>
                )}

                {/* Subtitle / Stage Index */}
                <span
                  className={`text-[11px] uppercase tracking-wider font-semibold font-mono-code ${
                    stage.active
                      ? isStage3
                        ? 'text-[#22d3ee] font-bold'
                        : isStage5
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {isStage3 && stage.active
                    ? 'Stage 03 • In Progress'
                    : isStage5 && stage.active
                    ? 'Milestone Achieved'
                    : `Stage ${stage.stageNumber}`}
                </span>

                {/* Stage Title */}
                <span
                  className={`text-[15px] font-bold mt-0.5 font-display ${
                    stage.active ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {stage.title}
                </span>

                {/* Metric value */}
                <span
                  className={`text-xs font-semibold mt-1 font-mono-code ${
                    stage.active
                      ? isStage3
                        ? 'text-white bg-[#3b82f6]/25 px-2.5 py-0.5 rounded-full border border-[#3b82f6]/30'
                        : isStage5
                        ? 'text-emerald-400'
                        : isStage4
                        ? 'text-[#d0bcff]'
                        : idx === 0
                        ? 'text-[#3b82f6]'
                        : 'text-[#22d3ee]'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.metric}
                </span>

                {/* Tag pill */}
                <span
                  className={`mt-1.5 text-[11px] px-2 py-0.5 rounded border ${
                    stage.active
                      ? isStage3
                        ? 'text-[#22d3ee] border-[#22d3ee]/30 bg-[#22d3ee]/10 font-medium'
                        : isStage5
                        ? 'text-slate-200 border-emerald-500/30 bg-emerald-500/10 font-medium'
                        : 'text-slate-300 border-slate-700 bg-slate-800/80'
                      : 'text-slate-500 border-slate-800 bg-[#0d1320]'
                  }`}
                >
                  {stage.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
