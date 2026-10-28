'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MilestoneRail from '@/components/ui/MilestoneRail';
import InterviewCard from '@/components/ui/InterviewCard';
import AiCoachCard from '@/components/ui/AiCoachCard';
import RescheduleModal from '@/components/ui/RescheduleModal';
import AddApplicationModal from '@/components/ui/AddApplicationModal';
import { Application, Interview } from '@/types';
import { getCurrentUser, getApplications, getInterviews, getFeedbackEntries } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAddAppOpen, setIsAddAppOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setUser(getCurrentUser());
    try {
      const [apps, intvs, fbs] = await Promise.all([
        getApplications(),
        getInterviews(),
        getFeedbackEntries(),
      ]);
      setApplications(apps);
      setInterviews(intvs);
      setFeedbackCount(fbs.length);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleUpdate = () => loadDashboardData();
    window.addEventListener('new-application-added', handleUpdate);
    window.addEventListener('application-updated', handleUpdate);
    window.addEventListener('auth-change', loadDashboardData);

    return () => {
      window.removeEventListener('new-application-added', handleUpdate);
      window.removeEventListener('application-updated', handleUpdate);
      window.removeEventListener('auth-change', loadDashboardData);
    };
  }, []);

  const handleAddApp = (newApp: Application) => {
    setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
  };

  const selectedOffersList = applications.filter((a) => a.status === 'Selected');
  const selectedOffers = selectedOffersList.length;
  const interviewingCount = applications.filter(
    (a) => a.status === 'Interviewing' || a.status === 'Conflict Alert'
  ).length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* 1. Top Header Welcome Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#151f32] via-[#111827] to-[#151f32] p-6 lg:p-7 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Ambient radial lighting */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-12 w-64 h-64 rounded-full bg-[#22d3ee]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display">
              Good day, {user?.name || 'Candidate'} 👋
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 text-xs font-semibold font-mono-code">
              <span className="w-2 h-2 rounded-full bg-[#22d3ee] animate-pulse" />
              Active Placement Season 2024-25
            </span>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
            Here is your live placement journey, tracked applications, and interview schedule.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            href="/interviews"
            className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1f293d] border border-slate-700 hover:border-slate-600 text-slate-100 text-xs font-semibold hover:bg-[#242a38] transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-[#22d3ee]">
              schedule
            </span>
            <span>View Schedule</span>
          </Link>

          <button
            onClick={() => setIsAddAppOpen(true)}
            type="button"
            className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add Application</span>
          </button>
        </div>
      </div>

      {/* Celebratory Job Offer Banner (Shown when at least 1 job is secured) */}
      {selectedOffers > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#111827] to-[#151f32] border border-emerald-500/40 p-5 shadow-xl shadow-emerald-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="material-symbols-outlined text-[28px] animate-bounce">
                military_tech
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code font-bold uppercase">
                  Goal Achieved
                </span>
                <span className="text-xs text-slate-400 font-mono-code">
                  {selectedOffers} Placement Offer{selectedOffers > 1 ? 's' : ''} Secured
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                🎉 Congratulations! You Got The Job at {selectedOffersList.map((o) => o.company).join(', ')}!
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Your placement pipeline milestone has been achieved. You can view offer details and sign verification letters below.
              </p>
            </div>
          </div>
          <Link
            href="/applications"
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <span>View All Offers</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      )}

      {/* 2. Primary Milestone Pipeline Rail (Driven by Real Live State) */}
      <MilestoneRail
        applicationCount={applications.length}
        shortlistCount={shortlistedCount}
        interviewCount={interviews.length}
        feedbackCount={feedbackCount}
        offerCount={selectedOffers}
      />

      {/* 3. Two-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          {/* Momentum & Real Telemetry Tile */}
          <section className="rounded-2xl bg-[#111827] border border-slate-800/90 p-6 shadow-md relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22d3ee]/20 to-[#3b82f6]/20 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
                  <span className="material-symbols-outlined text-[22px]">trending_up</span>
                </div>
                <div>
                  <h3 className="text-lg text-white font-bold font-display">Your Pipeline Summary</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Live telemetry calculated from your logged applications
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/25 text-[#22d3ee] font-mono-code text-xs font-semibold">
                Live Status
              </span>
            </div>

            {/* Controllable Activity Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#080e1b] border border-slate-800 p-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold font-mono-code">
                    Applications
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                </div>
                <span className="text-xl font-bold text-white font-mono-code mt-1">
                  {applications.length} Logged
                </span>
                <span className="text-[11px] text-[#3b82f6] flex items-center gap-1 font-sans">
                  {applications.length > 0 ? `${applications.length} Drives in tracking` : 'Ready to start'}
                </span>
              </div>

              <div className="rounded-xl bg-[#080e1b] border border-slate-800 p-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold font-mono-code">
                    Shortlisted / In Progress
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#22d3ee]" />
                </div>
                <span className="text-xl font-bold text-white font-mono-code mt-1">
                  {shortlistedCount + interviewingCount} Active
                </span>
                <span className="text-[11px] text-[#22d3ee] flex items-center gap-1 font-sans">
                  {interviewingCount} Interview stage
                </span>
              </div>

              <div className="rounded-xl bg-[#080e1b] border border-slate-800 p-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold font-mono-code">
                    Offers
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xl font-bold text-white font-mono-code mt-1">
                  {selectedOffers} Secured
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-sans">
                  {selectedOffers > 0 ? 'Offer letters ready' : 'In pipeline'}
                </span>
              </div>
            </div>
          </section>

          {/* Upcoming Interviews / Empty State */}
          <section className="rounded-2xl bg-[#111827] border border-slate-800/90 p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22d3ee]" />
                <h3 className="text-lg text-white font-bold font-display">Upcoming Interviews</h3>
              </div>
              <span className="text-xs text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 px-2.5 py-1 rounded-md font-mono-code font-semibold">
                {interviews.length} Scheduled
              </span>
            </div>

            {interviews.length > 0 ? (
              <div className="flex flex-col gap-3.5">
                {interviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={{
                      id: interview.id,
                      company: interview.company,
                      companyInitials: interview.company.slice(0, 3).toUpperCase(),
                      roundNumber: 1,
                      roundName: interview.roundName || 'Technical Round 1',
                      date: interview.date || 'Upcoming',
                      timeSlot: interview.timeSlot || 'Scheduled',
                      platform: interview.platform || 'Online via Meet/Teams',
                      interviewer: interview.interviewer || 'Lead Engineer',
                      status: interview.status,
                      hasClash: interview.status === 'Conflict Alert',
                    }}
                    onReschedule={() => setIsRescheduleOpen(true)}
                    onOpenNotes={() => alert(`Showing prep notes for ${interview.company}...`)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-[#080e1b] border border-slate-800/80 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#151f32] text-slate-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">event_available</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">No interviews scheduled yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    When you are shortlisted or invite slots are confirmed, they will appear here with automatic clash detection.
                  </p>
                </div>
                <Link
                  href="/interviews"
                  className="mt-1 px-4 py-2 rounded-lg bg-[#151f32] hover:bg-[#1f293d] border border-slate-700 text-xs text-[#22d3ee] font-semibold"
                >
                  Manage Interviews &amp; Slots
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Right Column (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* AI Placement Coach Card (Driven by Real State) */}
          <section className="rounded-2xl bg-[#111827] border border-slate-800/90 p-6 shadow-md flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#8b5cf6] text-[22px]">
                  psychology
                </span>
                <h3 className="text-lg text-white font-bold font-display">
                  Placement Strategy Coach
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono-code font-semibold">Active</span>
            </div>

            <AiCoachCard
              upcomingCompany={interviews[0]?.company}
              interviewCount={interviews.length}
            />

            {/* Quick Link to Applications */}
            <div className="p-4 rounded-xl bg-[#080e1b] border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-white font-display">Browse Companies</span>
                <span className="text-slate-400">Discover active campus recruiters &amp; packages</span>
              </div>
              <Link
                href="/companies"
                className="px-3.5 py-1.5 rounded-lg bg-[#3b82f6] text-white font-semibold text-xs hover:bg-blue-600 transition-colors"
              >
                Directory
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={isAddAppOpen}
        onClose={() => setIsAddAppOpen(false)}
        onAdd={handleAddApp}
      />
    </div>
  );
}
