import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Users, Layers, Award, ArrowRight, CheckCircle2, Code2, Compass, Cpu, Zap } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">Team<span className="text-blue-500">Forge</span></span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/recommendations/demo" className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition">
              Live AI Demo
            </Link>
            <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Final-Year Engineering Project & Conference Title Implementation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Build Better Teams. <br />
            <span className="gradient-text">Build Better Projects.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            TeamForge uses a constraint-first, multi-factor recommendation engine to form balanced student project teams based on technical skills, complementarity, availability, and project requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/recommendations/demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore AI Team Recommendations</span>
            </Link>

            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center space-x-2 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Discover Projects</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Multi-Factor Recommendation Features Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Multi-Factor Intelligent Matching Engine</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Moving beyond basic similarity search to evaluate true team complementarity, role alignment, and schedule windows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Skill Complementarity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prioritizes candidates who fill missing tech stack gaps (e.g. adding React frontend strength to a Java backend heavy team).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Constraint-First Eligibility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filters hard schedule availability constraints and concurrent project limits before ranking candidates.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Transparent Explainability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every recommendation comes with an itemized explanation card detailing exact matching reasons and skill additions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
