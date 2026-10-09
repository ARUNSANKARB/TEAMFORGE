import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Layers, Clock, Award } from 'lucide-react';

export const TeamHealthScore = ({ health }) => {
  if (!health) return null;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getBarColor = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header with overall health gauge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Dynamic Team Health Index</h3>
            <p className="text-xs text-slate-400">Real-time aggregate compatibility & coverage score</p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-xl border text-lg font-extrabold flex items-center space-x-1.5 ${getScoreColor(health.overallHealthScore)}`}>
          <span>{health.overallHealthScore}%</span>
        </div>
      </div>

      {/* Sub-factor metric progress bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skill Coverage */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium"><Layers className="w-3.5 h-3.5 text-blue-400" /> <span>Skill Coverage</span></span>
            <span className="font-bold text-slate-200">{health.skillCoverageScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(health.skillCoverageScore)} transition-all duration-500`} style={{ width: `${health.skillCoverageScore}%` }} />
          </div>
        </div>

        {/* Role Coverage */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> <span>Role Coverage</span></span>
            <span className="font-bold text-slate-200">{health.roleCoverageScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(health.roleCoverageScore)} transition-all duration-500`} style={{ width: `${health.roleCoverageScore}%` }} />
          </div>
        </div>

        {/* Experience Balance */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium"><Award className="w-3.5 h-3.5 text-amber-400" /> <span>Exp Balance</span></span>
            <span className="font-bold text-slate-200">{health.experienceBalanceScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(health.experienceBalanceScore)} transition-all duration-500`} style={{ width: `${health.experienceBalanceScore}%` }} />
          </div>
        </div>

        {/* Availability */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-emerald-400" /> <span>Availability</span></span>
            <span className="font-bold text-slate-200">{health.availabilityScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(health.availabilityScore)} transition-all duration-500`} style={{ width: `${health.availabilityScore}%` }} />
          </div>
        </div>
      </div>

      {/* Covered vs Missing Skills Chips */}
      <div className="pt-2 flex flex-wrap gap-4 text-xs">
        {health.coveredSkills && health.coveredSkills.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider block">Covered Skills ({health.coveredSkills.length}):</span>
            <div className="flex flex-wrap gap-1.5">
              {health.coveredSkills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {health.missingSkills && health.missingSkills.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider block">Missing Skill Gaps ({health.missingSkills.length}):</span>
            <div className="flex flex-wrap gap-1.5">
              {health.missingSkills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                  ✗ {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
