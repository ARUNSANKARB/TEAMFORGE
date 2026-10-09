import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, AlertCircle, MessageSquare, User, ArrowRight } from 'lucide-react';

export const TaskBoard = ({ tasks = [], onStatusChange, onCreateTask, onAddComment }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });

  const columns = [
    { key: 'TODO', label: 'To Do', color: 'border-slate-700 bg-slate-900/60' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/30 bg-blue-950/10' },
    { key: 'REVIEW', label: 'Under Review', color: 'border-amber-500/30 bg-amber-950/10' },
    { key: 'DONE', label: 'Completed', color: 'border-emerald-500/30 bg-emerald-950/10' }
  ];

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MEDIUM': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (onCreateTask && taskForm.title) {
      onCreateTask(taskForm);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
      setShowCreateModal(false);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (onAddComment && selectedTask && newComment.trim()) {
      onAddComment(selectedTask.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Header & Create Task */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span>Collaborative Project Kanban Task Board</span>
          </h2>
          <p className="text-xs text-slate-400">Track task progress, assign team members, and discuss deliverables</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* 4 Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} className={`border rounded-2xl p-4 flex flex-col space-y-3 min-h-[420px] ${col.color}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">{colTasks.length}</span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2.5 shadow-md group transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getPriorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                      {t.dueDate && (
                        <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{t.dueDate}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition">{t.title}</h4>
                    {t.description && <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-blue-400">
                          {t.assigneeName ? t.assigneeName.charAt(0) : 'U'}
                        </div>
                        <span className="text-[11px] font-medium">{t.assigneeName}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Status transition dropdown/buttons */}
                        <select
                          value={t.status}
                          onChange={(e) => onStatusChange && onStatusChange(t.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="REVIEW">Review</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Task */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Task</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Implement React Router navigation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows="3"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Describe task requirements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md shadow-blue-600/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
