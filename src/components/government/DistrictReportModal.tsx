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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1320]/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#131D2A] border border-[#223348] rounded-xl w-full max-w-4xl shadow-2xl text-[#FFFFFF] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Controls in Dark Tone with Navy */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#223348] bg-[#0F1724] print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-base font-serif font-bold text-[#FFFFFF]">
              Official District Workforce Action Plan
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#1E2E44] text-[#60A5FA] border border-[#2563EB]/40 font-medium">
              Policy Brief Ready
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="print-district-report-btn"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-xs font-medium flex items-center gap-2 shadow-xs transition border border-[#3B82F6]/40 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#1E293B] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body in Dark Tone */}
        <div className="p-8 overflow-y-auto bg-[#0F1724] print:bg-white print:text-black print:p-0 text-[#F8FAFC] space-y-6">
          {/* Document Header */}
          <div className="border-b border-[#223348] print:border-black pb-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#60A5FA] print:text-black block mb-1">
                  Department of Skill Development, Entrepreneurship &amp; Livelihood
                </span>
                <h1 className="text-2xl font-serif font-bold text-[#FFFFFF] print:text-black tracking-tight">
                  District Skill Gap &amp; Curriculum Modernization Action Plan: {district.districtName} ({district.state})
                </h1>
                <p className="text-xs text-[#94A3B8] print:text-gray-600 mt-1">
                  Report Identifier: DSD-ALGN-{district.districtId.toUpperCase()}-2026-Q3 • Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#131D2A] print:bg-gray-100 print:text-black text-[#FFFFFF] border border-[#223348] print:border-gray-300">
                  Status: Priority Executive Review
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Macro District Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#131D2A] print:bg-gray-50 border border-[#223348] print:border-gray-200 p-4 rounded-xl text-xs">
            <div>
              <span className="text-[#94A3B8] print:text-gray-500 font-medium block text-[10px] uppercase">
                Active Job Openings
              </span>
              <span className="text-lg font-serif font-bold text-[#FFFFFF] print:text-black">
                {district.activeJobPostings.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] print:text-gray-500 font-medium block text-[10px] uppercase">
                Regional Unemployment
              </span>
              <span className="text-lg font-serif font-bold text-[#E07A5F] print:text-black">
                {district.unemploymentRate}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] print:text-gray-500 font-medium block text-[10px] uppercase">
                Key Economic Sectors
              </span>
              <span className="font-medium text-[#FFFFFF] print:text-gray-800 block truncate">
                {district.primarySectors.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] print:text-gray-500 font-medium block text-[10px] uppercase">
                Critical Zero-Coverage Skills
              </span>
              <span className="text-lg font-serif font-bold text-[#E07A5F] print:text-red-700">
                {uncoveredSkills.length} High Demand
              </span>
            </div>
          </div>

          {/* Section 2: Top Skill Gaps in District */}
          <div>
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#FFFFFF] print:text-black flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#E07A5F]" />
              1. Top Identified Skill Gaps (High Industry Demand with Zero / Deficit Training)
            </h2>
            <div className="border border-[#223348] print:border-gray-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#131D2A] print:bg-gray-100 font-semibold border-b border-[#223348] print:border-gray-300 text-[#FFFFFF] print:text-black">
                  <tr>
                    <th className="py-2.5 px-3">In-Demand Skill Deficit</th>
                    <th className="py-2.5 px-3">Industry Job Demand</th>
                    <th className="py-2.5 px-3">Current Course Coverage</th>
                    <th className="py-2.5 px-3">Urgency &amp; Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2D44] print:divide-gray-200 text-[#CBD5E1] print:text-gray-800">
                  {uncoveredSkills.map((sk) => (
                    <tr key={sk.skill} className="hover:bg-[#162132]/60">
                      <td className="py-2.5 px-3 font-semibold text-[#FFFFFF] print:text-black">
                        {sk.skill}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-[#38BDF8] print:text-black">
                        {sk.jobDemandCount.toLocaleString()} Openings
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/50 print:bg-red-50 print:text-red-700 print:border-red-300">
                          0 Courses in District
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#94A3B8] print:text-gray-600">
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
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#FFFFFF] print:text-black flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
              2. Recommended Training &amp; Courses to Prioritize in {district.districtName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#223348] bg-[#131D2A] print:bg-gray-50 print:border-gray-300">
                <span className="font-semibold text-[#60A5FA] block mb-1">
                  1. Launch Accelerated MLOps &amp; Cloud Container Certification
                </span>
                <p className="text-[#CBD5E1] leading-relaxed">
                  Establish a 12-week public-private finishing school in Bengaluru/Pune targeting Docker, Kubernetes, and FastAPI deployment for BCA/B.Voc graduates.
                </p>
                <span className="mt-2 text-[11px] font-medium text-[#38BDF8] block">
                  Projected Placement Impact: +4,200 candidates / year
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-[#223348] bg-[#131D2A] print:bg-gray-50 print:border-gray-300">
                <span className="font-semibold text-[#60A5FA] block mb-1">
                  2. EV Battery Management &amp; High-Voltage Telemetry Labs
                </span>
                <p className="text-[#CBD5E1] leading-relaxed">
                  Convert redundant domestic electrical benches in ITIs into 48V CAN-bus and Lithium-ion BMS simulation stations.
                </p>
                <span className="mt-2 text-[11px] font-medium text-[#38BDF8] block">
                  Projected Placement Impact: +3,100 technicians / year
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Obsolete & Oversaturated Programs to De-fund or Reallocate */}
          <div>
            <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-[#FFFFFF] print:text-black flex items-center gap-1.5 mb-3">
              <TrendingUp className="w-4 h-4 text-[#E07A5F]" />
              3. Programs Identified for De-funding / Quota Reallocation
            </h2>
            <div className="space-y-2 text-xs">
              {obsoleteCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border border-[#223348] bg-[#131D2A] flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-[#FFFFFF]">{c.name} ({c.code})</span>
                    <p className="text-[#94A3B8] text-[11px] mt-0.5">{c.alertReason}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#2D1612] text-[#FCA5A5] border border-[#C9826B]/50 shrink-0 ml-3">
                    Placement: {c.placementRate}% (Phase-out)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
