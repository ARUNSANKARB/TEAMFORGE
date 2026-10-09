import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Users, UserX, UserCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, enabled: !u.enabled } : u));
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading admin control panel...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-purple-400" />
          <span>Faculty & System Admin Control Center</span>
        </h1>
        <p className="text-xs text-slate-400">Manage user permissions, active status, and platform security</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registered System Users ({users.length})</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">College & Department</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/40">
                  <td className="p-3 font-semibold text-white">{u.fullName} <span className="text-slate-500 block text-[11px] font-normal">{u.email}</span></td>
                  <td className="p-3">{u.college} <span className="text-slate-500 block text-[11px]">{u.department} ({u.year})</span></td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-[10px]">{u.role}</span></td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                    >
                      {u.enabled ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
