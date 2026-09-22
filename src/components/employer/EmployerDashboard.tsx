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
      {/* Hero Header */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 text-[#292A27] shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8]">
              Industry Ground-Truth Audit
            </span>
            <span className="text-xs text-[#6F706A]">Hiring Discrepancy Registry</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight mb-2 text-[#292A27]">
            Validate the Skill Gap &amp; On-Ground Parity
          </h2>
          <p className="text-sm text-[#6F706A] leading-relaxed">
            Bridge the disconnect between what university degrees certify and what candidates can
            actually deliver in production. Review verified hiring parity metrics, log on-ground
            skill gaps from candidate interviews, and propose actionable curriculum patches directly
            to educators and policymakers.
          </p>
        </div>
      </div>

      {/* STATS: On-Ground Parity Discrepancies Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-5 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Resume Claim vs Reality Gap
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-serif font-bold text-[#C9826B]">68%</span>
            <span className="text-xs text-[#C9826B] flex items-center font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> Deficit
            </span>
          </div>
          <p className="text-xs text-[#6F706A] mt-2">
            Candidates claiming &apos;Full Stack&apos; who cannot write unit tests or handle basic database locks in live tests.
          </p>
        </div>

        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-5 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Average Retraining Time
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-serif font-bold text-[#292A27]">5.4 Mo</span>
            <span className="text-xs text-[#6F706A] font-medium">Post-hire</span>
          </div>
          <p className="text-xs text-[#6F706A] mt-2">
            Average time spent by enterprises retraining fresh graduates on modern tooling before first deployment.
          </p>
        </div>

        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-5 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Verified Employer Discrepancies
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-serif font-bold text-[#718C78]">
              {parityReports.length}
            </span>
            <span className="text-xs text-[#6F706A] font-medium">Audited</span>
          </div>
          <p className="text-xs text-[#6F706A] mt-2">
            Actionable parity reports submitted by certified technology, automotive, and fintech companies.
          </p>
        </div>

        <div className="bg-[#FFFDFC] border border-[#DED8CE] p-5 rounded-xl">
          <span className="text-[11px] font-semibold text-[#6F706A] uppercase tracking-wider block">
            Most Critical Deficit Area
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-serif font-bold text-[#C9826B]">Git &amp; CI/CD</span>
          </div>
          <p className="text-xs text-[#6F706A] mt-2">
            81% of curriculum still teaches local copy-pasting rather than version control and automated deployments.
          </p>
        </div>
      </div>

      {/* SECTION 2: Verified On-Ground Parity Feed */}
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] flex items-center justify-center text-xs font-serif font-bold">
                ✓
              </span>
              <h3 className="text-lg font-serif font-bold text-[#292A27]">
                On-Ground Parity Audit Registry
              </h3>
            </div>
            <p className="text-xs text-[#6F706A] mt-0.5">
              Verified ground-truth reports from engineering leaders detailing curriculum disconnects
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#6F706A] absolute left-3 top-2.5" />
              <input
                id="employer-search-query"
                type="text"
                placeholder="Search role, sector, deficit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-xs text-[#292A27] placeholder-[#6F706A]/70 focus:outline-none focus:border-[#718C78]"
              />
            </div>

            {/* Severity Filter */}
            <select
              id="severity-filter"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#DED8CE] text-xs font-medium text-[#292A27] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#718C78]"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Discrepancies</option>
              <option value="Moderate">Moderate Discrepancies</option>
            </select>

            {/* Submit Discrepancy Button */}
            <button
              id="submit-parity-report-btn"
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFDFC] text-xs font-medium flex items-center gap-1.5 shadow-xs transition border border-[#B26E58]/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Ground Parity Deficit</span>
            </button>
          </div>
        </div>

        {/* List of Parity Cards */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-[#FAF7F2] border border-[#DED8CE] rounded-xl p-5 hover:border-[#9AAA8F] transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-serif font-bold text-[#292A27]">
                      {report.roleAssessed}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#FFFDFC] border border-[#DED8CE] text-[#292A27] rounded-md">
                      {report.employerName}
                    </span>
                    <span className="text-xs text-[#6F706A]">
                      ({report.industry})
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        report.severity === 'Critical'
                          ? 'bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8]'
                          : 'bg-[#F5F0E8] text-[#6F706A] border border-[#DED8CE]'
                      }`}
                    >
                      {report.severity} Severity
                    </span>
                  </div>
                  <span className="text-xs text-[#6F706A] mt-1 block">
                    Candidate Pool Sample: {report.academicSource} • Logged on {report.submittedDate}
                  </span>
                </div>

                {/* Agree Button */}
                <button
                  onClick={() => onVoteReport(report.id)}
                  className="px-3 py-1.5 rounded-lg border border-[#DED8CE] bg-[#FFFDFC] hover:bg-[#FAF7F2] text-xs font-medium text-[#292A27] flex items-center gap-1.5 transition shrink-0 self-start shadow-xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#718C78]" />
                  <span>Verified by {report.votesAgree} Tech Leaders</span>
                </button>
              </div>

              {/* Side by side comparison: Claimed vs Actual On-Ground */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                <div className="p-3 bg-[#FFFDFC] rounded-lg border border-[#DED8CE] text-xs">
                  <span className="text-[#6F706A] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    What Syllabus Claims / Candidates Assert:
                  </span>
                  <p className="text-[#292A27] leading-relaxed">{report.claimedProficiency}</p>
                </div>

                <div className="p-3 bg-[#FAF1ED] rounded-lg border border-[#E8C7B8] text-xs">
                  <span className="text-[#C9826B] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    On-Ground Reality in Technical Interviews:
                  </span>
                  <p className="text-[#292A27] leading-relaxed font-normal">{report.actualOnGroundProficiency}</p>
                </div>
              </div>

              {/* Observed Root Cause & Recommended Patch */}
              <div className="space-y-2 text-xs">
                <div className="text-[#6F706A]">
                  <strong className="text-[#292A27] font-semibold">Deficit Analysis: </strong>
                  {report.observedDeficit}
                </div>
                <div className="p-3 rounded-lg bg-[#EEF3EE] border border-[#9AAA8F]/40 text-[#292A27] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#718C78] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#586F5E]">
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

      {/* Log On-Ground Parity Deficit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292A27]/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl w-full max-w-xl shadow-lg text-[#292A27] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DED8CE] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C9826B]" />
                <h3 className="text-base font-serif font-bold text-[#292A27]">
                  Log On-Ground Skill Parity Discrepancy
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6F706A] hover:text-[#292A27] p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#292A27] font-semibold mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swiggy, Mahindra, Infosys"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                  />
                </div>

                <div>
                  <label className="block text-[#292A27] font-semibold mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
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
                  <label className="block text-[#292A27] font-semibold mb-1">
                    Role Assessed *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior Backend Engineer"
                    value={roleAssessed}
                    onChange={(e) => setRoleAssessed(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                  />
                </div>

                <div>
                  <label className="block text-[#292A27] font-semibold mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                  >
                    <option value="Critical">Critical (Immediate Retraining Needed)</option>
                    <option value="Moderate">Moderate (Partial Familiarity)</option>
                    <option value="Minor">Minor Discrepancy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#292A27] font-semibold mb-1">
                  Candidate Origin / Academic Source
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Engineering & Polytechnic Colleges (Batch 2026)"
                  value={academicSource}
                  onChange={(e) => setAcademicSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                />
              </div>

              <div>
                <label className="block text-[#292A27] font-semibold mb-1">
                  What Resume / Syllabus Claims
                </label>
                <input
                  type="text"
                  placeholder="e.g. 80% claim proficiency in Python & SQL"
                  value={claimedProficiency}
                  onChange={(e) => setClaimedProficiency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                />
              </div>

              <div>
                <label className="block text-[#292A27] font-semibold mb-1">
                  Actual On-Ground Performance in Interviews *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe exact failure points (e.g. Only 15% can write unit tests or configure environment variables)"
                  value={actualOnGround}
                  onChange={(e) => setActualOnGround(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                />
              </div>

              <div>
                <label className="block text-[#292A27] font-semibold mb-1">
                  Recommended Curriculum Patch for University / Vocational Board
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific recommendation (e.g. Add 3-week Git branching & pytest module into 4th semester)"
                  value={curriculumPatch}
                  onChange={(e) => setCurriculumPatch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED8CE] text-[#292A27] focus:outline-none focus:border-[#718C78]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DED8CE]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#DED8CE] text-[#6F706A] hover:text-[#292A27]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C9826B] hover:bg-[#B26E58] text-[#FFFDFC] font-medium shadow-xs transition border border-[#B26E58]/30"
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
