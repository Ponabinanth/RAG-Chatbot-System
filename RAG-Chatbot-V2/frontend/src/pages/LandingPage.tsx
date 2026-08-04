import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🎓', title: 'For Students', desc: 'AI study tools, flashcards, GPA calculator, Pomodoro timer and more to ace your exams.', color: 'var(--role-student)', bg: 'var(--role-student-light)' },
  { icon: '👶', title: 'For Children', desc: 'Fun interactive games and activities — math, spelling, drawing, and storytelling!', color: '#fbbf24', bg: 'var(--role-child-light)' },
  { icon: '💼', title: 'For Professionals', desc: 'Productivity powerhouse — task management, meeting notes, email drafting, time tracking.', color: 'var(--brand-accent)', bg: 'var(--role-pro-light)' },
];

const TOOLS = [
  { emoji: '🤖', name: 'AI Study Assistant', role: 'student' },
  { emoji: '🃏', name: 'Flashcard Generator', role: 'student' },
  { emoji: '⏱️', name: 'Pomodoro Timer', role: 'student' },
  { emoji: '📊', name: 'GPA Calculator', role: 'student' },
  { emoji: '🔢', name: 'Math Playground', role: 'child' },
  { emoji: '🐝', name: 'Spelling Bee', role: 'child' },
  { emoji: '🎨', name: 'Drawing Canvas', role: 'child' },
  { emoji: '📚', name: 'Story Creator', role: 'child' },
  { emoji: '📋', name: 'Task Manager', role: 'pro' },
  { emoji: '📝', name: 'Meeting Notes', role: 'pro' },
  { emoji: '✉️', name: 'Email Drafter', role: 'pro' },
  { emoji: '⏱️', name: 'Time Tracker', role: 'pro' },
];

export default function LandingPage() {
  return (
    <div className="landing-hero">
      {/* Floating orbs */}
      <div className="landing-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-icon">🧠</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>
            EduPro Hub
          </span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/auth" className="btn btn-ghost">Sign in</Link>
          <Link to="/auth" className="btn btn-primary">Get Started Free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="landing-hero-content">
        <motion.div
          className="landing-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ✨ The All-in-One Learning & Productivity Platform
        </motion.div>

        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Learn smarter.<br />
          <span className="gradient-text">Work faster.</span><br />
          Grow together.
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          EduPro Hub is a powerful all-in-one platform with 18+ tools for students,
          children, and working professionals — powered by AI.
        </motion.p>

        <motion.div
          className="landing-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/auth" className="btn btn-primary btn-lg">Start for Free — No Credit Card</Link>
          <a href="#features" className="btn btn-secondary btn-lg">See all tools ↓</a>
        </motion.div>

        {/* Tool pills */}
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 48, maxWidth: 700 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.04 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--text-secondary)',
              }}
            >
              {tool.emoji} {tool.name}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Feature Cards */}
      <section id="features">
        <div className="landing-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="role-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{
                width: 60, height: 60,
                borderRadius: 'var(--radius-lg)',
                background: f.bg,
                border: `1px solid ${f.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <div className="role-card-title" style={{ color: f.color }}>{f.title}</div>
              <div className="role-card-desc">{f.desc}</div>
              <Link to="/auth" className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
                Get started →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 13 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
          🧠 EduPro Hub
        </div>
        Built with ❤️ for learners of all ages · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

