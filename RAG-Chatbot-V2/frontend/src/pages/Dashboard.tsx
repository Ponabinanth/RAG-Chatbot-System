import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';

const STUDENT_TOOLS = [
  { icon: '🤖', title: 'AI Study Assistant', desc: 'Chat with AI about any subject', path: '/tools/study-assistant', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
  { icon: '🃏', title: 'Flashcard Generator', desc: 'Create smart study cards from notes', path: '/tools/flashcards', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { icon: '⏱️', title: 'Pomodoro Timer', desc: '25-min focus sessions with breaks', path: '/tools/pomodoro', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { icon: '📊', title: 'GPA Calculator', desc: 'Calculate weighted GPA instantly', path: '/tools/gpa', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { icon: '📖', title: 'Citation Generator', desc: 'APA, MLA, Chicago citations', path: '/tools/citation', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { icon: '⏰', title: 'Exam Countdown', desc: 'Never miss an exam deadline', path: '/tools/exam-countdown', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
];

const CHILD_TOOLS = [
  { icon: '🔢', title: 'Math Playground', desc: 'Fun arithmetic quizzes & games', path: '/tools/math', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { icon: '🐝', title: 'Spelling Bee', desc: 'Spell words and win trophies!', path: '/tools/spelling', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { icon: '📚', title: 'Story Creator', desc: 'Build magical stories with AI', path: '/tools/story', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { icon: '🎨', title: 'Drawing Canvas', desc: 'Express yourself with colors', path: '/tools/drawing', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { icon: '🔤', title: 'ABC Learning', desc: 'Learn letters and words', path: '/tools/abc', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

const PRO_TOOLS = [
  { icon: '🤖', title: 'AI Assistant', desc: 'Professional AI-powered Q&A', path: '/tools/pro-assistant', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
  { icon: '📝', title: 'Meeting Notes', desc: 'AI summarizes your meeting text', path: '/tools/meeting-notes', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { icon: '📋', title: 'Task Manager', desc: 'Kanban board for your projects', path: '/tools/tasks', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { icon: '⏱️', title: 'Time Tracker', desc: 'Log hours across projects', path: '/tools/time-tracker', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { icon: '✉️', title: 'Email Drafter', desc: 'AI writes professional emails', path: '/tools/email-drafter', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { icon: '💰', title: 'Invoice Calculator', desc: 'Build and compute invoices', path: '/tools/invoice', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
];

function ToolCard({ tool, delay = 0 }: { tool: typeof STUDENT_TOOLS[0]; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link to={tool.path} className="tool-card">
        <div className="tool-card-icon" style={{ background: tool.bg }}>
          {tool.icon}
        </div>
        <div className="tool-card-title">{tool.title}</div>
        <div className="tool-card-desc">{tool.desc}</div>
        <div className="tool-card-badge" style={{ background: tool.bg, color: tool.color }}>
          Open →
        </div>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const tools = profile?.role === 'student' ? STUDENT_TOOLS
    : profile?.role === 'child' ? CHILD_TOOLS
    : PRO_TOOLS;

  const roleEmoji = profile?.role === 'student' ? '🎓' : profile?.role === 'child' ? '👶' : '💼';
  const quickTip = profile?.role === 'student'
    ? 'Pro tip: Use Pomodoro + Flashcards for maximum retention!'
    : profile?.role === 'child'
    ? 'Ready to play and learn today? 🌟'
    : 'Boost your productivity with AI-powered tools!';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          {roleEmoji} {greeting}, {displayName}!
        </div>
        <div className="dashboard-sub">{quickTip}</div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Available Tools</div>
          <div className="stat-value">{tools.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Role</div>
          <div className="stat-value" style={{ fontSize: 20, textTransform: 'capitalize' }}>
            {profile?.role || '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {new Date().toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="stat-value" style={{ fontSize: 16, color: '#34d399' }}>✓ Active</div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="tools-section">
        <div className="tools-section-title">
          <span>Your Tools</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>{tools.length} available</span>
        </div>
        <div className="tools-grid">
          {tools.map((tool, i) => (
            <ToolCard key={tool.path} tool={tool} delay={i * 0.06} />
          ))}
        </div>
      </div>

      {/* Quick Start Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          background: 'var(--gradient-brand)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>
            🚀 Ready to get started?
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Pick any tool above and start learning or working smarter today.
          </div>
        </div>
        <Link to={tools[0].path} className="btn" style={{ background: 'white', color: '#6c63ff', fontWeight: 700, flexShrink: 0 }}>
          {tools[0].icon} Open {tools[0].title}
        </Link>
      </motion.div>
    </div>
  );
}

