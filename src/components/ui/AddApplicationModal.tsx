'use client';

import React, { useState } from 'react';
import { Application } from '@/types';
import { createApplicationFromDraft, hasSession } from '@/lib/api';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: Application) => void | Promise<void>;
}

export default function AddApplicationModal({ isOpen, onClose, onAdd }: AddApplicationModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [driveType, setDriveType] = useState('Campus Tier-1 Drive');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    setError('');
    setIsSaving(true);

    const newApp: Application = {
      id: `app-${Date.now()}`,
      reqId: `${company.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      company,
      role,
      logoIcon: 'terminal',
      ctc: ctc ? `₹${ctc} LPA` : '₹20 LPA',
      ctcBreakdown: 'Base + Variable CTC',
      appliedDate: 'Just now',
      driveType,
      nextStep: 'Application submitted & logged',
      status: 'Applied',
      tags: tags ? tags.split(',').map((t) => t.trim()) : ['Tech'],
    };

    try {
      const savedApp = hasSession() ? await createApplicationFromDraft(newApp) : newApp;
      await onAdd(savedApp);
      setCompany('');
      setRole('');
      setCtc('');
      setTags('');
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? 'Could not save to the server. Please log in again and try.' : 'Could not save application.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111827] border border-slate-700 p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Log New Application</h2>
              <p className="text-xs text-slate-400">Add a campus drive or off-campus recruitment track</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
              Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Netflix, Salesforce, Stripe"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-10 px-3.5 rounded-lg bg-[#0d1320] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
              Job Role *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Software Engineer Backend / Full Stack"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 px-3.5 rounded-lg bg-[#0d1320] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                CTC (in LPA)
              </label>
              <input
                type="text"
                placeholder="e.g. 24"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                className="h-10 px-3.5 rounded-lg bg-[#0d1320] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
                Drive Type
              </label>
              <select
                value={driveType}
                onChange={(e) => setDriveType(e.target.value)}
                className="h-10 px-3 rounded-lg bg-[#0d1320] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="Campus Tier-1 Drive">Campus Tier-1 Drive</option>
                <option value="Campus Regular Drive">Campus Regular Drive</option>
                <option value="Off-Campus Fast Track">Off-Campus Fast Track</option>
                <option value="National Code Challenge">National Code Challenge</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
              Tech Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Python, PostgreSQL"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="h-10 px-3.5 rounded-lg bg-[#0d1320] border border-slate-700 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            {error && <p className="mr-auto text-xs text-red-400">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#151f32] text-slate-300 text-xs font-semibold hover:bg-[#242a38] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-lg bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>{isSaving ? 'Saving...' : 'Save Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
