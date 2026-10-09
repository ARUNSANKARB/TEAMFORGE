import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, CheckCircle2, Sparkles, UserPlus, Check, X, ShieldAlert } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifRes, invRes] = await Promise.all([
        api.get('/notifications').catch(() => ({ success: false, data: [] })),
        api.get('/teams/invitations/me').catch(() => ({ success: false, data: [] }))
      ]);

      if (notifRes.success) setNotifications(notifRes.data);
      if (invRes.success) setInvitations(invRes.data);
    } catch (err) {
      console.error('Error fetching notifications or invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      const res = await api.post(`/teams/invitations/${invitationId}/accept`);
      if (res.success) {
        setInvitations(invitations.filter(i => i.id !== invitationId));
        setActionMessage('✓ Invitation accepted! You have joined the team.');
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error accepting invitation:', err);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      const res = await api.post(`/teams/invitations/${invitationId}/reject`);
      if (res.success) {
        setInvitations(invitations.filter(i => i.id !== invitationId));
        setActionMessage('Invitation declined.');
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error rejecting invitation:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading notifications & team invitations...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Bell className="w-6 h-6 text-blue-400" />
          <span>Notifications & Team Invitations</span>
        </h1>
        <p className="text-xs text-slate-400">Manage incoming team invitations, project matching alerts, and workspace updates</p>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Pending Invitations Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <UserPlus className="w-4 h-4 text-indigo-400" />
          <span>Pending Team Invitations ({invitations.length})</span>
        </h2>

        {invitations.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs italic">
            No pending team invitations.
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">
                    Invitation to join <span className="text-blue-400">{inv.team?.name || 'Project Team'}</span>
                  </div>
                  <p className="text-xs text-slate-300">{inv.message}</p>
                  <div className="text-[10px] text-slate-500">From: {inv.inviter?.fullName || 'Project Leader'}</div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleAcceptInvitation(inv.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center space-x-1 shadow-md shadow-emerald-600/20 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleRejectInvitation(inv.id)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center space-x-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Notifications Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Activity Alerts ({notifications.length})</h2>
        {notifications.length === 0 ? (
          <div className="py-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs italic">
            No notifications available.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition shadow-md flex items-start justify-between ${
                n.isRead ? 'bg-slate-900/60 border-slate-800/80 text-slate-400' : 'bg-slate-900 border-blue-500/30 text-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>{n.title}</span>
                </div>
                <p className="text-xs leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
