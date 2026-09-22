import React from 'react';
import { DashboardRole } from '../types';
import { GraduationCap, Building2, Landmark, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentRole: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
  studentSkillCount: number;
  uncoveredGapCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  studentSkillCount,
  uncoveredGapCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFC] border-b border-[#DED8CE] text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & Platform Mission in Navy */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center font-serif font-bold text-lg text-[#FFFFFF] shadow-xs border border-[#1E293B]">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold tracking-tight text-[#0F172A]">
                  SkillSync
                </h1>
                <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE]">
                  Curriculum &amp; Market Alignment
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Grounding education in real industry hiring telemetry across students, employers &amp; government
              </p>
            </div>
          </div>

          {/* Persona Switcher Tabs in Dark Tone */}
          <div className="flex items-center bg-[#101827] p-1 rounded-lg border border-[#1E2D44] overflow-x-auto">
            <button
              id="role-tab-student"
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'student'
                  ? 'bg-[#2563EB] text-[#FFFFFF] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>1. Student UI</span>
              {studentSkillCount > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                    currentRole === 'student'
                      ? 'bg-[#1D4ED8] text-[#FFFFFF]'
                      : 'bg-[#1E293B] text-[#93C5FD]'
                  }`}
                >
                  {studentSkillCount} assessed
                </span>
              )}
            </button>

            <button
              id="role-tab-employer"
              onClick={() => onRoleChange('employer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'employer'
                  ? 'bg-[#0284C7] text-[#FFFFFF] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>2. Employer UI</span>
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                  currentRole === 'employer'
                    ? 'bg-[#0369A1] text-[#FFFFFF]'
                    : 'bg-[#1E293B] text-[#7DD3FC]'
                }`}
              >
                Parity Check
              </span>
            </button>

            <button
              id="role-tab-government"
              onClick={() => onRoleChange('government')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'government'
                  ? 'bg-[#C9826B] text-[#FFFFFF] shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B]'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>3. Government UI</span>
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                  currentRole === 'government'
                    ? 'bg-[#B26E58] text-[#FFFFFF]'
                    : 'bg-[#1E293B] text-[#FCA5A5]'
                }`}
              >
                {uncoveredGapCount} Gaps
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Banner in Navy / Dark Tone */}
      <div className="bg-[#FAF7F2] border-t border-[#DED8CE] px-4 sm:px-6 lg:px-8 py-2 text-xs text-[#64748B] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#0F172A]">Active Workspace:</span>
          {currentRole === 'student' && (
            <span className="text-[#0F172A] font-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              Student Skills &amp; Pathway Guide — Evaluate knowledge (e.g. Python 60%), target goal, explore missing skills &amp; job postings
            </span>
          )}
          {currentRole === 'employer' && (
            <span className="text-[#0F172A] font-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
              Employer Audit &amp; Ground Parity — Validate resume claims against live technical interviews and submit curriculum patches
            </span>
          )}
          {currentRole === 'government' && (
            <span className="text-[#0F172A] font-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C9826B]"></span>
              Government Policy Planning — Map regional demand vs course coverage, flag obsolete tracks, and download district action plans
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[#64748B] text-[11px]">
          <span className="flex items-center gap-1 text-[#1E3A8A] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
            Hiring Telemetry: Q3 2026
          </span>
          <span className="text-[#DED8CE]">•</span>
          <span>4 Districts Monitored</span>
        </div>
      </div>
    </header>
  );
};
