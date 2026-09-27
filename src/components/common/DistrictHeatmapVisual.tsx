import React from 'react';
import { MapPin, AlertOctagon, CheckCircle2, TrendingUp, Building } from 'lucide-react';
import { DistrictMarketData } from '../../types';

interface DistrictHeatmapVisualProps {
  districts: DistrictMarketData[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const DistrictHeatmapVisual: React.FC<DistrictHeatmapVisualProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-slate-900 text-base">
              District Workforce Heatmap & Demand Telemetry
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Regional Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any district node to load granular curriculum alignment data and regional skill gaps
          </p>
        </div>
      </div>

      {/* Pictorial Grid of Districts with Progress Gauges and Gap Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {districts.map((dist) => {
          const isSelected = dist.districtId === selectedDistrictId;
          const uncoveredCount = dist.topInDemandSkills.filter((s) => !s.hasCoveringCourse).length;
          // Calculate an alignment health score based on uncovered count
          const healthScore = Math.max(30, 100 - uncoveredCount * 22);

          return (
            <button
              key={dist.districtId}
              type="button"
              onClick={() => onSelectDistrict(dist.districtId)}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{dist.districtName}, {dist.state}</span>
                  </div>
                  {uncoveredCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertOctagon className="w-2.5 h-2.5" />
                      {uncoveredCount} Gaps
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Aligned
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      {dist.activeJobPostings.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">Live Postings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">
                      {dist.unemploymentRate}
                    </div>
                    <div className="text-[11px] text-slate-500">Unemployment Rate</div>
                  </div>
                </div>

                {/* Pictorial Health Bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Curriculum Health Index</span>
                    <span className={`font-bold ${healthScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {healthScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        healthScore > 70 ? 'bg-emerald-500' : healthScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sectors */}
              <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1">
                {dist.primarySectors.slice(0, 3).map((sec, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-medium"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
