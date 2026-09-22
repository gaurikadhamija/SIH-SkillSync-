import React, { useState } from 'react';
import { OnGroundParityReport } from '../../types';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  PlusCircle,
  Search,
  TrendingDown,
} from 'lucide-react';

interface EmployerDashboardProps {
  parityReports: OnGroundParityReport[];
  onAddParityReport: (report: OnGroundParityReport) => void;
  onVoteReport: (id: string) => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  parityReports,
  onAddParityReport,
  onVoteReport,
}) => {
  // Modal for new parity report
  const [showModal, setShowModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'Moderate'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [roleAssessed, setRoleAssessed] = useState('');
  const [academicSource, setAcademicSource] = useState('Tier-2/3 Engineering & Technical Colleges');
  const [claimedProficiency, setClaimedProficiency] = useState('');
  const [actualOnGround, setActualOnGround] = useState('');
  const [observedDeficit, setObservedDeficit] = useState('');
  const [severity, setSeverity] = useState<'Critical' | 'Moderate' | 'Minor'>('Critical');
  const [curriculumPatch, setCurriculumPatch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleAssessed.trim() || !actualOnGround.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const newReport: OnGroundParityReport = {
      id: `rep-${Date.now()}`,
      employerName: companyName.trim(),
      industry,
      roleAssessed: roleAssessed.trim(),
      academicSource,
      claimedProficiency: claimedProficiency.trim() || 'Claimed proficiency from college syllabus',
      actualOnGroundProficiency: actualOnGround.trim(),
      observedDeficit: observedDeficit.trim() || 'Severe on-ground readiness delta observed during technical trials',
      severity,
      submittedDate: new Date().toISOString().split('T')[0],
      recommendedCurriculumPatch: curriculumPatch.trim() || 'Modernize course syllabus with production-grade labs and CI/CD tools.',
      votesAgree: 1,
    };

    onAddParityReport(newReport);
    setShowModal(false);
    // Reset
    setCompanyName('');
    setRoleAssessed('');
    setClaimedProficiency('');
    setActualOnGround('');
    setObservedDeficit('');
    setCurriculumPatch('');
  };

  const filteredReports = parityReports.filter((r) => {
    const matchesSeverity = filterSeverity === 'All' || r.severity === filterSeverity;
    const matchesSearch =
      r.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roleAssessed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.observedDeficit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Dark Tone Hero Header Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 text-[#F8FAFC] shadow-md">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40">
              Industry Ground-Truth Audit
            </span>
            <span className="text-xs text-[#94A3B8]">Hiring Discrepancy Registry</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-[#FFFFFF]">
            Validate the Skill Gap &amp; On-Ground Parity
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Bridge the disconnect between what university degrees certify and what candidates can
            actually deliver in production. Review verified hiring parity metrics, log on-ground
            skill gaps from candidate interviews, and propose actionable curriculum patches directly
            to educators and policymakers.
          </p>
        </div>
      </div>

      {/* STATS: Dark Tone Benchmark Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#131D2A] border border-[#223348] p-5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Resume Claim vs Reality Gap
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-serif font-bold text-[#E07A5F]">68%</span>
            <span className="text-xs text-[#E07A5F] flex items-center font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> Deficit
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
            Candidates claiming &apos;Full Stack&apos; who cannot write unit tests or handle basic database locks in live tests.
          </p>
        </div>

        <div className="bg-[#131D2A] border border-[#223348] p-5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Average Retraining Time
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-serif font-bold text-[#FFFFFF]">5.4 Mo</span>
            <span className="text-xs text-[#94A3B8] font-medium">Post-hire</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
            Average time spent by enterprises retraining fresh graduates on modern tooling before first deployment.
          </p>
        </div>

        <div className="bg-[#131D2A] border border-[#223348] p-5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Verified Employer Discrepancies
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-serif font-bold text-[#38BDF8]">
              {parityReports.length}
            </span>
            <span className="text-xs text-[#94A3B8] font-medium">Audited</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
            Actionable parity reports submitted by certified technology, automotive, and fintech companies.
          </p>
        </div>

        <div className="bg-[#131D2A] border border-[#223348] p-5 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Most Critical Deficit Area
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-serif font-bold text-[#E07A5F]">Git &amp; CI/CD</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
            81% of curriculum still teaches local copy-pasting rather than version control and automated deployments.
          </p>
        </div>
      </div>

      {/* SECTION 2: Verified On-Ground Parity Feed in Dark Tone Box */}
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl p-6 shadow-md text-[#F8FAFC]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#1E3A8A] text-[#FFFFFF] border border-[#3B82F6]/50 flex items-center justify-center text-xs font-serif font-bold">
                ✓
              </span>
              <h3 className="text-lg font-serif font-bold text-[#FFFFFF]">
                On-Ground Parity Audit Registry
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Verified ground-truth reports from engineering leaders detailing curriculum disconnects
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                id="employer-search-query"
                type="text"
                placeholder="Search role, sector, deficit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-xs text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {/* Severity Filter */}
            <select
              id="severity-filter"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="bg-[#0B1320] border border-[#2A3F58] text-xs font-medium text-[#FFFFFF] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Discrepancies</option>
              <option value="Moderate">Moderate Discrepancies</option>
            </select>

            {/* Submit Discrepancy Button */}
            <button
              id="submit-parity-report-btn"
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium flex items-center gap-1.5 shadow-xs transition border border-[#3B82F6]/40 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Ground Parity Deficit</span>
            </button>
          </div>
        </div>

        {/* List of Parity Cards in Dark Tone */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-[#0F1724] border border-[#223348] rounded-xl p-5 hover:border-[#38BDF8] transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-serif font-bold text-[#FFFFFF]">
                      {report.roleAssessed}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#1E293B] border border-[#334155] text-[#FFFFFF] rounded-md">
                      {report.employerName}
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      ({report.industry})
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        report.severity === 'Critical'
                          ? 'bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/50'
                          : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                      }`}
                    >
                      {report.severity} Severity
                    </span>
                  </div>
                  <span className="text-xs text-[#94A3B8] mt-1 block">
                    Candidate Pool Sample: {report.academicSource} • Logged on {report.submittedDate}
                  </span>
                </div>

                {/* Agree Button */}
                <button
                  onClick={() => onVoteReport(report.id)}
                  className="px-3 py-1.5 rounded-lg border border-[#2A3F58] bg-[#162132] hover:bg-[#1E2D42] text-xs font-medium text-[#FFFFFF] flex items-center gap-1.5 transition shrink-0 self-start shadow-xs cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Verified by {report.votesAgree} Tech Leaders</span>
                </button>
              </div>

              {/* Side by side comparison: Claimed vs Actual On-Ground in Dark Tone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                <div className="p-3 bg-[#131D2A] rounded-lg border border-[#223348] text-xs">
                  <span className="text-[#94A3B8] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    What Syllabus Claims / Candidates Assert:
                  </span>
                  <p className="text-[#CBD5E1] leading-relaxed">{report.claimedProficiency}</p>
                </div>

                <div className="p-3 bg-[#20151E] rounded-lg border border-[#C9826B]/40 text-xs">
                  <span className="text-[#E07A5F] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    On-Ground Reality in Technical Interviews:
                  </span>
                  <p className="text-[#F8FAFC] leading-relaxed font-normal">{report.actualOnGroundProficiency}</p>
                </div>
              </div>

              {/* Observed Root Cause & Recommended Patch */}
              <div className="space-y-2 text-xs">
                <div className="text-[#94A3B8]">
                  <strong className="text-[#FFFFFF] font-semibold">Deficit Analysis: </strong>
                  {report.observedDeficit}
                </div>
                <div className="p-3 rounded-lg bg-[#11243B] border border-[#2563EB]/40 text-[#F8FAFC] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#60A5FA]">
                      Recommended Curriculum Patch for Colleges:
                    </span>{' '}
                    {report.recommendedCurriculumPatch}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log On-Ground Parity Deficit Modal in Dark Tone */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1320]/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#131D2A] border border-[#223348] rounded-xl w-full max-w-xl shadow-2xl text-[#FFFFFF] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#223348] bg-[#0F1724]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="text-base font-serif font-bold text-[#FFFFFF]">
                  Log On-Ground Skill Parity Discrepancy
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#94A3B8] hover:text-[#FFFFFF] p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#FFFFFF] font-semibold mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy, Mahindra, Infosys"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FFFFFF] font-semibold mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Financial Technology (FinTech)">FinTech</option>
                    <option value="Automotive & EV">Automotive & EV</option>
                    <option value="Healthcare Tech">Healthcare Tech</option>
                    <option value="Advanced Manufacturing">Advanced Manufacturing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#FFFFFF] font-semibold mb-1">
                    Role Assessed *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior Backend Engineer"
                    value={roleAssessed}
                    onChange={(e) => setRoleAssessed(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-[#FFFFFF] font-semibold mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="Critical">Critical (Immediate Retraining Needed)</option>
                    <option value="Moderate">Moderate (Partial Familiarity)</option>
                    <option value="Minor">Minor Discrepancy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">
                  Candidate Origin / Academic Source
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Engineering & Polytechnic Colleges (Batch 2026)"
                  value={academicSource}
                  onChange={(e) => setAcademicSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">
                  What Resume / Syllabus Claims
                </label>
                <input
                  type="text"
                  placeholder="e.g. 80% claim proficiency in Python & SQL"
                  value={claimedProficiency}
                  onChange={(e) => setClaimedProficiency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">
                  Actual On-Ground Performance in Interviews *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe exact failure points (e.g. Only 15% can write unit tests or configure environment variables)"
                  value={actualOnGround}
                  onChange={(e) => setActualOnGround(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-1">
                  Recommended Curriculum Patch for University / Vocational Board
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific recommendation (e.g. Add 3-week Git branching & pytest module into 4th semester)"
                  value={curriculumPatch}
                  onChange={(e) => setCurriculumPatch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1320] border border-[#2A3F58] text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#223348]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#2A3F58] text-[#94A3B8] hover:text-[#FFFFFF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-medium shadow-xs transition border border-[#3B82F6]/40 cursor-pointer"
                >
                  Publish to National Parity Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
