'use client';

import React, { useEffect, useState, useMemo } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricCard from '@/components/ui/MetricCard';
import AddApplicationModal from '@/components/ui/AddApplicationModal';
import RescheduleModal from '@/components/ui/RescheduleModal';
import { Application, ApplicationStatus } from '@/types';
import { getApplications, updateApplicationStatus, hasSession } from '@/lib/api';

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = () => {
    setIsLoading(true);
    getApplications()
      .then((data) => setApps(data))
      .catch(() => setApps([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchApps();

    const handleNewApp = () => fetchApps();
    window.addEventListener('new-application-added', handleNewApp);
    window.addEventListener('auth-change', handleNewApp);

    return () => {
      window.removeEventListener('new-application-added', handleNewApp);
      window.removeEventListener('auth-change', handleNewApp);
    };
  }, []);

  const totalCount = apps.length;
  const appliedCount = apps.filter((a) => a.status === 'Applied').length;
  const shortlistedCount = apps.filter((a) => a.status === 'Shortlisted').length;
  const interviewingCount = apps.filter(
    (a) => a.status === 'Interviewing' || a.status === 'Conflict Alert'
  ).length;
  const selectedCount = apps.filter((a) => a.status === 'Selected').length;
  const archivedCount = apps.filter((a) => a.status === 'Archived').length;

  const filterTabs = [
    { label: 'All', count: totalCount },
    { label: 'Applied', count: appliedCount },
    { label: 'Shortlisted', count: shortlistedCount },
    { label: 'Interviewing', count: interviewingCount },
    { label: 'Selected', count: selectedCount },
    { label: 'Archived', count: archivedCount },
  ];

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Interviewing') {
        return app.status === 'Interviewing' || app.status === 'Conflict Alert';
      }
      return app.status === activeFilter;
    });
  }, [apps, searchQuery, activeFilter]);

  const handleAddApplication = (newApp: Application) => {
    setApps((current) => [newApp, ...current.filter((app) => app.id !== newApp.id)]);
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(id, newStatus);
    setApps((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              statusDetail: newStatus === 'Selected' ? 'Offer Extended 🎉' : undefined,
            }
          : app
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display">
            Applications Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Real-time pipeline progression, multi-stage telemetry, and offer status
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="h-11 px-5 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all self-start md:self-auto active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>+ Add Application</span>
        </button>
      </div>

      {/* KPI Stat Tiles (4 Grid - dynamically computed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Applications"
          badge="Live Log"
          badgeColor="primary"
          value={String(totalCount)}
          subValue="Logged"
          description={`${appliedCount} pending initial screening`}
          metaLeft="Status"
          metaRight={totalCount > 0 ? 'Active' : 'No entries'}
          progressPercent={totalCount > 0 ? Math.min(100, totalCount * 10) : 0}
        />
        <MetricCard
          label="Shortlisted"
          badge="Conversion"
          badgeColor="secondary"
          value={String(shortlistedCount)}
          subValue="Drives"
          description="Assessments & preliminary rounds"
          metaLeft="Conversion"
          metaRight={totalCount > 0 ? `${Math.round((shortlistedCount / totalCount) * 100)}%` : '0%'}
          progressPercent={totalCount > 0 ? Math.round((shortlistedCount / totalCount) * 100) : 0}
        />
        <MetricCard
          label="Active Interviews"
          badge="Interview Stage"
          badgeColor="amber"
          value={String(interviewingCount)}
          subValue="Active"
          description="Technical & managerial rounds"
          metaLeft="In Pipeline"
          metaRight={interviewingCount > 0 ? 'Rounds scheduled' : 'None'}
          progressPercent={totalCount > 0 ? Math.round((interviewingCount / totalCount) * 100) : 0}
        />
        <MetricCard
          label="Offers Secured"
          badge="Selected"
          badgeColor="emerald"
          value={String(selectedCount)}
          subValue="Offers"
          description="Verified placement selections"
          metaLeft="Offer Stage"
          metaRight={selectedCount > 0 ? 'Success' : 'In Progress'}
          progressPercent={totalCount > 0 ? Math.round((selectedCount / totalCount) * 100) : 0}
        />
      </div>

      {/* Search & Filter Master Toolbar */}
      <div className="bg-[#111827] p-4 rounded-xl border border-slate-800/90 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by company name, role, or tags..."
              className="w-full h-11 bg-[#151f32] rounded-lg pl-11 pr-20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#22d3ee] border border-slate-700/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[#242a38] text-slate-400 text-[10px] font-mono-code hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-3 justify-end">
            <div className="h-11 p-1 rounded-lg bg-[#151f32] border border-slate-800 flex items-center shadow-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`h-full px-3.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#242a38] text-[#22d3ee] shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`h-full px-3.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[#242a38] text-[#22d3ee] shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveFilter(tab.label)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.label
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'bg-[#151f32] text-slate-400 hover:text-white hover:bg-[#242a38] border border-slate-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Table / Cards or Clean Empty State */}
      {filteredApps.length === 0 ? (
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-12 flex flex-col items-center justify-center text-center gap-4 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-[#151f32] border border-slate-700 flex items-center justify-center text-[#3b82f6]">
            <span className="material-symbols-outlined text-[32px]">folder_open</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">No applications found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              {searchQuery || activeFilter !== 'All'
                ? 'No applications match your active filter or search query. Try clearing the filters.'
                : 'You have not logged any company applications yet. Click below to add your first campus or off-campus recruitment drive.'}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="mt-2 px-5 py-2.5 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Log First Application</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-[#111827] rounded-xl border border-slate-800/90 shadow-md overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#151f32]/60 text-slate-400 font-mono-code text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-6 font-semibold">Company &amp; Role</th>
                  <th className="py-3.5 px-4 font-semibold">Applied Date</th>
                  <th className="py-3.5 px-4 font-semibold">Stage / Notes</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="group hover:bg-[#151f32]/50 transition-colors">
                    {/* Company & Role */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-[#151f32] border border-slate-700/80 flex items-center justify-center p-2 text-[#22d3ee]">
                          <span className="material-symbols-outlined text-[22px]">
                            {app.logoIcon || 'business'}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-white text-sm group-hover:text-[#22d3ee] transition-colors font-display">
                            {app.company}
                          </span>
                          <span className="text-slate-400 truncate max-w-[280px]">
                            {app.role}
                          </span>
                          <span className="font-mono-code text-[10px] text-slate-500 mt-0.5">
                            {app.reqId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono-code text-slate-200">
                          {app.appliedDate}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono-code">
                          {app.driveType}
                        </span>
                      </div>
                    </td>

                    {/* Next Milestone / Notes */}
                    <td className="py-4 px-4">
                      <span className="text-slate-300 font-medium">{app.nextStep}</span>
                      {app.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.tags.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded bg-[#151f32] text-slate-400 text-[10px] font-mono-code"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Status & Update */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <StatusBadge status={app.status} detail={app.statusDetail} />
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as ApplicationStatus)
                          }
                          className="bg-[#151f32] text-[11px] text-slate-300 border border-slate-700/80 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-slate-600 transition-colors"
                          title="Update application status"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Selected">🎉 Selected (Got Job!)</option>
                          <option value="Archived">Archived / Rejected</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => alert(`Viewing details for ${app.company}`)}
                        type="button"
                        className="h-8 px-3 rounded-lg bg-[#151f32] hover:bg-[#242a38] text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-medium transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#0d1320] border-t border-slate-800 flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span>
              Showing <strong>{filteredApps.length}</strong> of <strong>{apps.length}</strong> applications
            </span>
            <span className="text-emerald-400 font-semibold">{selectedCount} offers secured</span>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-[#111827] rounded-xl p-5 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#151f32] border border-slate-700 flex items-center justify-center text-[#22d3ee]">
                    <span className="material-symbols-outlined text-[20px]">{app.logoIcon || 'business'}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{app.company}</h3>
                    <span className="text-xs text-slate-400 block">{app.role}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={app.status} detail={app.statusDetail} />
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app.id, e.target.value as ApplicationStatus)
                    }
                    className="bg-[#151f32] text-[11px] text-slate-300 border border-slate-700/80 rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                    title="Update application status"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Selected">🎉 Selected (Got Job!)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0d1320] border border-slate-800 text-xs flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stage:</span>
                  <span className="text-[#22d3ee] font-medium">{app.nextStep}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-mono-code text-slate-300">{app.appliedDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="font-mono-code text-slate-500">{app.driveType}</span>
                <button
                  onClick={() => alert(`Details for ${app.company}`)}
                  className="text-[#22d3ee] font-semibold hover:underline"
                >
                  View Details ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddApplication}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />
    </div>
  );
}
