'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ClashTimeline from '@/components/ui/ClashTimeline';
import RescheduleModal from '@/components/ui/RescheduleModal';
import InterviewCard from '@/components/ui/InterviewCard';
import { Interview, InterviewRound } from '@/types';
import { getInterviews, saveInterview, deleteInterview } from '@/lib/api';

// Helper to convert time strings like "11:45 AM" to minutes from midnight
function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3];

  if (meridian === 'PM' && hours < 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Parses time slot string like "11:00 AM – 12:00 PM" or "11:45 AM - 12:45 PM"
function parseTimeSlot(slotStr: string): { start: number; end: number } | null {
  if (!slotStr) return null;
  const parts = slotStr.split(/[-–—]/);
  if (parts.length < 2) return null;

  let startMin = parseTimeToMinutes(parts[0]);
  let endMin = parseTimeToMinutes(parts[1]);

  if (startMin === null || endMin === null) return null;
  if (endMin < startMin) endMin += 12 * 60; // Handle cross-meridian or 12h formatting

  return { start: startMin, end: endMin };
}

export default function InterviewsPage() {
  const [rawInterviews, setRawInterviews] = useState<Interview[]>([]);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clashingCompany, setClashingCompany] = useState('YUV');
  const [confirmedCompany, setConfirmedCompany] = useState('Google');
  const [isLoading, setIsLoading] = useState(true);

  // New Interview Form State
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Software Engineer');
  const [newRound, setNewRound] = useState('Technical Round 1');
  const [newDate, setNewDate] = useState('Tomorrow');
  const [newTime, setNewTime] = useState('11:45 AM – 12:45 PM');
  const [newFormat, setNewFormat] = useState<'Online' | 'In-Person'>('Online');

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Microphone & HD webcam tested on MS Teams / Google Meet', done: true },
    { id: 2, text: 'Placement Cell NOC & Hall ticket verified', done: true },
    { id: 3, text: 'Distributed locking & Redis cache eviction revised', done: false },
    { id: 4, text: 'Updated GitHub repo & live portfolio link in resume', done: false },
  ]);

  const fetchInterviews = () => {
    setIsLoading(true);
    getInterviews()
      .then((data) => setRawInterviews(data))
      .catch(() => setRawInterviews([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchInterviews();
    window.addEventListener('auth-change', fetchInterviews);
    return () => window.removeEventListener('auth-change', fetchInterviews);
  }, []);

  const toggleChecklist = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // Run Real Clash Detection Algorithm across all interviews
  const { processedRounds, detectedClash } = useMemo(() => {
    const list: InterviewRound[] = [];
    let clashSummary: {
      companyA: string;
      timeA: string;
      companyB: string;
      timeB: string;
      overlapMinutes: number;
    } | null = null;

    for (let i = 0; i < rawInterviews.length; i++) {
      const current = rawInterviews[i];
      const timeA = parseTimeSlot(current.timeSlot);
      let hasClash = false;
      let overlapMinutes = 0;
      let clashingWith = '';

      // Compare with all other interviews
      for (let j = 0; j < rawInterviews.length; j++) {
        if (i === j) continue;
        const other = rawInterviews[j];

        // If on same date
        const sameDate =
          !current.date ||
          !other.date ||
          current.date.toLowerCase().trim() === other.date.toLowerCase().trim();

        if (sameDate && timeA) {
          const timeB = parseTimeSlot(other.timeSlot);
          if (timeB) {
            const overlapStart = Math.max(timeA.start, timeB.start);
            const overlapEnd = Math.min(timeA.end, timeB.end);

            if (overlapStart < overlapEnd) {
              hasClash = true;
              overlapMinutes = overlapEnd - overlapStart;
              clashingWith = other.company;

              if (!clashSummary) {
                clashSummary = {
                  companyA: current.company,
                  timeA: current.timeSlot,
                  companyB: other.company,
                  timeB: other.timeSlot,
                  overlapMinutes,
                };
              }
            }
          }
        }
      }

      list.push({
        id: current.id,
        company: current.company,
        companyInitials: current.company.slice(0, 3).toUpperCase(),
        role: current.role,
        roundNumber: 1,
        roundName: current.roundName || 'Technical Round 1',
        date: current.date || 'Upcoming',
        timeSlot: current.timeSlot || 'Scheduled',
        durationMins: 60,
        platform: current.platform || 'Online via Meet/Teams',
        interviewer: current.interviewer || 'Lead Engineer',
        status: hasClash ? 'Conflict Alert' : 'Confirmed',
        hasClash,
        confirmed: !hasClash,
        overlapDuration: `${overlapMinutes}m Overlap`,
        clashWith: clashingWith,
        topics: 'Algorithms, System Design & Concurrency',
      });
    }

    return { processedRounds: list, detectedClash: clashSummary };
  }, [rawInterviews]);

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany) return;

    const interviewObj: Interview = {
      id: `intv-${Date.now()}`,
      company: newCompany,
      role: newRole,
      roundName: newRound,
      date: newDate,
      timeSlot: newTime,
      format: newFormat,
      status: 'Confirmed',
      platform: newFormat === 'Online' ? 'Google Meet / Teams' : 'Campus Placement Cell',
      interviewer: 'Assigned Lead Engineer',
    };

    const saved = await saveInterview(interviewObj);
    setRawInterviews((prev) => [saved, ...prev]);
    setNewCompany('');
    setIsAddModalOpen(false);
  };

  const handleOpenReschedule = (clash: string, confirmed: string) => {
    setClashingCompany(clash);
    setConfirmedCompany(confirmed);
    setIsRescheduleOpen(true);
  };

  const handleDeleteInterview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview round?')) return;
    await deleteInterview(id);
    setRawInterviews((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display">
            Interviews &amp; Schedule Guard
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Recruitment round calendar, collision prevention, and recruiter communication engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="h-10 px-4 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* Visual Clash Detector Timeline Header (appears automatically on detection) */}
      {detectedClash && (
        <ClashTimeline
          onOpenReschedule={() =>
            handleOpenReschedule(detectedClash.companyB, detectedClash.companyA)
          }
          companyA={detectedClash.companyA}
          timeA={detectedClash.timeA}
          companyB={detectedClash.companyB}
          timeB={detectedClash.timeB}
          overlapMinutes={detectedClash.overlapMinutes}
        />
      )}

      {/* Main 2-Column Orchestration Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-white font-bold font-display">
              Your Scheduled Rounds ({processedRounds.length})
            </h2>
            <span className="font-mono-code text-xs text-slate-400">TIMEZONE: IST (UTC+05:30)</span>
          </div>

          {processedRounds.length > 0 ? (
            <div className="flex flex-col gap-4">
              {processedRounds.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onReschedule={() =>
                    handleOpenReschedule(interview.company, interview.clashWith || 'Other Drive')
                  }
                  onOpenNotes={() => alert(`Showing prep notes for ${interview.company}...`)}
                  onDelete={() => handleDeleteInterview(interview.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#111827] rounded-xl border border-slate-800 p-10 flex flex-col items-center justify-center text-center gap-3 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[#151f32] text-[#22d3ee] flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">calendar_month</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">No interviews scheduled yet</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                When recruiters schedule your technical assessments or live rounds, log them here to monitor clash alerts.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                type="button"
                className="mt-2 px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                + Schedule Interview Round
              </button>
            </div>
          )}
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Readiness Checklist */}
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-5 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#22d3ee] text-[20px]">
                  checklist
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  Interview Readiness
                </h3>
              </div>
              <span className="text-xs text-[#22d3ee] font-mono-code font-bold">
                {checklist.filter((i) => i.done).length} / {checklist.length} Done
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-[#151f32]/60 hover:bg-[#151f32] border border-slate-800/80 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded bg-[#080e1b] accent-[#3b82f6] cursor-pointer"
                  />
                  <span
                    className={`text-xs ${
                      item.done ? 'line-through text-slate-500' : 'text-slate-300'
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* TPO Support Hotline */}
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-5 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono-code text-slate-400">
              <span className="material-symbols-outlined text-[16px] text-[#3b82f6]">
                support_agent
              </span>
              <span>Placement Officer Support</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Need immediate clash verification? All campus conflicts are backed by university policy exemption letters.
            </p>
            <div className="p-3 rounded-xl bg-[#080e1b] border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white font-display block">Prof. S. Nambiar</span>
                <span className="text-slate-400">Head of Corporate Relations</span>
              </div>
              <a
                href="mailto:placement@university.edu"
                className="px-3 py-1.5 rounded-lg bg-[#3b82f6] text-white font-semibold text-[11px]"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display">Schedule Interview Round</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateInterview} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold font-mono-code">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Adobe"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold font-mono-code">Role</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold font-mono-code">Round Name</label>
                  <input
                    type="text"
                    value={newRound}
                    onChange={(e) => setNewRound(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold font-mono-code">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as 'Online' | 'In-Person')}
                    className="h-10 px-2 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person (Campus)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold font-mono-code">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow / Oct 25"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold font-mono-code">Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:00 AM – 12:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#151f32] text-slate-300 hover:bg-[#242a38]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#3b82f6] text-white font-bold hover:bg-blue-600"
                >
                  Save Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        clashingCompany={clashingCompany}
        confirmedCompany={confirmedCompany}
      />
    </div>
  );
}
