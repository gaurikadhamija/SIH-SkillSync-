import React from 'react';
import { DistrictMarketData, ExistingCourse } from '../../types';
import { Printer, X, Landmark, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface DistrictReportModalProps {
  district: DistrictMarketData;
  courses: ExistingCourse[];
  onClose: () => void;
}

export const DistrictReportModal: React.FC<DistrictReportModalProps> = ({
  district,
  courses,
  onClose,
}) => {
  const uncoveredSkills = district.topInDemandSkills.filter(
    (s) => !s.hasCoveringCourse
  );
  const districtCourses = courses.filter((c) => c.district === district.districtName);
  const obsoleteCourses = districtCourses.filter((c) => c.statusAlert === 'Obsolete');
  const oversaturatedCourses = districtCourses.filter((c) => c.statusAlert === 'Oversaturated');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292A27]/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FFFDFC] border border-[#DED8CE] rounded-xl w-full max-w-4xl shadow-xl text-[#292A27] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Controls (Not printed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DED8CE] bg-[#FAF7F2] print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#718C78]" />
            <h3 className="text-base font-serif font-bold text-[#292A27]">
              Official District Workforce Action Plan
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#EEF3EE] text-[#586F5E] border border-[#9AAA8F]/40 font-medium">
              Policy Brief Ready
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="print-district-report-btn"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#718C78] hover:bg-[#586F5E] text-[#FFFDFC] text-xs font-medium flex items-center gap-2 shadow-xs transition border border-[#586F5E]/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6F706A] hover:text-[#292A27] hover:bg-[#FAF7F2] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto bg-[#FFFDFC] print:bg-white print:text-black print:p-0 text-[#292A27] space-y-6">
          {/* Document Header */}
          <div className="border-b border-[#DED8CE] print:border-black pb-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#586F5E] print:text-black block mb-1">
                  Department of Skill Development, Entrepreneurship &amp; Livelihood
                </span>
                <h1 className="text-2xl font-serif font-bold text-[#292A27] print:text-black tracking-tight">
                  District Skill Gap &amp; Curriculum Modernization Action Plan: {district.districtName} ({district.state})
                </h1>
                <p className="text-xs text-[#6F706A] print:text-gray-600 mt-1">
                  Report Identifier: DSD-ALGN-{district.districtId.toUpperCase()}-2026-Q3 • Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#FAF7F2] print:bg-gray-100 print:text-black text-[#292A27] border border-[#DED8CE] print:border-gray-300">
                  Status: Priority Executive Review
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Macro District Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] print:bg-gray-50 border border-[#DED8CE] print:border-gray-200 p-4 rounded-xl text-xs">
            <div>
              <span className="text-[#6F706A] print:text-gray-500 font-medium block text-[10px] uppercase">
                Active Job Openings
              </span>
              <span className="text-lg font-serif font-bold text-[#292A27] print:text-black">
                {district.activeJobPostings.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#6F706A] print:text-gray-500 font-medium block text-[10px] uppercase">
                Regional Unemployment
              </span>
              <span className="text-lg font-serif font-bold text-[#C9826B] print:text-black">
                {district.unemploymentRate}
              </span>
            </div>
            <div>
              <span className="text-[#6F706A] print:text-gray-500 font-medium block text-[10px] uppercase">
                Key Economic Sectors
              </span>
              <span className="font-medium text-[#292A27] print:text-gray-800 block truncate">
                {district.primarySectors.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-[#6F706A] print:text-gray-500 font-medium block text-[10px] uppercase">
                Critical Zero-Coverage Skills
              </span>
              <span className="text-lg font-serif font-bold text-[#C9826B] print:text-red-700">
                {uncoveredSkills.length} High Demand
              </span>
            </div>
          </div>

          {/* Section 2: Top Skill Gaps in District (Zero-Coverage and High Demand) */}
          <div>
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#292A27] print:text-black flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#C9826B]" />
              1. Top Identified Skill Gaps (High Industry Demand with Zero / Deficit Training)
            </h2>
            <div className="border border-[#DED8CE] print:border-gray-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FAF7F2] print:bg-gray-100 font-semibold border-b border-[#DED8CE] print:border-gray-300 text-[#292A27] print:text-black">
                  <tr>
                    <th className="py-2.5 px-3">In-Demand Skill Deficit</th>
                    <th className="py-2.5 px-3">Industry Job Demand</th>
                    <th className="py-2.5 px-3">Current Course Coverage</th>
                    <th className="py-2.5 px-3">Urgency &amp; Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DED8CE] print:divide-gray-200 text-[#292A27] print:text-gray-800">
                  {uncoveredSkills.map((sk) => (
                    <tr key={sk.skill} className="hover:bg-[#FAF7F2]/60">
                      <td className="py-2.5 px-3 font-semibold text-[#292A27] print:text-black">
                        {sk.skill}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-[#586F5E] print:text-black">
                        {sk.jobDemandCount.toLocaleString()} Openings
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF1ED] text-[#C9826B] border border-[#E8C7B8] print:bg-red-50 print:text-red-700 print:border-red-300">
                          0 Courses in District
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#6F706A] print:text-gray-600">
                        Severe hiring bottleneck; local employers importing external talent.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Programs to Prioritize & Fund Immediately */}
          <div>
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#292A27] print:text-black flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#718C78]" />
              2. Recommended Training &amp; Courses to Prioritize in {district.districtName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#9AAA8F]/40 bg-[#EEF3EE]/60 print:bg-gray-50 print:border-gray-300">
                <span className="font-semibold text-[#586F5E] block mb-1">
                  1. Launch Accelerated MLOps &amp; Cloud Container Certification
                </span>
                <p className="text-[#292A27] leading-relaxed">
                  Establish a 12-week public-private finishing school in Bengaluru/Pune targeting Docker, Kubernetes, and FastAPI deployment for BCA/B.Voc graduates.
                </p>
                <span className="mt-2 text-[11px] font-medium text-[#586F5E] block">
                  Projected Placement Impact: +4,200 candidates / year
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-[#9AAA8F]/40 bg-[#EEF3EE]/60 print:bg-gray-50 print:border-gray-300">
                <span className="font-semibold text-[#586F5E] block mb-1">
                  2. EV Battery Management &amp; High-Voltage Telemetry Labs
                </span>
                <p className="text-[#292A27] leading-relaxed">
                  Convert redundant domestic electrical benches in ITIs into 48V CAN-bus and Lithium-ion BMS simulation stations.
                </p>
                <span className="mt-2 text-[11px] font-medium text-[#586F5E] block">
                  Projected Placement Impact: +3,100 technicians / year
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Obsolete & Oversaturated Programs to De-fund or Reallocate */}
          <div>
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#292A27] print:text-black flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-4 h-4 text-[#C9826B]" />
              3. Programs Identified for De-funding / Quota Reallocation
            </h2>
            <div className="space-y-2 text-xs">
              {obsoleteCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-[#E8C7B8] bg-[#FAF1ED]/60 print:bg-red-50 print:border-red-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-[#292A27] print:text-black">
                      {c.name} ({c.code})
                    </span>
                    <span className="text-[#C9826B] font-medium ml-2">
                      [Obsolete - Sunset Mandated]
                    </span>
                    <p className="text-[#6F706A] print:text-gray-600 mt-1">
                      Reason: {c.alertReason}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-medium text-[#6F706A] print:text-gray-700 block">
                      Placement: {c.placementRate}%
                    </span>
                    <span className="text-[10px] text-[#C9826B] font-medium">
                      Reallocate {c.currentEnrolled} Seats
                    </span>
                  </div>
                </div>
              ))}

              {oversaturatedCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-[#DED8CE] bg-[#FAF7F2] print:bg-yellow-50 print:border-yellow-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-[#292A27] print:text-black">
                      {c.name} ({c.code})
                    </span>
                    <span className="text-[#6F706A] font-medium ml-2">
                      [Oversaturated - Cap Intake]
                    </span>
                    <p className="text-[#6F706A] print:text-gray-600 mt-1">
                      Reason: {c.alertReason}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-medium text-[#6F706A] print:text-gray-700 block">
                      Graduates: {c.graduatesPerYear} vs Openings: {c.jobOpeningsForGraduate}
                    </span>
                    <span className="text-[10px] text-[#6F706A] font-medium">
                      Mandate Curriculum Patch
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Signature Block */}
          <div className="pt-6 border-t border-[#DED8CE] print:border-black flex justify-between items-end text-xs text-[#6F706A] print:text-gray-600">
            <div>
              <p>Submitted by: National Skill-Industry Alignment Council (SkillSync)</p>
              <p>Automated verification against Q3 2026 enterprise hiring telemetry</p>
            </div>
            <div className="text-right border-t border-[#DED8CE] print:border-black pt-2 w-48">
              <span className="font-serif font-bold text-[#292A27] print:text-black block">
                Director of Vocational Planning
              </span>
              <span>Signed &amp; Approved for Implementation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
