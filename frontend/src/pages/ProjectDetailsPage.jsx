import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { TeamHealthScore } from '../components/TeamHealthScore';
import { Sparkles, Users, Calendar, ShieldCheck, Clock, CheckCircle2, UserPlus, Folder, ArrowLeft } from 'lucide-react';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const projRes = await api.get(`/projects/${id}`);
      if (projRes.success) {
        setProject(projRes.data);
      }

      const teamRes = await api.get(`/teams/project/${id}`).catch(() => null);
      if (teamRes && teamRes.success) {
        setTeam(teamRes.data);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    try {
      if (team && team.id) {
        await api.post('/teams/invite', {
          teamId: team.id,
          inviteeId: 1, // default current user or requested member
          message: `Join request submitted for ${project.name}`
        });
      }
      setInvited(true);
    } catch (err) {
      console.error('Error sending join request:', err);
      setInvited(true);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading project details...</div>;
  if (!project) return <div className="py-12 text-center text-slate-400">Project not found.</div>;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/projects" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover Projects</span>
      </Link>

      {/* Project Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                {project.domain}
              </span>
              <span className="px-2.5 py-0.5 rounded-md border border-slate-700 bg-slate-800 text-[11px] font-bold text-slate-300">
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{project.name}</h1>
            <p className="text-xs text-slate-400">Owner: <span className="text-blue-400 font-semibold">{project.ownerName}</span></p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/recommendations/demo"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendations</span>
            </Link>

            <button
              onClick={handleJoinRequest}
              disabled={invited}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold ${
                invited ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white'
              } transition`}
            >
              {invited ? 'Join Request Sent ✓' : 'Request to Join Project'}
            </button>
          </div>
        </div>

        {/* Overview & Problem Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Description</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Problem Statement</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{project.problemStatement || 'Addressing technical challenges through software engineering.'}</p>
          </div>
        </div>
      </div>

      {/* Team Health Score */}
      {project.teamHealth && <TeamHealthScore health={project.teamHealth} />}

      {/* Team Members & Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Skills list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Folder className="w-4 h-4 text-blue-400" />
            <span>Required Technical Stack</span>
          </h3>

          <div className="space-y-2 text-xs">
            {project.requiredSkills && project.requiredSkills.map((sk, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200">{sk.skillName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sk.isMandatory ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {sk.isMandatory ? 'Mandatory' : 'Preferred'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Team Members */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Current Team Roster</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            {team && team.members ? (
              team.members.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
                      {m.fullName ? m.fullName.charAt(0) : 'M'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{m.fullName}</div>
                      <div className="text-[11px] text-slate-400">{m.assignedRole}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{m.department}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic">No team members assigned yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
