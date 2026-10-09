import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Sparkles, ArrowRight, ShieldCheck, Code2 } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  if (!project) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECRUITING': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'COMPLETED': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Top domain badge & status */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            {project.domain}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition line-clamp-1">
            {project.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Required skills */}
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills && project.requiredSkills.slice(0, 4).map((sk, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-medium">
                {sk.skillName} {sk.isMandatory && <span className="text-rose-400 font-bold">*</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer details & Action button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{project.currentTeamSize}/{project.preferredTeamSize} Members</span>
          </span>
          {project.matchPercentage && (
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{project.matchPercentage}% Match</span>
            </span>
          )}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center space-x-1.5 transition"
        >
          <span>View Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
