import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const STUDENT_NAV = [
  { icon: '🤖', label: 'Study Assistant', path: '/tools/study-assistant' },
  { icon: '🃏', label: 'Flashcards', path: '/tools/flashcards' },
  { icon: '⏱️', label: 'Pomodoro Timer', path: '/tools/pomodoro' },
  { icon: '📊', label: 'GPA Calculator', path: '/tools/gpa' },
  { icon: '📖', label: 'Citation Generator', path: '/tools/citation' },
  { icon: '⏰', label: 'Exam Countdown', path: '/tools/exam-countdown' },
];

const CHILD_NAV = [
  { icon: '🔢', label: 'Math Playground', path: '/tools/math' },
  { icon: '🐝', label: 'Spelling Bee', path: '/tools/spelling' },
  { icon: '📚', label: 'Story Creator', path: '/tools/story' },
  { icon: '🎨', label: 'Drawing Canvas', path: '/tools/drawing' },
  { icon: '🔤', label: 'ABC Learning', path: '/tools/abc' },
];

const PRO_NAV = [
  { icon: '🤖', label: 'AI Assistant', path: '/tools/pro-assistant' },
  { icon: '📝', label: 'Meeting Notes', path: '/tools/meeting-notes' },
  { icon: '📋', label: 'Task Manager', path: '/tools/tasks' },
  { icon: '⏱️', label: 'Time Tracker', path: '/tools/time-tracker' },
  { icon: '✉️', label: 'Email Drafter', path: '/tools/email-drafter' },
  { icon: '💰', label: 'Invoice Calc', path: '/tools/invoice' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = profile?.role === 'student' ? STUDENT_NAV
    : profile?.role === 'child' ? CHILD_NAV
    : PRO_NAV;

  const roleLabel = profile?.role === 'child' ? '👶 Child' : profile?.role === 'student' ? '🎓 Student' : '💼 Professional';
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <NavLink to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">🧠</div>
          <span className="sidebar-logo-text">Edu<span>Pro</span></span>
        </NavLink>

        <div className="sidebar-section-label">Dashboard</div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-nav-icon">🏠</span>
            <span>Home</span>
          </NavLink>

          <div className="sidebar-section-label" style={{ marginTop: 8 }}>My Tools</div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleSignOut} title="Sign out">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName}</div>
              <div className="sidebar-user-role">{roleLabel} · Sign out</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="app-main">
        <div className="app-topbar">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {location.pathname === '/dashboard' ? 'Dashboard' :
                navItems.find(n => n.path === location.pathname)?.label || 'Tool'}
            </span>
          </div>
          <span className={`badge badge-${profile?.role || 'student'}`}>{roleLabel}</span>
        </div>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
