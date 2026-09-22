import React, { useState } from 'react';
import {
  DistrictMarketData,
  ExistingCourse,
  CurriculumPatchSuggestion,
} from '../../types';
import {
  DISTRICT_MARKET_DATA,
  EXISTING_COURSES,
  CURRICULUM_PATCH_SUGGESTIONS,
} from '../../data/mockData';
import { DistrictReportModal } from './DistrictReportModal';
import {
  Landmark,
  Filter,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
  Download,
  Building,
  RefreshCw,
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  // District Filter
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('bengaluru_urban');
  // Sector Filter
  const [selectedSector, setSelectedSector] = useState<string>('All');
  // Demand Tier Filter
  const [selectedDemandTier, setSelectedDemandTier] = useState<string>('All');

  // Courses state (allows simulating patches)
  const [courses, setCourses] = useState<ExistingCourse[]>(EXISTING_COURSES);

  // Selected Course for Gap Patch Analysis
  const [selectedCourseIdForPatch, setSelectedCourseIdForPatch] = useState<string>('crs-4');
  const [patchedCourses, setPatchedCourses] = useState<string[]>([]);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);

  // Active District Data
  const currentDistrict =
    DISTRICT_MARKET_DATA.find((d) => d.districtId === selectedDistrictId) ||
    DISTRICT_MARKET_DATA[0];

  // Unique sectors for filter dropdown
  const allSectors = Array.from(
    new Set([
      'All',
      ...DISTRICT_MARKET_DATA.flatMap((d) => d.primarySectors),
      ...currentDistrict.topInDemandRoles.map((r) => r.sector),
    ])
  );

  // Filtered Roles
  const filteredRoles = currentDistrict.topInDemandRoles.filter((r) => {
    const matchesSector = selectedSector === 'All' || r.sector === selectedSector;
    const matchesTier = selectedDemandTier === 'All' || r.demandTier === selectedDemandTier;
    return matchesSector && matchesTier;
  });

  // Filtered Skills
  const filteredSkills = currentDistrict.topInDemandSkills.filter((s) => {
    const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
    const matchesTier = selectedDemandTier === 'All' || s.demandTier === selectedDemandTier;
    return matchesSector && matchesTier;
  });

  // Uncovered Skills Gap: In-demand skills with NO course covering them
  const uncoveredSkills = currentDistrict.topInDemandSkills.filter(
    (s) => !s.hasCoveringCourse
  );

  // Courses with Alerts
  const districtCourses = courses.filter((c) =>
    c.district.toLowerCase().includes(currentDistrict.districtName.toLowerCase().split(' ')[0])
  );

  const obsoleteCourses = courses.filter((c) => c.statusAlert === 'Obsolete');
  const oversaturatedCourses = courses.filter((c) => c.statusAlert === 'Oversaturated');

  // Course for Patch
  const currentPatchTargetCourse = courses.find((c) => c.id === selectedCourseIdForPatch);
  const patchSuggestion = CURRICULUM_PATCH_SUGGESTIONS.find(
    (p) => p.courseId === selectedCourseIdForPatch
  );

  const handleApplyPatch = (courseId: string) => {
    setPatchedCourses((prev) => [...prev, courseId]);
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            statusAlert: 'Modernized',
            placementRate: Math.min(94, c.placementRate + 32),
            syllabusLastUpdated: '2026-Q3 (Patched with Industry Module)',
            alertReason: 'Modernized with high-demand MLOps/Cloud/EV modules requested by industry.',
          };
        }
        return c;
      })
    );
  };

  const handleSunsetCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            statusAlert: 'Healthy',
            alertReason: 'Course phased out. Training budget and seats reallocated to emerging high-demand sectors.',
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dark Tone Hero Header Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 text-[#F8FAFC] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40">
              Workforce Telemetry &amp; Curriculum Policy
            </span>
            <span className="text-xs text-[#94A3B8]">Demand-to-Capacity Alignment</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-[#FFFFFF]">
            Aligning Educational Capacity with Real Economic Demand
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Analyze real job postings and placement telemetry across districts. Identify obsolete
            vocational tracks, detect zero-coverage skill gaps where no courses exist, patch
            curricula with high-demand modules, and export actionable district policy briefs.
          </p>
        </div>

        {/* Generate Report CTA */}
        <button
          id="open-district-report-btn"
          onClick={() => setShowReportModal(true)}
          className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium flex items-center gap-2 shadow-xs transition shrink-0 self-start md:self-center border border-[#3B82F6]/40 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Export District Action Report ({currentDistrict.districtName})</span>
        </button>
      </div>

      {/* FILTER BAR: Dark Tone Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-5 shadow-xs text-[#F8FAFC]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-sm font-serif font-bold text-[#FFFFFF]">
              Regional Workforce Filters:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-3xl">
            {/* Pick District */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                1. District / Region
              </label>
              <select
                id="district-select"
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
              >
                {DISTRICT_MARKET_DATA.map((d) => (
                  <option key={d.districtId} value={d.districtId}>
                    {d.districtName} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Pick Sector */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                2. Economic Sector
              </label>
              <select
                id="sector-select"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
              >
                {allSectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Pick Demand Tier */}
            <div>
              <label className="block text-[11px] font-medium text-[#94A3B8] mb-1">
                3. Demand Tier
              </label>
              <select
                id="demand-tier-select"
                value={selectedDemandTier}
                onChange={(e) => setSelectedDemandTier(e.target.value)}
                className="w-full bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="All">All Tiers (High, Med, Low)</option>
                <option value="High">High Demand Only</option>
                <option value="Medium">Medium Demand Only</option>
                <option value="Low">Low Demand Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* REGIONAL SNAPSHOT STATS: Dark Tone Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#131D2A] border border-[#223348] p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Active Job Postings
          </span>
          <span className="text-2xl font-serif font-bold text-[#FFFFFF] block mt-1">
            {currentDistrict.activeJobPostings.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#38BDF8] font-medium">
            Pulled from verified job boards
          </span>
        </div>

        <div className="bg-[#131D2A] border border-[#223348] p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Zero-Coverage Skill Gaps
          </span>
          <span className="text-2xl font-serif font-bold text-[#E07A5F] block mt-1">
            {uncoveredSkills.length} Critical
          </span>
          <span className="text-[10px] text-[#E07A5F]">
            High demand but 0 courses teaching it
          </span>
        </div>

        <div className="bg-[#131D2A] border border-[#223348] p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Obsolete Tracks Flagged
          </span>
          <span className="text-2xl font-serif font-bold text-[#FFFFFF] block mt-1">
            {obsoleteCourses.length} Programs
          </span>
          <span className="text-[10px] text-[#94A3B8]">
            Negligible hiring volume
          </span>
        </div>

        <div className="bg-[#131D2A] border border-[#223348] p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Oversaturated Programs
          </span>
          <span className="text-2xl font-serif font-bold text-[#CBD5E1] block mt-1">
            {oversaturatedCourses.length} Tracks
          </span>
          <span className="text-[10px] text-[#94A3B8]">
            Graduates heavily exceed openings
          </span>
        </div>
      </div>

      {/* CRITICAL GAP ALERT: In-Demand Skills with NO Course Covering Them in Dark Tone Box */}
      <div className="bg-[#1E1218] border border-[#C9826B]/50 rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/60 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5 text-[#E07A5F]" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#FFFFFF] flex items-center gap-2">
                Critical Gap Alert: In-Demand Skills with ZERO Course Coverage
              </h3>
              <p className="text-xs text-[#CBD5E1]">
                Industry is actively hiring for these skills in {currentDistrict.districtName}, but not a single accredited state vocational or college curriculum covers them.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/60 shrink-0">
            {uncoveredSkills.length} Uncovered Gaps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {uncoveredSkills.map((sk) => (
            <div
              key={sk.skill}
              className="bg-[#121A28] border border-[#2A3F58] p-4 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-[#FFFFFF]">
                    {sk.skill}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/50 uppercase">
                    0 Courses
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                  <span className="font-mono text-[#38BDF8] font-semibold">
                    {sk.jobDemandCount.toLocaleString()} Postings
                  </span>
                  <span className="text-[#334155]">•</span>
                  <span className="text-[#94A3B8]">{sk.sector}</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-3">
                  Local employers forced to spend 4–6 months retraining graduates or outsource to other states.
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#1E2D44] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#E07A5F] font-medium">
                  Priority Action Needed
                </span>
                <button
                  onClick={() => alert(`Curriculum drafting mandate initiated for "${sk.skill}" in ${currentDistrict.districtName}. Added to state board review agenda.`)}
                  className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-medium text-[11px] transition shadow-xs border border-[#3B82F6]/40 cursor-pointer"
                >
                  Propose Course Mandate →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Compare Supply vs Demand in Dark Tone Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                Supply vs. Demand Analysis: Market Demand vs. Existing Course Coverage
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Comparison of real job openings against existing vocational &amp; university syllabi in {currentDistrict.districtName}
            </p>
          </div>
          <span className="text-xs text-[#94A3B8]">
            Showing {filteredSkills.length} Skills in Sector Filter
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#223348]">
          <table className="w-full text-left text-sm text-[#F8FAFC]">
            <thead className="bg-[#0B1320] text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#223348]">
              <tr>
                <th className="py-3 px-4">Market In-Demand Skill</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Industry Hiring Volume</th>
                <th className="py-3 px-4">Demand Tier</th>
                <th className="py-3 px-4">Existing Courses Covering It</th>
                <th className="py-3 px-4">Curriculum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D44] font-normal text-xs bg-[#0F1724]">
              {filteredSkills.map((sk) => (
                <tr key={sk.skill} className="hover:bg-[#162132]/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-[#FFFFFF]">
                    {sk.skill}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {sk.sector}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#FFFFFF]">
                    {sk.jobDemandCount.toLocaleString()} openings
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        sk.demandTier === 'High'
                          ? 'bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40'
                          : sk.demandTier === 'Medium'
                          ? 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                          : 'bg-[#0B1320] text-[#64748B] border border-[#223348]'
                      }`}
                    >
                      {sk.demandTier} Demand
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {sk.hasCoveringCourse ? (
                      <div className="flex flex-wrap gap-1">
                        {sk.coveredByCourses.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#162132] border border-[#2A3F58] text-[#FFFFFF] text-[11px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#E07A5F] font-medium text-xs flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        0 Courses Covering (Critical Gap)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {sk.hasCoveringCourse ? (
                      <span className="inline-flex items-center gap-1 text-[#38BDF8] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" /> Covered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#E07A5F] font-medium">
                        <AlertTriangle className="w-4 h-4 text-[#E07A5F]" /> Uncovered Gap
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: Course Outdatedness & Saturation Alerts in Dark Tone Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-[#E07A5F]" />
          <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
            Curriculum Misalignment Alerts: Obsolete &amp; Oversaturated Programs
          </h3>
        </div>
        <p className="text-xs text-[#94A3B8] mb-6">
          Alerts for courses where either: <strong>(a) nobody&apos;s hiring for that skill anymore</strong>, or <strong>(b) too many people are trained in it compared to actual job openings</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ALERT TYPE A: Obsolete Skills in Dark Tone Box */}
          <div className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/50 uppercase">
                  Alert Type (A): Obsolete Skills
                </span>
                <span className="text-xs text-[#94A3B8]">
                  Zero / Negligible Hiring
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-[#FFFFFF] mb-3">
                &quot;Nobody is hiring for these skills in 2026&quot;
              </h4>

              <div className="space-y-3">
                {obsoleteCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg border border-[#223348] bg-[#131D2A] text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-[#FFFFFF] text-sm">
                        {c.name} ({c.code})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/50 shrink-0">
                        Placement: {c.placementRate}%
                      </span>
                    </div>
                    <p className="text-[#94A3B8] text-[11px] mb-2 leading-relaxed">
                      {c.alertReason}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1E2D44] text-[11px]">
                      <span className="text-[#94A3B8]">
                        {c.currentEnrolled} students enrolled in {c.district}
                      </span>
                      <button
                        onClick={() => handleSunsetCourse(c.id)}
                        className="px-2.5 py-1 rounded-md bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFFFF] font-medium transition border border-[#C9826B]/40 shadow-xs cursor-pointer"
                      >
                        Sunset &amp; Reallocate Budget
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALERT TYPE B: Oversaturated Skills in Dark Tone Box */}
          <div className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40 uppercase">
                  Alert Type (B): Oversaturated Skills
                </span>
                <span className="text-xs text-[#94A3B8]">
                  Supply Surplus
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-[#FFFFFF] mb-3">
                &quot;Too many people trained vs actual job openings&quot;
              </h4>

              <div className="space-y-3">
                {oversaturatedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg border border-[#223348] bg-[#131D2A] text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-[#FFFFFF] text-sm">
                        {c.name} ({c.code})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E293B] text-[#94A3B8] border border-[#334155] shrink-0">
                        {c.graduatesPerYear} Grads vs {c.jobOpeningsForGraduate} Jobs
                      </span>
                    </div>
                    <p className="text-[#94A3B8] text-[11px] mb-2 leading-relaxed">
                      {c.alertReason}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1E2D44] text-[11px]">
                      <span className="text-[#94A3B8]">
                        Surplus: {(c.graduatesPerYear / (c.jobOpeningsForGraduate || 1)).toFixed(1)}x oversupply
                      </span>
                      <button
                        onClick={() => setSelectedCourseIdForPatch(c.id)}
                        className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-medium transition border border-[#3B82F6]/40 shadow-xs cursor-pointer"
                      >
                        Modernize Curriculum →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Course Modernization & Gap Patch Engine in Dark Tone Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                Curriculum Gap Patch Engine
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              For a given course, suggest what to add/change based on the gap (e.g. &apos;Course X doesn&apos;t cover Skill Y, which is in high demand — recommend adding it&apos;)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] font-medium">Select Course:</span>
            <select
              id="patch-course-select"
              value={selectedCourseIdForPatch}
              onChange={(e) => setSelectedCourseIdForPatch(e.target.value)}
              className="bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patch Suggestion Card in Dark Tone */}
        {currentPatchTargetCourse && (
          <div className="bg-[#0F1724] border border-[#223348] rounded-xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h4 className="text-base font-serif font-bold text-[#FFFFFF]">
                    {currentPatchTargetCourse.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E293B] border border-[#334155] text-[#94A3B8]">
                    {currentPatchTargetCourse.institutionType}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    • {currentPatchTargetCourse.district}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      currentPatchTargetCourse.statusAlert === 'Modernized'
                        ? 'bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40'
                        : 'bg-[#1E293B] border border-[#334155] text-[#94A3B8]'
                    }`}
                  >
                    Status: {currentPatchTargetCourse.statusAlert || 'Review'}
                  </span>
                </div>

                <div className="text-xs text-[#94A3B8]">
                  Currently Teaches:{' '}
                  <span className="text-[#FFFFFF] font-medium">
                    {currentPatchTargetCourse.skillsTaught.join(', ')}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-[#94A3B8] block">
                  Current Placement Rate:
                </span>
                <span className="text-xl font-serif font-bold text-[#38BDF8]">
                  {currentPatchTargetCourse.placementRate}%
                </span>
              </div>
            </div>

            {/* Gap & Recommendation Diagnosis */}
            {patchSuggestion ? (
              <div className="bg-[#131D2A] border border-[#223348] p-4 rounded-xl space-y-3 text-xs mb-4">
                <div className="flex items-start gap-2 text-[#E07A5F]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#E07A5F]" />
                  <div>
                    <strong className="font-semibold text-[#FFFFFF]">Curriculum Gap Detected: </strong>
                    {currentPatchTargetCourse.name} does NOT cover{' '}
                    <span className="text-[#E07A5F] font-bold underline">
                      {patchSuggestion.missingHighDemandSkill}
                    </span>
                    , which is in HIGH DEMAND ({patchSuggestion.industryDemandCount.toLocaleString()} open jobs in the district).
                  </div>
                </div>

                <div className="text-[#94A3B8] leading-relaxed pl-6">
                  {patchSuggestion.reason}
                </div>

                <div className="p-3 bg-[#10243C] rounded-lg border border-[#2563EB]/40 text-[#F8FAFC] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#60A5FA] block mb-0.5">
                      Recommended Action: Add {patchSuggestion.estimatedWeeks}-Week Industry Module
                    </span>
                    <span>{patchSuggestion.proposedModule}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#131D2A] border border-[#223348] rounded-xl text-xs text-[#94A3B8] mb-4">
                This course has recently been audited or updated. No major unaddressed critical gap.
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#94A3B8]">
                Syllabus Version: {currentPatchTargetCourse.syllabusLastUpdated}
              </span>
              <button
                id="apply-curriculum-patch-btn"
                disabled={patchedCourses.includes(currentPatchTargetCourse.id)}
                onClick={() => handleApplyPatch(currentPatchTargetCourse.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border cursor-pointer ${
                  patchedCourses.includes(currentPatchTargetCourse.id)
                    ? 'bg-[#1E2E44] text-[#60A5FA] border-[#2563EB]/40 cursor-default'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] border-[#3B82F6]/40 shadow-xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {patchedCourses.includes(currentPatchTargetCourse.id)
                    ? '✓ Syllabus Patched & Approved'
                    : 'Simulate Applying Recommended Curriculum Patch'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* District Report Modal */}
      {showReportModal && (
        <DistrictReportModal
          district={currentDistrict}
          courses={courses}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
