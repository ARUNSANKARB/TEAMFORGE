import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { BarChart3, Award, ShieldCheck, Cpu, Layers, CheckCircle2 } from 'lucide-react';

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [sysRes, evalRes] = await Promise.all([
        api.get('/analytics/system'),
        api.get('/analytics/evaluation')
      ]);

      if (sysRes.success) setAnalytics(sysRes.data);
      if (evalRes.success) setEvaluation(evalRes.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-400">Loading system analytics & research metrics...</div>;

  const domainChartData = analytics?.projectsByDomain 
    ? Object.entries(analytics.projectsByDomain).map(([key, val]) => ({ name: key, count: val }))
    : [
        { name: 'WEB_DEV', count: 4 },
        { name: 'AI_ML', count: 3 },
        { name: 'BLOCKCHAIN', count: 2 },
        { name: 'IOT', count: 2 },
        { name: 'HEALTHCARE', count: 1 }
      ];

  const skillChartData = analytics?.studentsBySkill
    ? Object.entries(analytics.studentsBySkill).map(([key, val]) => ({ skill: key, students: val }))
    : [
        { skill: 'SQL', students: 19 },
        { skill: 'Java', students: 18 },
        { skill: 'Python', students: 16 },
        { skill: 'React', students: 15 },
        { skill: 'Spring Boot', students: 14 }
      ];

  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <span>System Analytics & Research Evaluation</span>
        </h1>
        <p className="text-xs text-slate-400">Real-time metrics and algorithm evaluation for conference paper presentation</p>
      </div>

      {/* Research Paper Evaluation Card */}
      {evaluation && (
        <div className="bg-gradient-to-r from-blue-900/30 via-indigo-950/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Conference Evaluation Protocol Metrics</h2>
              <p className="text-xs text-slate-400">{evaluation.notes}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">{(evaluation.precision * 100).toFixed(1)}%</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">Precision</div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-blue-400">{(evaluation.recall * 100).toFixed(1)}%</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">Recall</div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-indigo-400">{(evaluation.f1Score * 100).toFixed(1)}%</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">F1-Score</div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-purple-400">{(evaluation.skillCoverageRate * 100).toFixed(1)}%</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">Skill Coverage</div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-amber-400">{evaluation.averageTeamCompatibility}%</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">Avg Compatibility</div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-teal-400">{(evaluation.newcomerExposureRate * 100).toFixed(1)}%</div>
              <div className="text-[11px] font-semibold text-slate-400 mt-1">Newcomer Exposure</div>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Domain Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Projects Distribution by Domain</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {domainChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Students by Technical Skill */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Student Skill Taxonomy Supply</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillChartData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="skill" type="category" stroke="#64748b" fontSize={11} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="students" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
