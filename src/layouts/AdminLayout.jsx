import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  BookOpen, 
  UploadCloud, 
  BarChart3, 
  LogOut, 
  Shield, 
  User 
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@bhasa.com';

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  // Sidebar Links array with Uppercase text formatting
  const navItems = [
    { name: 'DASHBOARD', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'MODERATION', path: '/admin/moderation', icon: ShieldCheck },
    { name: 'LEXICON', path: '/admin/lexicon', icon: BookOpen },
    { name: 'DATASET UPLOAD', path: '/admin/upload', icon: UploadCloud },
    { name: 'CORPUS ANALYSIS', path: '/admin/analysis', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex selection:bg-blue-600 selection:text-white">
      
      {/* 🟢 LEFT SIDEBAR - Dark Blue Theme */}
      <aside className="w-64 bg-[#0B2F6B] text-white flex flex-col justify-between shadow-2xl fixed h-full z-10 border-r border-blue-900/40 transition-all duration-300">
        <div>
          {/* Header / Logo */}
          <div className="p-6 border-b border-blue-900/50 flex items-center gap-3 bg-[#082452]">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/40">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest text-white uppercase">BHASA PRO</h1>
              <p className="text-[10px] text-blue-200 font-semibold tracking-wider uppercase mt-0.5">Control Panel</p>
            </div>
          </div>

          {/* Navigation Links with Smooth Hover & Active Animations */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 transform hover:translate-x-1 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                        : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="p-4 border-t border-blue-900/50 bg-[#082452]">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-blue-950/50 rounded-xl border border-blue-800/40">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-200 flex-shrink-0">
              <User size={15} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-blue-100 truncate lowercase tracking-wider">{adminEmail}</p>
              <span className="inline-block text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">● WHITELISTED ADMIN</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-200 hover:text-white rounded-xl text-xs font-bold tracking-wider transition-all duration-300 shadow-sm hover:shadow-red-600/30 transform active:scale-95"
          >
            <LogOut size={15} />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* 🔵 RIGHT MAIN CONTENT AREA WITH WHITE/LIGHT BACKGROUND & ANIMATION */}
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto bg-gray-50 animate-fadeIn transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}