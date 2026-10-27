'use client';

import React, { useState } from 'react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clashingCompany?: string;
  confirmedCompany?: string;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  clashingCompany = 'CRED',
  confirmedCompany = 'Microsoft',
}: RescheduleModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow, Oct 24 • 03:00 PM - 04:00 PM');
  const [sentStatus, setSentStatus] = useState(false);

  if (!isOpen) return null;

  const emailSubject = `Interview Reschedule Request: ${clashingCompany} Backend Engineering Technical Round - Rohan Verma`;
  const emailBody = `Dear ${clashingCompany} Recruitment Team,

Thank you for scheduling my Technical Assessment round. 

I am writing to respectfully request a slight rescheduling of our tomorrow 11:00 AM slot. Due to an overlapping, mandatory campus-slotted interview with ${confirmedCompany} (10:30 AM - 11:45 AM) confirmed through our University Placement Cell, I want to ensure I am 100% available and focused for the ${clashingCompany} round.

I am actively available for any of the following alternative windows:
1. ${selectedSlot} (Preferred)
2. Friday, Oct 25 • 10:00 AM - 11:00 AM
3. Friday, Oct 25 • 02:00 PM - 03:00 PM

Please let me know if any of these times work for the engineering evaluator, or if you prefer an alternative slot.

Sincerely,
Rohan Verma
Roll No: 21BCS1084 | B.Tech CS (2025)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    setSentStatus(true);
    setTimeout(() => {
      setSentStatus(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#111827] border border-blue-500/30 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_24px_rgba(34,211,238,0.1)] flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-[#3b82f6] flex items-center justify-center border border-blue-500/25">
              <span className="material-symbols-outlined text-[22px]">auto_fix_high</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                One-Click Auto-Draft Reschedule
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-formulated recruiter outreach to resolve the 45m conflict with {confirmedCompany}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Conflict Summary Chip */}
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-red-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>
              Clash: {confirmedCompany} (10:30-11:45) vs {clashingCompany} (11:00-12:00)
            </span>
          </div>
          <span className="font-mono-code text-red-400 font-bold">45m Overlap</span>
        </div>

        {/* Preferred Slot Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
            Select Proposed Alternative Slot
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              'Tomorrow, Oct 24 • 03:00 PM',
              'Friday, Oct 25 • 10:00 AM',
              'Friday, Oct 25 • 02:00 PM',
            ].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${selectedSlot.includes(slot.split('•')[0].trim())
                    ? 'border-[#22d3ee] bg-[#22d3ee]/10 text-white font-semibold shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                    : 'border-slate-800 bg-[#151f32] text-slate-400 hover:text-white'
                  }`}
              >
                <div className="font-mono-code">{slot}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Preview Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono-code">
              Generated Email Draft
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-[#22d3ee] hover:underline flex items-center gap-1 font-mono-code"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-[#080e1b] border border-slate-800 text-xs text-slate-300 font-mono-code whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            <div className="text-slate-400 border-b border-slate-800/80 pb-2 mb-2 font-medium">
              <strong>Subject:</strong> {emailSubject}
            </div>
            {emailBody}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#151f32] hover:bg-[#242a38] text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#242a38] hover:bg-[#333948] text-[#22d3ee] text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy to Clipboard</span>
          </button>
          <button
            onClick={handleSimulateSend}
            disabled={sentStatus}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] hover:from-blue-600 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              {sentStatus ? 'done_all' : 'send'}
            </span>
            <span>{sentStatus ? 'Request Sent!' : 'Send via Placement Cell API'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
