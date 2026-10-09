import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    bio: '',
    preferredRole: '',
    secondaryRole: '',
    projectInterests: '',
    availabilityHours: 15,
    githubUrl: '',
    linkedinUrl: ''
  });

  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, skillRes] = await Promise.all([
        api.get('/profiles/me'),
        api.get('/skills')
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (skillRes.success) setAllSkills(skillRes.data);
    } catch (err) {
      console.error('Error fetching edit profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/profiles/me', profile);
      if (res.success) {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;
    try {
      const res = await api.post(`/profiles/me/skills?skillId=${selectedSkillId}&level=${proficiency}`);
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Error adding skill:', err);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      const res = await api.delete(`/profiles/me/skills/${skillId}`);
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Error removing skill:', err);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading edit form...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Edit Student Profile</h1>
        <button onClick={() => navigate('/profile')} className="text-xs text-slate-400 hover:text-white">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Short Bio</label>
          <textarea
            rows="3"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Preferred Role</label>
            <input
              type="text"
              value={profile.preferredRole || ''}
              onChange={(e) => setProfile({ ...profile, preferredRole: e.target.value })}
              placeholder="Backend Developer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Weekly Free Hours</label>
            <input
              type="number"
              value={profile.availabilityHours || 15}
              onChange={(e) => setProfile({ ...profile, availabilityHours: parseInt(e.target.value) || 15 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Project Interests (Comma-separated)</label>
          <input
            type="text"
            value={profile.projectInterests || ''}
            onChange={(e) => setProfile({ ...profile, projectInterests: e.target.value })}
            placeholder="AI/ML, Web Development, Cloud"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
          />
        </div>

        {/* Skill Management section */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="block text-slate-300 font-bold text-sm">Add Technical Skill</label>
          <div className="flex gap-2">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            >
              <option value="">Select a skill...</option>
              {allSkills.map((sk) => (
                <option key={sk.id} value={sk.id}>{sk.name} ({sk.category})</option>
              ))}
            </select>

            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>

            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shrink-0"
            >
              Add
            </button>
          </div>

          <div className="space-y-1.5 pt-2">
            {profile.skills && profile.skills.map((s) => (
              <div key={s.skillId} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span>{s.skillName} ({s.proficiencyLevel})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.skillId)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
