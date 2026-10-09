import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TeamHealthScore } from '../components/TeamHealthScore';
import { Users, ShieldCheck, UserCheck, Trash2, Layers, Plus, Edit2, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTeamsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserId, setAddUserId] = useState('4'); // Default student ID for demo
  const [addRole, setAddRole] = useState('Full-Stack Specialist');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamForProject(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      if (res.success && res.data.length > 0) {
        setProjects(res.data);
        setSelectedProjectId(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchTeamForProject = async (projId) => {
    setLoading(true);
    try {
      const res = await api.get(`/teams/project/${projId}`);
      if (res.success) {
        setTeam(res.data);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!team) return;
    try {
      const res = await api.delete(`/teams/${team.id}/members/${userId}`);
      if (res.success) {
        setTeam(res.data);
      }
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  const handleUpdateRole = async (userId) => {
    if (!team || !newRole.trim()) return;
    try {
      const res = await api.put(`/teams/${team.id}/members/${userId}/role?role=${encodeURIComponent(newRole)}`);
      if (res.success) {
        setTeam(res.data);
        setEditingUserId(null);
        setNewRole('');
      }
    } catch (err) {
      console.error('Error updating member role:', err);
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!team || !addUserId) return;
    try {
      const res = await api.post(`/recommendations/teams/${team.id}/add-member/${addUserId}?role=${encodeURIComponent(addRole)}`);
      if (res.success) {
        setTeam(res.data);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Error adding member to team:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>My Project Teams & Roster</span>
          </h1>
          <p className="text-xs text-slate-400">Manage team members, update assigned roles, and monitor team health</p>
        </div>

        {projects.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-semibold">Select Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-blue-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading team roster & dynamic health...</div>
      ) : team ? (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">{team.name}</h2>
              <p className="text-xs text-slate-400">
                Project: <span className="text-blue-400 font-semibold">{team.projectName}</span> • Team Leader: <span className="text-indigo-300 font-semibold">{team.leaderName}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>

              <Link
                to="/recommendations/demo"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <span>AI Recommendations</span>
              </Link>
            </div>
          </div>

          {team.health && <TeamHealthScore health={team.health} />}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Team Roster ({team.members ? team.members.length : 0})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members && team.members.map((m) => (
                <div key={m.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
                        {m.fullName ? m.fullName.charAt(0) : 'M'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 text-sm">{m.fullName}</div>
                        
                        {editingUserId === m.userId ? (
                          <div className="flex items-center space-x-1 mt-1">
                            <input
                              type="text"
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              placeholder="e.g. Frontend Lead"
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                            />
                            <button onClick={() => handleUpdateRole(m.userId)} className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingUserId(null)} className="p-1 text-slate-400 hover:bg-slate-800 rounded">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-xs text-blue-400 font-semibold">
                            <span>{m.assignedRole}</span>
                            <button
                              onClick={() => { setEditingUserId(m.userId); setNewRole(m.assignedRole); }}
                              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {m.userId !== team.leaderId && (
                      <button
                        onClick={() => handleRemoveMember(m.userId)}
                        title="Remove member from team"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-400">
                    {m.department} • {m.year}
                  </div>

                  {m.skills && m.skills.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Member Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {m.skills.slice(0, 4).map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-medium">
                            {sk.skillName} ({sk.proficiencyLevel})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 text-slate-400 text-sm">
          No active team roster found for this project.
        </div>
      )}

      {/* Modal: Add Team Member Direct CRUD */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Member to {team?.name}</h3>
            <form onSubmit={handleAddMemberSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Student Candidate</label>
                <select
                  value={addUserId}
                  onChange={(e) => setAddUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="4">Priya Sharma (AI/ML & Frontend)</option>
                  <option value="5">Rahul Verma (Backend & Java)</option>
                  <option value="6">Ananya Sundaram (React & UI/UX)</option>
                  <option value="7">Karthik Raja (Python & ML)</option>
                  <option value="8">Deepika R (DevOps & Testing)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Assigned Role</label>
                <input
                  type="text"
                  required
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  placeholder="e.g. Backend Specialist"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md shadow-blue-600/20"
                >
                  Add to Team Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
