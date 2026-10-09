import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { FolderKanban, Plus } from 'lucide-react';

export const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      if (res.success) {
        setProjects(res.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching my projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <FolderKanban className="w-6 h-6 text-blue-400" />
            <span>My Projects</span>
          </h1>
          <p className="text-xs text-slate-400">Projects created or owned by you</p>
        </div>

        <Link
          to="/projects/new"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading your projects...</div>
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
