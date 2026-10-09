import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Compass, 
  FolderKanban, 
  Users, 
  Sparkles, 
  CheckSquare, 
  BarChart3, 
  User, 
  Settings, 
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Discover Projects', icon: Compass },
    { path: '/my-projects', label: 'My Projects', icon: FolderKanban },
    { path: '/my-teams', label: 'My Teams', icon: Users },
    { path: '/recommendations/demo', label: 'AI Match Engine', icon: Sparkles, badge: 'Live AI' },
    { path: '/tasks', label: 'Tasks Board', icon: CheckSquare },
    { path: '/analytics', label: 'Analytics & Research', icon: BarChart3 },
    { path: '/profile', label: 'Student Profile', icon: User },
  ];

  if (user && user.role === 'ADMIN') {
    navItems.push({ path: '/admin', label: 'Admin Control', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-200 ease-in-out flex flex-col justify-between p-4
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Platform Menu
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info box */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="text-xs font-semibold text-slate-300">TeamForge v1.0.0</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Final-Year Research Implementation</div>
        </div>
      </aside>
    </>
  );
};
