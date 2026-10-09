import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { User, Code2, Clock, Award, Github, Linkedin, ExternalLink, Edit3, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profiles/me');
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading student profile...</div>;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white">{profile?.fullName}</h1>
              <p className="text-xs text-slate-400">{profile?.college} • {profile?.department} ({profile?.year})</p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold">
                  {profile?.preferredRole || 'Software Developer'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold">
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {profile?.bio && (
          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">{profile.bio}</p>
        )}
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Technical Skills Taxonomy</span>
          </h3>

          <div className="space-y-2">
            {profile?.skills && profile.skills.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-slate-200">{s.skillName}</span>
                <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold">
                  {s.proficiencyLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Working style & experience */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Working Style & Availability</span>
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Weekly Availability:</span>
              <span className="font-bold text-emerald-400">{profile?.availabilityHours} Hours / Week</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Completed Projects:</span>
              <span className="font-bold text-slate-200">{profile?.previousProjectCount} Projects</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Leadership Experience:</span>
              <span className="font-bold text-indigo-400">{profile?.leadershipExperience ? 'Yes (Has Led Teams)' : 'Member / Developer'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
