'use client';

import React, { useState, useEffect } from 'react';
import DebriefScorecard from '@/components/ui/DebriefScorecard';
import { DebriefScorecard as DebriefScorecardType, FeedbackEntry } from '@/types';
import { getFeedbackEntries, saveFeedback } from '@/lib/api';

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [scorecards, setScorecards] = useState<DebriefScorecardType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [company, setCompany] = useState('');
  const [roundType, setRoundType] = useState('System Design');
  const [rating, setRating] = useState('4.2');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [notes, setNotes] = useState('');

  const fetchFeedback = () => {
    setIsLoading(true);
    getFeedbackEntries()
      .then((data) => setScorecards(data.map(toScorecard)))
      .catch(() => setScorecards([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchFeedback();
    window.addEventListener('auth-change', fetchFeedback);
    return () => window.removeEventListener('auth-change', fetchFeedback);
  }, []);

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    const newEntry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      company,
      roundType,
      overallRating: parseFloat(rating) || 4.0,
      strengths: strengths ? strengths.split(',').map((s) => s.trim()) : ['Good fundamentals'],
      improvements: improvements ? improvements.split(',').map((s) => s.trim()) : ['Deepen edge cases'],
      evaluatorNote: notes || 'Performance reviewed by evaluator.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const saved = await saveFeedback(newEntry);
    setScorecards((prev) => [toScorecard(saved), ...prev]);
    setCompany('');
    setStrengths('');
    setImprovements('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const tabs = [
    { label: 'All', count: scorecards.length },
    { label: 'System Design', count: scorecards.filter((s) => s.roundType === 'System Design').length },
    { label: 'Coding & DS', count: scorecards.filter((s) => s.roundType === 'Coding & DS').length },
    {
      label: 'Technical HR',
      count: scorecards.filter((s) => s.roundType === 'Technical HR').length,
    },
  ];

  const filteredScorecards =
    activeTab === 'All'
      ? scorecards
      : scorecards.filter((s) => s.roundType === activeTab);

  const avgRating =
    scorecards.length > 0
      ? (scorecards.reduce((acc, curr) => acc + curr.rating, 0) / scorecards.length).toFixed(1)
      : 'N/A';

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display">
            Feedback &amp; Debriefs
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Post-interview evaluator telemetry, competency dimensions, and diagnostic revision drills
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono-code bg-[#111827] px-3.5 py-2 rounded-lg border border-slate-800 text-[#22d3ee]">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Avg Rating: {avgRating} / 5.0</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="h-10 px-4 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">post_add</span>
            <span>+ Log Debrief</span>
          </button>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="bg-[#111827] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.label
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#151f32]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono-code hidden sm:block">
          Sort by: <strong className="text-white">Recency (Latest)</strong>
        </span>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Debrief Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              Logged Evaluation Scorecards ({filteredScorecards.length})
            </h2>
          </div>

          {filteredScorecards.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredScorecards.map((scorecard) => (
                <DebriefScorecard
                  key={scorecard.id}
                  scorecard={scorecard}
                  onViewAudit={() =>
                    alert(`Audit note for ${scorecard.company} (${scorecard.roundType}) downloaded.`)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#111827] rounded-xl border border-slate-800 p-10 flex flex-col items-center justify-center text-center gap-3 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[#151f32] text-[#8b5cf6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">reviews</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">No feedback scorecards logged</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                After completing an interview round, log evaluator comments, rubrics, and key learnings here to build your revision strategy.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                type="button"
                className="mt-2 px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                + Log Interview Debrief
              </button>
            </div>
          )}
        </div>

        {/* Right Column: AI Placement Diagnostic & Mastery Index (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* AI Diagnostic */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#151f32] to-[#080e1b] p-6 border border-[#3b82f6]/30 shadow-2xl flex flex-col gap-4">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#22d3ee] via-[#3b82f6] to-[#8b5cf6]" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#22d3ee]/15 text-[#22d3ee] flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    AI Placement Coach
                  </h3>
                  <span className="font-mono-code text-[11px] text-[#22d3ee] uppercase tracking-wider">
                    Diagnostic Loop
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1f293d] text-white font-mono-code text-[10px] font-bold">
                READY
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1320] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
              Continuous debrief logging accelerates preparation feedback loops. Review past evaluator comments before every new round to avoid repeating conceptual gaps.
            </div>
          </div>

          {/* Technical Mastery Index Card */}
          <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3b82f6] text-[20px]">
                  radar
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  Technical Core Index
                </h3>
              </div>
              <span className="font-mono-code text-[11px] text-slate-400 uppercase tracking-wider">
                COMPETENCY
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { name: 'Data Structures & Algorithms', percentage: 88, color: 'bg-[#22d3ee]' },
                { name: 'System Design & Distributed Scalability', percentage: 82, color: 'bg-[#3b82f6]' },
                { name: 'Core CS (OS, Networks, DBMS)', percentage: 91, color: 'bg-emerald-400' },
              ].map((skill) => (
                <div key={skill.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="font-mono-code text-white font-bold">{skill.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#151f32] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Debrief Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display">Log Interview Debrief</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddFeedback} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold font-mono-code">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Atlassian, Uber"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold font-mono-code">Round Type</label>
                  <select
                    value={roundType}
                    onChange={(e) => setRoundType(e.target.value)}
                    className="h-10 px-2 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="System Design">System Design</option>
                    <option value="Coding & DS">Coding &amp; DS</option>
                    <option value="Technical HR">Technical HR</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-semibold font-mono-code">Rating (out of 5.0)</label>
                  <input
                    type="text"
                    placeholder="4.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold font-mono-code">Strong Areas (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Modular code, quick edge-case identification"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold font-mono-code">Areas for Improvement</label>
                <input
                  type="text"
                  placeholder="e.g. Redis caching TTL nuances"
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-300 font-semibold font-mono-code">Evaluator Feedback Notes</label>
                <textarea
                  rows={3}
                  placeholder="Notes from interviewer or self-reflection..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="p-3 rounded-lg bg-[#0d1320] border border-slate-700 text-white focus:outline-none focus:border-[#3b82f6]"
                />
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
                  Save Debrief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function toScorecard(entry: FeedbackEntry): DebriefScorecardType {
  const rating = Math.min(5, Math.max(0, entry.overallRating));
  return {
    id: entry.id,
    company: entry.company,
    initials: entry.company.slice(0, 2).toUpperCase(),
    roundType: entry.roundType as DebriefScorecardType['roundType'],
    evaluator: 'Placement Evaluator',
    date: entry.date,
    rating,
    recommendationTag: rating >= 4 ? 'Strong Performance' : 'Growth Area',
    recommendationColor: rating >= 4 ? 'secondary' : 'tertiary',
    highlightQuote: entry.evaluatorNote,
    tags: [...entry.strengths, ...entry.improvements].slice(0, 5),
    dimensions: [
      { name: 'Overall', percentage: Math.round(rating * 20), color: 'secondary' },
      { name: 'Strengths', percentage: entry.strengths.length ? 80 : 55, color: 'primary' },
      { name: 'Improvement Plan', percentage: entry.improvements.length ? 70 : 50, color: 'tertiary' },
    ],
  };
}
