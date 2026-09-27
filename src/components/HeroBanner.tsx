import React from 'react';
import { DashboardRole } from '../types';
import { 
  GraduationCap, 
  Building2, 
  Landmark, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Activity,
  ShieldCheck,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { APP_IMAGES } from '../assets/images';

interface HeroBannerProps {
  currentRole: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
  studentSkillCount: number;
  uncoveredGapCount: number;
  parityReportCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentRole,
  onRoleChange,
  studentSkillCount,
  uncoveredGapCount,
  parityReportCount,
}) => {
  return (
    <section className="mb-10">
      {/* High-Contrast Attention-Grabbing Hero Banner */}
      <div className="relative bg-[#0B1320] border-2 border-[#1E2D44] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden text-[#F8FAFC]">
        {/* Contrasting geometric ambient glow */}
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-[#1E3A8A] opacity-35 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#C9826B] opacity-25 blur-3xl pointer-events-none"
        />

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Brand Kicker */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#E07A5F]">
                  SkillSync
                </span>
                <span className="text-[#334155]">•</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#94A3B8]">
                  Industry &amp; Workforce Alignment Hub
                </span>
              </div>

              {/* Big in Bold Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FFFFFF] leading-[1.18] tracking-tight mb-4">
                SkillSync{' '}
                <span className="text-[#60A5FA]">
                  Grounding education in real industry hiring telemetry
                </span>{' '}
                across students, employers &amp; government
              </h1>

              {/* Contrasting Subtext */}
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed mb-6">
                Bridging the disconnect between academic syllabus certificates and real-world employer competencies.
                Powered by live technical evaluation, employer parity audits, and regional government workforce capacity planning.
              </p>

              {/* Visual 3-Stage Pipeline Graphic */}
              <div className="p-3.5 rounded-xl bg-[#101827]/80 border border-[#1E2D44] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px]">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-white">Student Audit</div>
                    <div className="text-[10px] text-slate-400">Practical testing</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block shrink-0" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-white">Employer Parity</div>
                    <div className="text-[10px] text-slate-400">On-ground delta</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block shrink-0" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[11px]">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-white">Curriculum Patch</div>
                    <div className="text-[10px] text-slate-400">Policy alignment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image & Live Telemetry Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#2B3B55] shadow-2xl group">
                <img
                  src={APP_IMAGES.heroBanner}
                  alt="SkillSync Live Telemetry Dashboard"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-transparent opacity-80" />
                
                {/* Floating Pictorial Indicator Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-[#334155]/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div>
                      <div className="font-semibold text-white">Live Telemetry Active</div>
                      <div className="text-[10px] text-slate-400">18 Districts Connected</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sky-400">89.4%</span>
                    <div className="text-[10px] text-slate-400">Audit Parity Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pictorial Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 pt-6 border-t border-[#1E2D44]">
            <div className="p-3.5 rounded-xl bg-[#101827] border border-[#1E2D44]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Verified Gaps</span>
                <span className="text-rose-400 font-bold">-48% Deficit</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">68.2%</div>
              <div className="text-[10px] text-slate-500 mt-1">Average Syllabus Lag</div>
              {/* Mini visual bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101827] border border-[#1E2D44]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Skill Assessment</span>
                <span className="text-sky-400 font-bold">Live Quiz</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">Python 60%</div>
              <div className="text-[10px] text-slate-500 mt-1">Baseline Candidate Score</div>
              {/* Mini visual bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101827] border border-[#1E2D44]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Employer Audits</span>
                <span className="text-emerald-400 font-bold">Validated</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{parityReportCount} Cases</div>
              <div className="text-[10px] text-slate-500 mt-1">Ground-truth Parity Logs</div>
              {/* Mini visual bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101827] border border-[#1E2D44]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>District Demand</span>
                <span className="text-amber-400 font-bold">Uncovered</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{uncoveredGapCount} Gaps</div>
              <div className="text-[10px] text-slate-500 mt-1">Zero-Coverage Skills</div>
              {/* Mini visual bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          {/* Role Switch Options Section */}
          <div className="pt-6 border-t border-[#1E2D44]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-[#E2E8F0]">
                Select Workspace Dashboard to View:
              </span>
              <span className="text-xs text-[#94A3B8]">
                Currently active:{' '}
                <strong className="text-[#FFFFFF] capitalize font-serif font-bold">
                  {currentRole === 'student'
                    ? '1. Student UI'
                    : currentRole === 'employer'
                    ? '2. Employer UI'
                    : '3. Government UI'}
                </strong>
              </span>
            </div>

            {/* 3 Dark Tone Switcher Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Student UI */}
              <button
                type="button"
                id="banner-switch-student"
                onClick={() => onRoleChange('student')}
                className={`text-left p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                  currentRole === 'student'
                    ? 'bg-[#162132] border-[#60A5FA] shadow-md ring-2 ring-[#60A5FA]/30'
                    : 'bg-[#101827] border-[#1E2D44] hover:border-[#3B82F6] hover:bg-[#162132]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        currentRole === 'student'
                          ? 'bg-[#2563EB] text-[#FFFFFF]'
                          : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] group-hover:text-[#FFFFFF]'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    {currentRole === 'student' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2563EB] text-[#FFFFFF]">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#94A3B8] flex items-center gap-1 group-hover:text-[#FFFFFF]">
                        Switch <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-serif font-bold text-[#FFFFFF] mb-1">
                    1. Student UI
                  </h2>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Evaluate skill proficiency (e.g. Python at 60%), select target career goals, and discover
                    curated courses &amp; matching job openings.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="font-medium text-[#60A5FA]">
                    {studentSkillCount} Skills Assessed
                  </span>
                  <span>Interactive Pathway</span>
                </div>
              </button>

              {/* Option 2: Employer UI */}
              <button
                type="button"
                id="banner-switch-employer"
                onClick={() => onRoleChange('employer')}
                className={`text-left p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                  currentRole === 'employer'
                    ? 'bg-[#162132] border-[#38BDF8] shadow-md ring-2 ring-[#38BDF8]/30'
                    : 'bg-[#101827] border-[#1E2D44] hover:border-[#38BDF8] hover:bg-[#162132]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        currentRole === 'employer'
                          ? 'bg-[#0284C7] text-[#FFFFFF]'
                          : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] group-hover:text-[#FFFFFF]'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    {currentRole === 'employer' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0284C7] text-[#FFFFFF]">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#94A3B8] flex items-center gap-1 group-hover:text-[#FFFFFF]">
                        Switch <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-serif font-bold text-[#FFFFFF] mb-1">
                    2. Employer UI
                  </h2>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Validate resume claims against live interview outcomes, review on-ground parity
                    discrepancies, and submit curriculum patches.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="font-medium text-[#38BDF8]">
                    {parityReportCount} Parity Audits Logged
                  </span>
                  <span>Ground-Truth Verification</span>
                </div>
              </button>

              {/* Option 3: Government UI */}
              <button
                type="button"
                id="banner-switch-government"
                onClick={() => onRoleChange('government')}
                className={`text-left p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                  currentRole === 'government'
                    ? 'bg-[#162132] border-[#E07A5F] shadow-md ring-2 ring-[#E07A5F]/30'
                    : 'bg-[#101827] border-[#1E2D44] hover:border-[#E07A5F] hover:bg-[#162132]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        currentRole === 'government'
                          ? 'bg-[#C9826B] text-[#FFFFFF]'
                          : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] group-hover:text-[#FFFFFF]'
                      }`}
                    >
                      <Landmark className="w-5 h-5" />
                    </div>
                    {currentRole === 'government' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9826B] text-[#FFFFFF]">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#94A3B8] flex items-center gap-1 group-hover:text-[#FFFFFF]">
                        Switch <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-serif font-bold text-[#FFFFFF] mb-1">
                    3. Government UI
                  </h2>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Compare regional market demand vs course capacity across districts, flag obsolete or
                    oversaturated tracks, and download action reports.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span className="font-medium text-[#E07A5F]">
                    {uncoveredGapCount} Zero-Coverage Gaps
                  </span>
                  <span>District Policy Telemetry</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

