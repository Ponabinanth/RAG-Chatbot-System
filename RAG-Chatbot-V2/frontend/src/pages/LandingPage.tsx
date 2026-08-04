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
