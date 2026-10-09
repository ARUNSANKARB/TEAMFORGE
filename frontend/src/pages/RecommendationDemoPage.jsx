import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CandidateCard } from '../components/CandidateCard';
import { TeamHealthScore } from '../components/TeamHealthScore';
import { Sparkles, Layers, ShieldCheck, CheckCircle2, UserPlus, RefreshCw, Award, ArrowRight } from 'lucide-react';

export const RecommendationDemoPage = () => {
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations/demo');
      if (res.success) {
        setProject(res.data.project);
        setTeam(res.data.team);
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.error('Error loading recommendation demo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setLoading(true);
    try {
      await api.post('/recommendations/demo/reset');
      const res = await api.get('/recommendations/demo');
      if (res.success) {
        setProject(res.data.project);
        setTeam(res.data.team);
        setRecommendations(res.data.recommendations);
        setNotification('✓ Demo state reset to initial benchmark roster.');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidateToTeam = async (candidate) => {
    if (!team) return;
    try {
      const res = await api.post(`/recommendations/teams/${team.id}/add-member/${candidate.candidateId}?role=${encodeURIComponent(candidate.candidateRole || 'Collaborator')}`);
      if (res.success) {
        setTeam(res.data);
        setRecommendations(recommendations.filter(r => r.candidateId !== candidate.candidateId));
        setNotification(`✓ ${candidate.candidateName} added to team! Dynamic Team Health score updated.`);
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      console.error('Error adding member to team:', err);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Initializing AI recommendation engine & loading candidate profiles...</div>;

  return (
    <div className="space-y-6">
      {/* Page Title & Explanation Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Demonstration Screen for Viva & Panel Evaluation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Team Recommendation Engine</h1>
            <p className="text-xs text-slate-300">Multi-factor compatibility evaluation with transparent explainability cards</p>
          </div>

          <button
            onClick={handleResetDemo}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center space-x-2 transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Dynamic Success Notification */}
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Target Project Overview */}
      {project && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Project Evaluation:</span>
              <h2 className="text-xl font-bold text-white">{project.name}</h2>
              <p className="text-xs text-slate-400">{project.description}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase">
              {project.domain}
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Required Skill Stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.requiredSkills && project.requiredSkills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium">
                  {s.skillName} {s.isMandatory && <span className="text-rose-400 font-bold">*</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Team Health Score Display */}
      {team && team.health && <TeamHealthScore health={team.health} />}

      {/* Recommended Candidates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Ranked Candidates ({recommendations.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Calculated utility score based on skills, complementarity, role, & availability</p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 text-slate-400 text-sm">
            All recommended candidates have been added to the team!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendations.map((cand, idx) => (
              <CandidateCard
                key={cand.candidateId || idx}
                candidate={cand}
                onAddToTeam={handleAddCandidateToTeam}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
