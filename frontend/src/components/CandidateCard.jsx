import React, { useState } from 'react';
import { Sparkles, HelpCircle, CheckCircle, Clock, Award, Code2, Plus } from 'lucide-react';
import { WhyRecommendedModal } from './WhyRecommendedModal';

export const CandidateCard = ({ candidate, onAddToTeam }) => {
  const [showModal, setShowModal] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 88) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between space-y-4 group">
        {/* Header with Candidate photo & score */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/10">
              {candidate.candidateName ? candidate.candidateName.charAt(0) : 'S'}
            </div>
            <div>
              <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition">{candidate.candidateName}</h4>
              <p className="text-xs text-slate-400">{candidate.candidateRole} • {candidate.candidateDepartment}</p>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-sm font-extrabold ${getScoreColor(candidate.score)}`}>
            {candidate.score}% Match
          </div>
        </div>

        {/* Quick metrics grid */}
        <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-slate-500 block">Skill Match</span>
            <span className="font-bold text-blue-400">{candidate.skillMatchScore}%</span>
          </div>
          <div>
            <span className="text-slate-500 block">Complementarity</span>
            <span className="font-bold text-indigo-400">{candidate.skillComplementarityScore}%</span>
          </div>
          <div>
            <span className="text-slate-500 block">Availability</span>
            <span className="font-bold text-emerald-400">{candidate.availabilityMatchScore}%</span>
          </div>
        </div>

        {/* Candidate skills chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Top Technical Skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.candidateSkills && candidate.candidateSkills.slice(0, 4).map((s, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                {s.skillName} ({s.proficiencyLevel})
              </span>
            ))}
          </div>
        </div>

        {/* Missing skill addition highlight */}
        {candidate.missingSkillsProvided && candidate.missingSkillsProvided.length > 0 && (
          <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2.5 rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Fills team gap: <strong>{candidate.missingSkillsProvided.join(', ')}</strong></span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 flex items-center justify-center space-x-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Why recommended?</span>
          </button>

          <button
            onClick={() => onAddToTeam && onAddToTeam(candidate)}
            className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Team</span>
          </button>
        </div>
      </div>

      <WhyRecommendedModal
        recommendation={candidate}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddToTeam={onAddToTeam}
      />
    </>
  );
};
