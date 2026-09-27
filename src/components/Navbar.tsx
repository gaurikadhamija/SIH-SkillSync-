import React from 'react';
import { DashboardRole } from '../types';
import { 
  GraduationCap, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  User, 
  Lock, 
  ShieldCheck, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentRole: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
  studentSkillCount: number;
  uncoveredGapCount: number;
  onOpenAuthModal: (roleRequirement?: DashboardRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  studentSkillCount,
  uncoveredGapCount,
  onOpenAuthModal,
}) => {
  const { currentUser, canAccessRole, firebaseUser } = useAuth();

  const handleRoleTabClick = (role: DashboardRole) => {
    if (canAccessRole(role)) {
      onRoleChange(role);
    } else {
      // Role restricted: prompt modal with requirement
      onOpenAuthModal(role);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFC] border-b border-[#DED8CE] text-[#0F172A] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3.5 gap-3">
          {/* Logo & Platform Mission */}
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
                  Full-Stack Telemetry Hub
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Grounding education in real industry hiring telemetry across students, employers &amp; government
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
            {/* Persona Switcher Tabs */}
            <div className="flex items-center bg-[#101827] p-1 rounded-lg border border-[#1E2D44] overflow-x-auto">
              <button
                id="role-tab-student"
                onClick={() => handleRoleTabClick('student')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'student'
                    ? 'bg-[#2563EB] text-[#FFFFFF] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>1. Student Dashboard</span>
                {studentSkillCount > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                      currentRole === 'student'
                        ? 'bg-[#1D4ED8] text-[#FFFFFF]'
                        : 'bg-[#1E293B] text-[#93C5FD]'
                    }`}
                  >
                    {studentSkillCount}
                  </span>
                )}
              </button>

              <button
                id="role-tab-employer"
                onClick={() => handleRoleTabClick('employer')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'employer'
                    ? 'bg-[#0284C7] text-[#FFFFFF] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B]'
                }`}
              >
                {!canAccessRole('employer') && <Lock className="w-3 h-3 text-slate-400" />}
                <Building2 className="w-4 h-4" />
                <span>2. Employer Dashboard</span>
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
                onClick={() => handleRoleTabClick('government')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentRole === 'government'
                    ? 'bg-[#C9826B] text-[#FFFFFF] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B]'
                }`}
              >
                {!canAccessRole('government') && <Lock className="w-3 h-3 text-slate-400" />}
                <Landmark className="w-4 h-4" />
                <span>3. Government Dashboard</span>
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

            {/* Authentication & User Profile Badge */}
            <button
              onClick={() => onOpenAuthModal()}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFEA] border border-[#DED8CE] transition text-left cursor-pointer group shadow-2xs"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0) : 'U'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="hidden sm:block text-xs">
                <div className="font-bold text-[#0F172A] leading-tight flex items-center gap-1">
                  <span>{currentUser?.displayName?.split(' ')[0] || 'Member'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    currentUser?.role === 'government' 
                      ? 'bg-amber-100 text-amber-800' 
                      : currentUser?.role === 'employer' 
                      ? 'bg-sky-100 text-sky-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentUser?.role || 'User'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                  {firebaseUser ? 'Google Verified' : 'Demo Profile'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-0.5" />
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
            Cloud Firestore Connected
          </span>
          <span className="text-[#DED8CE]">•</span>
          <span>Role Guard Active</span>
        </div>
      </div>
    </header>
  );
};
