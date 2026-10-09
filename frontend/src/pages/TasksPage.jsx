import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TaskBoard } from '../components/TaskBoard';

export const TasksPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasksForProject(selectedProjectId);
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

  const fetchTasksForProject = async (projId) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/project/${projId}`);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}/status?status=${newStatus}`);
      if (res.success) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleCreateTask = async (taskForm) => {
    try {
      const res = await api.post('/tasks', {
        projectId: selectedProjectId,
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || null
      });
      if (res.success) {
        setTasks([...tasks, res.data]);
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleAddComment = async (taskId, commentText) => {
    try {
      const res = await api.post(`/tasks/${taskId}/comments?commentText=${encodeURIComponent(commentText)}`);
      if (res.success) {
        fetchTasksForProject(selectedProjectId);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="space-y-4">
      {projects.length > 0 && (
        <div className="flex items-center justify-end space-x-2 pb-2">
          <label className="text-xs text-slate-400 font-semibold">Project Kanban Board:</label>
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

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading Kanban tasks...</div>
      ) : (
        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onCreateTask={handleCreateTask}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};
