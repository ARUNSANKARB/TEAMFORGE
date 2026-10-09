import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { CandidateCard } from '../components/CandidateCard';
import { TeamHealthScore } from '../components/TeamHealthScore';
import { Sparkles, Compass, Plus, Users, FolderKanban, CheckSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [teamHealth, setTeamHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, demoRes] = await Promise.all([
          api.get('/projects'),
          api.get('/recommendations/demo').catch(() => null)
        ]);

        if (projRes.success) {
          setProjects(projRes.data.slice(0, 3));
        }

        if (demoRes && demoRes.success) {
          setRecommendations(demoRes.data.recommendations.slice(0, 3));
          if (demoRes.data.team) {
            setTeamHealth(demoRes.data.team.health);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Student Collaboration Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user?.fullName || 'Student'}</span> 👋
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            TeamForge recommendation engine has calculated compatibility scores across 20+ active student profiles for your active projects.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/recommendations/demo"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 flex items-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Recommendation Engine</span>
            </Link>

            <Link
              to="/projects"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center space-x-2 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Browse All Projects</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">8</div>
            <div className="text-xs text-slate-400">Active Projects</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">20+</div>
            <div className="text-xs text-slate-400">Student Profiles</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">88.4%</div>
            <div className="text-xs text-slate-400">Avg Team Health</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">12</div>
            <div className="text-xs text-slate-400">Tasks Completed</div>
          </div>
        </div>
      </div>

      {/* Team Health Score Index Component */}
      {teamHealth && <TeamHealthScore health={teamHealth} />}

      {/* Recommended Candidates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Recommended High-Compatibility Teammates</span>
            </h2>
            <p className="text-xs text-slate-400">Top candidate matches evaluated with transparent scoring</p>
          </div>

          <Link to="/recommendations/demo" className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1">
            <span>View All AI Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((cand, idx) => (
            <CandidateCard key={idx} candidate={cand} />
          ))}
        </div>
      </div>

      {/* Discover Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Featured Software Projects Recruiting Teammates</span>
            </h2>
            <p className="text-xs text-slate-400">Explore innovation projects matching your technical skills</p>
          </div>

          <Link to="/projects" className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1">
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </div>
    </div>
  );
};
