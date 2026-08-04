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
