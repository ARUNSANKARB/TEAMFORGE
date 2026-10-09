import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { Search, Filter, Compass, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DiscoverProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [domain, status, difficulty]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (domain) params.domain = domain;
      if (status) params.status = status;
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;

      const res = await api.get('/projects', { params });
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2.5">
            <Compass className="w-6 h-6 text-blue-400" />
            <span>Discover Engineering Projects</span>
          </h1>
          <p className="text-xs text-slate-400">Search projects recruiting teammates across various engineering domains</p>
        </div>

        <Link
          to="/projects/new"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center space-x-1.5 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects by title, description, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shrink-0"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
            >
              <option value="">All Domains</option>
              <option value="AI_ML">AI / Machine Learning</option>
              <option value="WEB_DEV">Web Development</option>
              <option value="MOBILE_DEV">Mobile Development</option>
              <option value="CYBERSECURITY">Cybersecurity</option>
              <option value="CLOUD">Cloud & DevOps</option>
              <option value="BLOCKCHAIN">Blockchain</option>
              <option value="IOT">IoT & Embedded</option>
              <option value="HEALTHCARE">Healthcare</option>
              <option value="FINTECH">FinTech</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="RECRUITING">Recruiting</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading engineering projects...</div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <p className="text-slate-400 text-sm font-medium">No projects match the selected filters.</p>
          <button
            onClick={() => { setDomain(''); setStatus(''); setDifficulty(''); setSearch(''); }}
            className="text-xs text-blue-400 font-bold hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
};
