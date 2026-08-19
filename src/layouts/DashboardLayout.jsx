import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, CalendarCheck,
  Dumbbell, Bell, BarChart3, LogOut, Menu, X,
  Search, ChevronDown, Zap, Shield, UserCheck, Briefcase
} from 'lucide-react';
import { useAuth, ROLE_CONFIG } from '../context/AuthContext';
import { notifications as sampleNotifs } from '../data/sampleData';

// All nav items with role permissions
const ALL_NAV = [
  { to: '/dashboard',               label: 'Dashboard',        icon: LayoutDashboard, end: true,  roles: ['master_admin', 'trainer', 'staff'] },
  { to: '/dashboard/members',       label: 'Members',          icon: Users,           end: false, roles: ['master_admin', 'trainer', 'staff'] },
  { to: '/dashboard/plans',         label: 'Membership Plans', icon: CreditCard,      end: false, roles: ['master_admin', 'staff'] },
  { to: '/dashboard/attendance',    label: 'Attendance',       icon: CalendarCheck,   end: false, roles: ['master_admin', 'trainer', 'staff'] },
  { to: '/dashboard/trainers',      label: 'Trainers',         icon: Dumbbell,        end: false, roles: ['master_admin'] },
  { to: '/dashboard/notifications', label: 'Notifications',    icon: Bell,            end: false, roles: ['master_admin', 'trainer', 'staff'] },
  { to: '/dashboard/reports',       label: 'Reports',          icon: BarChart3,       end: false, roles: ['master_admin'] },
];

const ROLE_ICONS = { master_admin: Shield, trainer: Dumbbell, staff: Briefcase };

export default function DashboardLayout() {
  const { currentUser, logout, ROLE_CONFIG } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = currentUser?.role || 'staff';
  const roleConfig = ROLE_CONFIG[role];
  const RoleIcon = ROLE_ICONS[role] || UserCheck;

  // Filter nav based on current user's role
  const navItems = ALL_NAV.filter(n => n.roles.includes(role));

  // Unread notifications
  const unreadCount = sampleNotifs.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = currentUser?.avatar ||
    currentUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col bg-gray-900 border-r border-gray-800
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center shadow-md">
              <Zap size={16} className="text-gray-950" />
            </div>
            <span className="text-lg font-black tracking-tight">
              Gym<span className="text-[#39FF14]">Force</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* User profile card in sidebar */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${roleConfig?.color || '#39FF14'}40, ${roleConfig?.color || '#39FF14'}20)`, border: `1px solid ${roleConfig?.color || '#39FF14'}30` }}
            >
              <span style={{ color: roleConfig?.color }}>{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.name || 'User'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <RoleIcon size={10} style={{ color: roleConfig?.color }} />
                <span className="text-xs font-medium" style={{ color: roleConfig?.color }}>
                  {roleConfig?.label || role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-xs text-gray-600 uppercase tracking-widest px-3 py-2">Main Menu</p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/70'
                }
              `}
              style={({ isActive }) => isActive ? {
                background: `${roleConfig?.color}14`,
                border: `1px solid ${roleConfig?.color}22`,
                color: roleConfig?.color,
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} style={isActive ? { color: roleConfig?.color } : {}} className={!isActive ? 'text-gray-500 group-hover:text-gray-300' : ''} />
                  <span className="flex-1">{label}</span>
                  {label === 'Notifications' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Gym info at bottom */}
        <div className="px-4 py-2 border-t border-gray-800">
          <p className="text-xs text-gray-600 truncate">{currentUser?.gym}</p>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg">
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          {/* Role badge — desktop */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{
            background: `${roleConfig?.color}12`,
            borderColor: `${roleConfig?.color}30`,
            color: roleConfig?.color,
          }}>
            <RoleIcon size={11} />
            {roleConfig?.label}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{unreadCount} new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {sampleNotifs.slice(0, 5).map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${!n.read ? 'bg-gray-800/20' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.severity === 'error' ? 'bg-red-500' : n.severity === 'success' ? 'bg-[#39FF14]' : n.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
                          <div>
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{n.message}</p>
                            <p className="text-xs text-gray-600 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-800">
                    <NavLink to="/dashboard/notifications" onClick={() => setNotifOpen(false)} className="text-xs font-semibold" style={{ color: roleConfig?.color }}>
                      View all notifications →
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: `${roleConfig?.color}25`, color: roleConfig?.color }}
                >
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{currentUser?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currentUser?.email}</p>
                </div>
                <ChevronDown size={13} className="text-gray-500 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                        style={{ background: `${roleConfig?.color}25`, color: roleConfig?.color }}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{currentUser?.name}</p>
                        <p className="text-xs" style={{ color: roleConfig?.color }}>{roleConfig?.label}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      Change Password
                    </button>
                    <hr className="border-gray-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for dropdowns */}
      {(profileOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}
    </div>
  );
}
