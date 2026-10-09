import React from 'react';
import { X, CheckCircle2, Sparkles, Layers, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';

export const WhyRecommendedModal = ({ recommendation, isOpen, onClose, onAddToTeam }) => {
  if (!isOpen || !recommendation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
            {recommendation.candidateName ? recommendation.candidateName.charAt(0) : 'C'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{recommendation.candidateName}</h3>
            <p className="text-xs text-slate-400">{recommendation.candidateRole} • {recommendation.candidateDepartment}</p>
          </div>
        </div>

        {/* Overall Match Badge & Multi-factor breakdown */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Match Compatibility</span>
            <span className="text-2xl font-black text-emerald-400">{recommendation.score}%</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Skill Match:</span>
              <span className="font-bold text-blue-400">{recommendation.skillMatchScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Complementarity:</span>
              <span className="font-bold text-indigo-400">{recommendation.skillComplementarityScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Role Alignment:</span>
              <span className="font-bold text-amber-400">{recommendation.roleCompatibilityScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Availability:</span>
              <span className="font-bold text-emerald-400">{recommendation.availabilityMatchScore}%</span>
            </div>
          </div>
        </div>

        {/* Transparent Reason List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Why this candidate is recommended</span>
          </h4>

          <div className="space-y-2">
            {recommendation.reasons && recommendation.reasons.map((r, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-slate-200 leading-relaxed">{r.explanationText}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Matrix Before & After */}
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4" />
            <span>Team Skill Contribution Impact</span>
          </h4>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Provided Skill Additions:</span>
              <div className="flex flex-wrap gap-1">
                {recommendation.missingSkillsProvided && recommendation.missingSkillsProvided.length > 0 ? (
                  recommendation.missingSkillsProvided.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">Covers existing project stack</span>
                )}
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-blue-400 shrink-0" />

            <div className="text-right space-y-1">
              <span className="text-slate-400 block font-medium">Est. Team Health Gain:</span>
              <span className="text-base font-extrabold text-emerald-400">+12% Coverage</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
          
          <button
            onClick={() => {
              if (onAddToTeam) onAddToTeam(recommendation);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add Candidate to Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
