'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CompanyDriveCard from '@/components/ui/CompanyDriveCard';
import { companyDrives } from '@/data/mockData';
import { CompanyDrive } from '@/types';
import { getCompanies, hasSession } from '@/lib/api';

export default function CompaniesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyDrive | null>(null);
  const [companies, setCompanies] = useState<CompanyDrive[]>(companyDrives);

  useEffect(() => {
    if (!hasSession()) return;
    getCompanies().then((savedCompanies) => {
      const fromDatabase: CompanyDrive[] = savedCompanies.map((company) => ({
        id: String(company.id), name: company.name, category: 'Tier-2 Tech',
        industry: company.location ?? 'Placement partner', logoIcon: 'business',
        locations: company.location ?? 'Not specified', rolesOpen: ['Roles tracked in Applications'],
        ctcRange: 'Not specified', eligibilityCgpa: 0, status: 'Applications Open', statusColor: 'secondary',
      }));
      setCompanies(fromDatabase);
    }).catch(() => undefined);
  }, []);

  const categories = [
    'All',
    'Tier-1 Dream',
    'Tier-2 Tech',
    'Fintech & Quant',
  ];

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.rolesOpen.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory === 'All') return true;
      return company.category === selectedCategory;
    });
  }, [companies, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-[28px] text-white font-bold tracking-tight font-display">
            Companies Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Explore active campus recruiters, compensation packages, and eligibility criteria
          </p>
        </div>

        {/* Quick Drive Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#111827] border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Visiting:</span>
            <span className="font-mono-code font-bold text-[#22d3ee]">{companies.length} Companies</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#111827] border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Avg CTC:</span>
            <span className="font-mono-code font-bold text-white">₹25.8 LPA</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                  : 'bg-[#151f32] text-slate-400 hover:text-white border border-slate-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or role..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#151f32] border border-slate-700/60 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#22d3ee]"
          />
        </div>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => (
          <CompanyDriveCard
            key={company.id}
            company={company}
            onSelect={() => setSelectedCompany(company)}
          />
        ))}
      </div>

      {/* Company Details Modal (if selected) */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#151f32] border border-slate-700 flex items-center justify-center text-[#22d3ee]">
                  <span className="material-symbols-outlined text-[24px]">
                    {selectedCompany.logoIcon}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedCompany.name}
                  </h3>
                  <span className="text-xs text-slate-400">{selectedCompany.industry}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#151f32] border border-slate-800 flex justify-between">
                <span className="text-slate-400">Package Range:</span>
                <span className="font-mono-code font-bold text-[#22d3ee]">
                  {selectedCompany.ctcRange}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#151f32] border border-slate-800 flex justify-between">
                <span className="text-slate-400">Eligibility Requirement:</span>
                <span className="font-mono-code text-white">
                  Minimum CGPA {selectedCompany.eligibilityCgpa.toFixed(1)} / 10
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#151f32] border border-slate-800 flex justify-between">
                <span className="text-slate-400">Drive Locations:</span>
                <span className="text-slate-200">{selectedCompany.locations}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-lg bg-[#151f32] text-slate-300 text-xs font-semibold hover:bg-[#242a38]"
              >
                Close
              </button>
              <a
                href="/applications"
                className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-xs font-bold hover:bg-blue-600"
              >
                Go to Applications
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
