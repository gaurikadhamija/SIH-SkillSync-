import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PictorialStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  accentColor: string; // e.g. '#2563EB', '#E07A5F', '#0284C7', '#10B981'
  progressPercent?: number;
  miniBarData?: number[];
  tag?: string;
}

export const PictorialStatCard: React.FC<PictorialStatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  accentColor,
  progressPercent,
  miniBarData = [40, 65, 55, 80, 70, 95, 85],
  tag,
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = progressPercent !== undefined 
    ? circumference - (progressPercent / 100) * circumference 
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
      {/* Subtle top accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </span>
            {tag && (
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${accentColor}18`, 
                  color: accentColor 
                }}
              >
                {tag}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
            <span>{value}</span>
            {change && (
              <span className={`inline-flex items-center text-xs font-semibold ${
                changeType === 'positive' 
                  ? 'text-emerald-600' 
                  : changeType === 'negative' 
                  ? 'text-rose-600' 
                  : 'text-slate-500'
              }`}>
                {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                {changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                {changeType === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Pictorial Widget: Progress Gauge OR Icon Graphic */}
        {progressPercent !== undefined ? (
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="#E2E8F0"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke={accentColor}
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-[11px] font-bold text-slate-800">
                {progressPercent}%
              </span>
            </div>
          </div>
        ) : (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
            style={{ 
              backgroundColor: `${accentColor}15`, 
              color: accentColor 
            }}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Pictorial Sparkline / Mini Visual Bar Chart */}
      {miniBarData && miniBarData.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-1.5 h-8">
          <span className="text-[10px] text-slate-400 font-medium">Telemetry Trend</span>
          <div className="flex items-end gap-1 h-6">
            {miniBarData.map((val, idx) => (
              <div
                key={idx}
                className="w-2 rounded-t transition-all hover:opacity-100 opacity-70"
                style={{
                  height: `${(val / 100) * 24}px`,
                  backgroundColor: idx === miniBarData.length - 1 ? accentColor : `${accentColor}60`,
                }}
                title={`Telemetry Point: ${val}%`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
