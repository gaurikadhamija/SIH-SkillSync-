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
    <header className="sticky top-0 z-40 bg-[#FFFDFC] border-b border-[#DED8CE] text-[#292A27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & Platform Mission */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#718C78] flex items-center justify-center font-serif font-bold text-lg text-[#FFFDFC] shadow-xs border border-[#586F5E]/30">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold tracking-tight text-[#292A27]">
                  SkillSync
                </h1>
                <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 rounded-md bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40">
                  Curriculum & Market Alignment
                </span>
              </div>
              <p className="text-xs text-[#6F706A]">
                Grounding education in real industry hiring telemetry across students, employers & government
              </p>
            </div>
          </div>

          {/* Persona Switcher Tabs - Solid, tactile, warm neutral styling */}
          <div className="flex items-center bg-[#F5F0E8] p-1 rounded-lg border border-[#DED8CE] overflow-x-auto">
            <button
              id="role-tab-student"
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                currentRole === 'student'
                  ? 'bg-[#718C78] text-[#FFFDFC] shadow-xs'
                  : 'text-[#6F706A] hover:text-[#292A27] hover:bg-[#FFFDFC]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>1. Student UI</span>
              {studentSkillCount > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                    currentRole === 'student'
                      ? 'bg-[#586F5E] text-[#FFFDFC]'
                      : 'bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40'
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
                  ? 'bg-[#718C78] text-[#FFFDFC] shadow-xs'
                  : 'text-[#6F706A] hover:text-[#292A27] hover:bg-[#FFFDFC]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>2. Employer UI</span>
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                  currentRole === 'employer'
                    ? 'bg-[#586F5E] text-[#FFFDFC]'
                    : 'bg-[#FFFDFC] text-[#6F706A] border border-[#DED8CE]'
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
                  ? 'bg-[#718C78] text-[#FFFDFC] shadow-xs'
                  : 'text-[#6F706A] hover:text-[#292A27] hover:bg-[#FFFDFC]'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>3. Government UI</span>
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                  currentRole === 'government'
                    ? 'bg-[#C9826B] text-[#FFFDFC]'
                    : 'bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8]'
                }`}
              >
                {uncoveredGapCount} Gaps
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Sub-Banner with Context */}
      <div className="bg-[#FAF7F2] border-t border-[#DED8CE] px-4 sm:px-6 lg:px-8 py-2 text-xs text-[#6F706A] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#292A27]">Active Workspace:</span>
          {currentRole === 'student' && (
            <span className="text-[#292A27] font-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#718C78]"></span>
              Student Skills & Pathway Guide — Evaluate knowledge (e.g. Python 60%), target goal, explore missing skills & job postings
            </span>
          )}
          {currentRole === 'employer' && (
            <span className="text-[#292A27] font-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9AAA8F]"></span>
              Employer Audit & Ground Parity — Validate resume claims against live technical interviews and submit curriculum patches
            </span>
          )}
          {currentRole === 'government' && (
            <span className="text-[#292A27] font-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C9826B]"></span>
              Government Policy Planning — Map regional demand vs course coverage, flag obsolete tracks, and download district action plans
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[#6F706A] text-[11px]">
          <span className="flex items-center gap-1 text-[#586F5E] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#718C78]" />
            Hiring Telemetry: Q3 2026
          </span>
          <span className="text-[#DED8CE]">•</span>
          <span>4 Districts Active</span>
        </div>
      </div>
    </header>
  );
};
