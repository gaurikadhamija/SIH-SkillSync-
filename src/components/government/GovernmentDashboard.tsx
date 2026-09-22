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
      {/* Hero Header */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 text-[#292A27] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40">
              Workforce Telemetry &amp; Curriculum Policy
            </span>
            <span className="text-xs text-[#6F706A]">Demand-to-Capacity Alignment</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-[#292A27]">
            Aligning Educational Capacity with Real Economic Demand
          </h2>
          <p className="text-sm text-[#6F706A] leading-relaxed">
            Analyze real job postings and placement telemetry across districts. Identify obsolete
            vocational tracks, detect zero-coverage skill gaps where no courses exist, patch
            curricula with high-demand modules, and export actionable district policy briefs.
          </p>
        </div>

        {/* Generate Report CTA */}
        <button
          id="open-district-report-btn"
          onClick={() => setShowReportModal(true)}
          className="px-5 py-2.5 rounded-lg bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] text-xs font-medium flex items-center gap-2 shadow-xs transition shrink-0 self-start md:self-center border border-[#586F5E]/30"
        >
          <FileText className="w-4 h-4" />
          <span>Export District Action Report ({currentDistrict.districtName})</span>
        </button>
      </div>

      {/* FILTER BAR: District, Sector, Demand Tier */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#718C78]" />
            <span className="text-sm font-serif font-bold text-[#292A27]">
              Regional Workforce Filters:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-3xl">
            {/* Pick District */}
            <div>
              <label className="block text-[11px] font-medium text-[#6F706A] mb-1">
                1. District / Region
              </label>
              <select
                id="district-select"
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#718C78]"
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
              <label className="block text-[11px] font-medium text-[#6F706A] mb-1">
                2. Economic Sector
              </label>
              <select
                id="sector-select"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#718C78]"
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
              <label className="block text-[11px] font-medium text-[#6F706A] mb-1">
                3. Demand Tier
              </label>
              <select
                id="demand-tier-select"
                value={selectedDemandTier}
                onChange={(e) => setSelectedDemandTier(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#718C78]"
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

      {/* REGIONAL SNAPSHOT STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Active Job Postings
          </span>
          <span className="text-2xl font-serif font-bold text-[#292A27] block mt-1">
            {currentDistrict.activeJobPostings.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#586F5E] font-medium">
            Pulled from verified job boards
          </span>
        </div>

        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Zero-Coverage Skill Gaps
          </span>
          <span className="text-2xl font-serif font-bold text-[#C9826B] block mt-1">
            {uncoveredSkills.length} Critical
          </span>
          <span className="text-[10px] text-[#C9826B]">
            High demand but 0 courses teaching it
          </span>
        </div>

        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Obsolete Tracks Flagged
          </span>
          <span className="text-2xl font-serif font-bold text-[#292A27] block mt-1">
            {obsoleteCourses.length} Programs
          </span>
          <span className="text-[10px] text-[#6F706A]">
            Negligible hiring volume
          </span>
        </div>

        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Oversaturated Programs
          </span>
          <span className="text-2xl font-serif font-bold text-[#6F706A] block mt-1">
            {oversaturatedCourses.length} Tracks
          </span>
          <span className="text-[10px] text-[#6F706A]">
            Graduates heavily exceed openings
          </span>
        </div>
      </div>

      {/* CRITICAL GAP ALERT: In-Demand Skills with NO Course Covering Them */}
      <div className="bg-[#FAF1ED] border border-[#E8C7B8] rounded-xl p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFFDFC] text-[#C9826B] border border-[#E8C7B8] flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#292A27] flex items-center gap-2">
                Critical Gap Alert: In-Demand Skills with ZERO Course Coverage
              </h3>
              <p className="text-xs text-[#6F706A]">
                Industry is actively hiring for these skills in {currentDistrict.districtName}, but not a single accredited state vocational or college curriculum covers them.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FFFDFC] text-[#C9826B] border border-[#E8C7B8] shrink-0">
            {uncoveredSkills.length} Uncovered Gaps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {uncoveredSkills.map((sk) => (
            <div
              key={sk.skill}
              className="bg-[#FFFDFC] border border-[#E8C7B8] p-4 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-[#292A27]">
                    {sk.skill}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] uppercase">
                    0 Courses
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6F706A] mb-2">
                  <span className="font-mono text-[#586F5E] font-semibold">
                    {sk.jobDemandCount.toLocaleString()} Postings
                  </span>
                  <span className="text-[#DED8CE]">•</span>
                  <span className="text-[#6F706A]">{sk.sector}</span>
                </div>
                <p className="text-[11px] text-[#6F706A] leading-relaxed mb-3">
                  Local employers forced to spend 4–6 months retraining graduates or outsource to other states.
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#DED8CE] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#C9826B] font-medium">
                  Priority Action Needed
                </span>
                <button
                  onClick={() => alert(`Curriculum drafting mandate initiated for "${sk.skill}" in ${currentDistrict.districtName}. Added to state board review agenda.`)}
                  className="px-2.5 py-1 rounded-md bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFDFC] font-medium text-[11px] transition shadow-xs border border-[#B26E58]/30"
                >
                  Propose Course Mandate →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Compare What Skills are in Demand vs What Courses Actually Teach */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#718C78]" />
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                Supply vs. Demand Analysis: Market Demand vs. Existing Course Coverage
              </h3>
            </div>
            <p className="text-xs text-[#6F706A] mt-0.5">
              Comparison of real job openings against existing vocational &amp; university syllabi in {currentDistrict.districtName}
            </p>
          </div>
          <span className="text-xs text-[#6F706A]">
            Showing {filteredSkills.length} Skills in Sector Filter
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#DED8CE]">
          <table className="w-full text-left text-sm text-[#292A27]">
            <thead className="bg-[#FAF7F2] text-[11px] uppercase tracking-wider text-[#6F706A] border-b border-[#DED8CE]">
              <tr>
                <th className="py-3 px-4">Market In-Demand Skill</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Industry Hiring Volume</th>
                <th className="py-3 px-4">Demand Tier</th>
                <th className="py-3 px-4">Existing Courses Covering It</th>
                <th className="py-3 px-4">Curriculum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DED8CE] font-normal text-xs bg-[#FFFDFC]">
              {filteredSkills.map((sk) => (
                <tr key={sk.skill} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-[#292A27]">
                    {sk.skill}
                  </td>
                  <td className="py-3.5 px-4 text-[#6F706A]">
                    {sk.sector}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#292A27]">
                    {sk.jobDemandCount.toLocaleString()} openings
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        sk.demandTier === 'High'
                          ? 'bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8]'
                          : sk.demandTier === 'Medium'
                          ? 'bg-[#F5F0E8] text-[#6F706A] border border-[#DED8CE]'
                          : 'bg-[#FAF7F2] text-[#6F706A] border border-[#DED8CE]'
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
                            className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] text-[11px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#C9826B] font-medium text-xs flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        0 Courses Covering (Critical Gap)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {sk.hasCoveringCourse ? (
                      <span className="inline-flex items-center gap-1 text-[#586F5E] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#718C78]" /> Covered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#C9826B] font-medium">
                        <AlertTriangle className="w-4 h-4 text-[#C9826B]" /> Uncovered Gap
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: Course Outdatedness & Saturation Alerts */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-[#C9826B]" />
          <h3 className="text-lg font-serif font-bold text-[#292A27]">
            Curriculum Misalignment Alerts: Obsolete &amp; Oversaturated Programs
          </h3>
        </div>
        <p className="text-xs text-[#6F706A] mb-6">
          Alerts for courses where either: <strong>(a) nobody&apos;s hiring for that skill anymore</strong>, or <strong>(b) too many people are trained in it compared to actual job openings</strong>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ALERT TYPE A: Nobody's hiring for this skill anymore (Obsolete) */}
          <div className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] uppercase">
                  Alert Type (A): Obsolete Skills
                </span>
                <span className="text-xs text-[#6F706A]">
                  Zero / Negligible Hiring
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-[#292A27] mb-3">
                &quot;Nobody is hiring for these skills in 2026&quot;
              </h4>

              <div className="space-y-3">
                {obsoleteCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg border border-[#DED8CE] bg-[#FFFDFC] text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-[#292A27] text-sm">
                        {c.name} ({c.code})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] shrink-0">
                        Placement: {c.placementRate}%
                      </span>
                    </div>
                    <p className="text-[#6F706A] text-[11px] mb-2 leading-relaxed">
                      {c.alertReason}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#DED8CE] text-[11px]">
                      <span className="text-[#6F706A]">
                        {c.currentEnrolled} students enrolled in {c.district}
                      </span>
                      <button
                        onClick={() => handleSunsetCourse(c.id)}
                        className="px-2.5 py-1 rounded-md bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFDFC] font-medium transition border border-[#B26E58]/30 shadow-xs"
                      >
                        Sunset &amp; Reallocate Budget
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALERT TYPE B: Too many people trained compared to actual openings (Oversaturated) */}
          <div className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F5F0E8] text-[#6F706A] border border-[#DED8CE] uppercase">
                  Alert Type (B): Oversaturated Skills
                </span>
                <span className="text-xs text-[#6F706A]">
                  Supply Surplus
                </span>
              </div>
              <h4 className="text-sm font-serif font-bold text-[#292A27] mb-3">
                &quot;Too many people trained vs actual job openings&quot;
              </h4>

              <div className="space-y-3">
                {oversaturatedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg border border-[#DED8CE] bg-[#FFFDFC] text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-[#292A27] text-sm">
                        {c.name} ({c.code})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F5F0E8] text-[#6F706A] border border-[#DED8CE] shrink-0">
                        {c.graduatesPerYear} Grads vs {c.jobOpeningsForGraduate} Jobs
                      </span>
                    </div>
                    <p className="text-[#6F706A] text-[11px] mb-2 leading-relaxed">
                      {c.alertReason}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#DED8CE] text-[11px]">
                      <span className="text-[#6F706A]">
                        Surplus: {(c.graduatesPerYear / (c.jobOpeningsForGraduate || 1)).toFixed(1)}x oversupply
                      </span>
                      <button
                        onClick={() => setSelectedCourseIdForPatch(c.id)}
                        className="px-2.5 py-1 rounded-md bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] font-medium transition border border-[#586F5E]/30 shadow-xs"
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

      {/* SECTION: Course Modernization & Gap Patch Engine */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#718C78]" />
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                Curriculum Gap Patch Engine
              </h3>
            </div>
            <p className="text-xs text-[#6F706A] mt-0.5">
              For a given course, suggest what to add/change based on the gap (e.g. &apos;Course X doesn&apos;t cover Skill Y, which is in high demand — recommend adding it&apos;)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6F706A] font-medium">Select Course:</span>
            <select
              id="patch-course-select"
              value={selectedCourseIdForPatch}
              onChange={(e) => setSelectedCourseIdForPatch(e.target.value)}
              className="bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#718C78]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patch Suggestion Card */}
        {currentPatchTargetCourse && (
          <div className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h4 className="text-base font-serif font-bold text-[#292A27]">
                    {currentPatchTargetCourse.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FFFDFC] border border-[#DED8CE] text-[#6F706A]">
                    {currentPatchTargetCourse.institutionType}
                  </span>
                  <span className="text-xs text-[#6F706A]">
                    • {currentPatchTargetCourse.district}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      currentPatchTargetCourse.statusAlert === 'Modernized'
                        ? 'bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40'
                        : 'bg-[#FFFDFC] border border-[#DED8CE] text-[#6F706A]'
                    }`}
                  >
                    Status: {currentPatchTargetCourse.statusAlert || 'Review'}
                  </span>
                </div>

                <div className="text-xs text-[#6F706A]">
                  Currently Teaches:{' '}
                  <span className="text-[#292A27] font-medium">
                    {currentPatchTargetCourse.skillsTaught.join(', ')}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-[#6F706A] block">
                  Current Placement Rate:
                </span>
                <span className="text-xl font-serif font-bold text-[#586F5E]">
                  {currentPatchTargetCourse.placementRate}%
                </span>
              </div>
            </div>

            {/* Gap & Recommendation Diagnosis */}
            {patchSuggestion ? (
              <div className="bg-[#FFFDFC] border border-[#DED8CE] p-4 rounded-xl space-y-3 text-xs mb-4">
                <div className="flex items-start gap-2 text-[#C9826B]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#C9826B]" />
                  <div>
                    <strong className="font-semibold text-[#292A27]">Curriculum Gap Detected: </strong>
                    {currentPatchTargetCourse.name} does NOT cover{' '}
                    <span className="text-[#C9826B] font-bold underline">
                      {patchSuggestion.missingHighDemandSkill}
                    </span>
                    , which is in HIGH DEMAND ({patchSuggestion.industryDemandCount.toLocaleString()} open jobs in the district).
                  </div>
                </div>

                <div className="text-[#6F706A] leading-relaxed pl-6">
                  {patchSuggestion.reason}
                </div>

                <div className="p-3 bg-[#EEF3EE] rounded-lg border border-[#9AAA8F]/40 text-[#292A27] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#718C78] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#586F5E] block mb-0.5">
                      Recommended Action: Add {patchSuggestion.estimatedWeeks}-Week Industry Module
                    </span>
                    <span>{patchSuggestion.proposedModule}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#FFFDFC] border border-[#DED8CE] rounded-xl text-xs text-[#6F706A] mb-4">
                This course has recently been audited or updated. No major unaddressed critical gap.
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6F706A]">
                Syllabus Version: {currentPatchTargetCourse.syllabusLastUpdated}
              </span>
              <button
                id="apply-curriculum-patch-btn"
                disabled={patchedCourses.includes(currentPatchTargetCourse.id)}
                onClick={() => handleApplyPatch(currentPatchTargetCourse.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
                  patchedCourses.includes(currentPatchTargetCourse.id)
                    ? 'bg-[#EEF3EE] text-[#586F5E] border-[#9AAA8F] cursor-default'
                    : 'bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] border-[#586F5E]/30 shadow-xs'
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
