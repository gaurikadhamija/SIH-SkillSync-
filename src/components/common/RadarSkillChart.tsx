import React from 'react';
import { Target, Award, ArrowUpRight } from 'lucide-react';

interface SkillPoint {
  skill: string;
  studentScore: number; // 0 to 100
  requiredScore: number; // 0 to 100
}

interface RadarSkillChartProps {
  skills: SkillPoint[];
  title?: string;
  roleName?: string;
}

export const RadarSkillChart: React.FC<RadarSkillChartProps> = ({
  skills,
  title = 'Skill Readiness Spider Telemetry',
  roleName = 'Target Industry Role',
}) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = Math.max(skills.length, 3);
  const angleStep = (2 * Math.PI) / totalAxes;

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Helper to get coordinates
  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon points for student scores
  const studentPoints = skills
    .map((s, i) => {
      const coord = getCoordinates(i, s.studentScore);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  // Generate polygon points for required benchmark scores
  const requiredPoints = skills
    .map((s, i) => {
      const coord = getCoordinates(i, s.requiredScore);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-slate-900 text-base">{title}</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Live Spider Chart
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your assessed score vs. industry threshold for <strong className="text-slate-700">{roleName}</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="font-medium text-slate-700">Your Assessed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300 border border-dashed border-slate-500 inline-block" />
            <span className="font-medium text-slate-500">Industry Target</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* SVG Spider Chart */}
        <div className="relative w-[300px] h-[300px] shrink-0">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background concentric polygons */}
            {levels.map((lvl, lIdx) => {
              const polyPoints = skills
                .map((_, i) => {
                  const coord = getCoordinates(i, lvl * 100);
                  return `${coord.x},${coord.y}`;
                })
                .join(' ');

              return (
                <polygon
                  key={lIdx}
                  points={polyPoints}
                  fill={lIdx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                  strokeDasharray={lIdx === levels.length - 1 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Radial axes */}
            {skills.map((_, i) => {
              const endCoord = getCoordinates(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={endCoord.x}
                  y2={endCoord.y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              );
            })}

            {/* Required Benchmark Polygon (Dashed outline) */}
            <polygon
              points={requiredPoints}
              fill="rgba(148, 163, 184, 0.15)"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Student Assessed Polygon (Glowing blue) */}
            <polygon
              points={studentPoints}
              fill="rgba(37, 99, 235, 0.25)"
              stroke="#2563EB"
              strokeWidth="2.5"
            />

            {/* Interactive Points on Student Polygon */}
            {skills.map((s, i) => {
              const coord = getCoordinates(i, s.studentScore);
              const isMet = s.studentScore >= s.requiredScore;
              return (
                <g key={i}>
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="4.5"
                    fill={isMet ? '#10B981' : '#2563EB'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              );
            })}

            {/* Axis Labels */}
            {skills.map((s, i) => {
              const labelCoord = getCoordinates(i, 118);
              return (
                <text
                  key={i}
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-semibold fill-slate-700 font-sans"
                >
                  {s.skill}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Breakdown List beside Radar */}
        <div className="w-full flex-1 max-w-sm space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Skill Competency Telemetry
          </div>
          {skills.map((item, idx) => {
            const gap = item.studentScore - item.requiredScore;
            const isPassing = gap >= 0;
            return (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{item.skill}</div>
                  <div className="text-[11px] text-slate-500">
                    Assessed: <span className="font-bold text-blue-600">{item.studentScore}%</span> | Required: {item.requiredScore}%
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isPassing
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {isPassing ? `+${gap}% Met` : `${gap}% Delta`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
