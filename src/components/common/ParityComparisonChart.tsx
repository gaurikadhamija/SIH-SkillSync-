import React from 'react';
import { ShieldCheck, AlertTriangle, UserX, UserCheck } from 'lucide-react';

interface ParityComparisonChartProps {
  reports: Array<{
    employerName: string;
    roleAssessed: string;
    claimedScore?: number;
    actualScore?: number;
    severity: 'Critical' | 'Moderate' | 'Minor';
  }>;
}

export const ParityComparisonChart: React.FC<ParityComparisonChartProps> = ({ reports }) => {
  // Compute aggregated stats
  const total = reports.length || 1;
  const criticalCount = reports.filter((r) => r.severity === 'Critical').length;
  const moderateCount = reports.filter((r) => r.severity === 'Moderate').length;
  const minorCount = reports.filter((r) => r.severity === 'Minor').length;

  const criticalPct = Math.round((criticalCount / total) * 100);
  const moderatePct = Math.round((moderateCount / total) * 100);
  const minorPct = 100 - criticalPct - moderatePct;

  // Mock comparison pairs for visual bar chart
  const samplePairs = [
    { role: 'Frontend React/TS', claimed: 85, actual: 42, deficit: -43 },
    { role: 'Cloud DevOps / Docker', claimed: 90, actual: 35, deficit: -55 },
    { role: 'Python Data / AI', claimed: 78, actual: 48, deficit: -30 },
    { role: 'Backend Node/REST', claimed: 82, actual: 60, deficit: -22 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-slate-900 text-base">
              Pictorial Parity Telemetry: Resume Claim vs. Live Audit
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              Employer Verification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Measured delta between academic transcript claims and on-ground production test results
          </p>
        </div>

        {/* Aggregate Severity Pill Gauge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Critical: {criticalPct}%</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Moderate: {moderatePct}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Comparison Bars */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium pb-1 border-b border-slate-100">
            <span>Evaluated Role & Discrepancy</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 rounded bg-slate-300 inline-block" />
                Resume Claim
              </span>
              <span className="flex items-center gap-1 text-sky-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />
                Live Practical Score
              </span>
            </div>
          </div>

          {samplePairs.map((pair, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{pair.role}</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                  {pair.deficit}% Parity Gap
                </span>
              </div>

              {/* Double Bar Visual */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-slate-300 h-full rounded-full"
                    style={{ width: `${pair.claimed}%` }}
                    title={`Claimed: ${pair.claimed}%`}
                  />
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{ width: `${pair.actual}%` }}
                    title={`Actual: ${pair.actual}%`}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Claimed: {pair.claimed}%</span>
                <span>Verified: {pair.actual}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Pictorial Pass Rate Donut & Insight */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              First-Round Pass Rate
            </span>
            <div className="relative w-28 h-28 mx-auto my-3 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0284C7"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.38)}`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900">38%</span>
                <span className="text-[10px] text-slate-500 font-medium">Pass Rate</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Only <strong>38%</strong> of applicants meet real production standards on their first practical code evaluation.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-sky-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>SkillSync Parity Verification Active</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
