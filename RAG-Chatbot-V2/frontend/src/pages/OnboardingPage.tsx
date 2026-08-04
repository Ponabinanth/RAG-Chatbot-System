import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import type { UserRole } from '../supabaseClient';

const ROLES = [
  {
    id: 'student' as UserRole,
    emoji: '🎓',
    label: 'Student',
    desc: 'Perfect for high school & college students who want to learn smarter with AI-powered study tools.',
    features: ['AI Study Assistant', 'Flashcard Generator', 'GPA Calculator', 'Pomodoro Timer'],
  },
  {
    id: 'child' as UserRole,
    emoji: '👶',
    label: 'Child',
    desc: 'Fun, engaging learning games and activities for kids aged 5–12. Learn while having a blast!',
    features: ['Math Playground', 'Spelling Bee', 'Drawing Canvas', 'Story Creator'],
  },
  {
    id: 'professional' as UserRole,
    emoji: '💼',
    label: 'Professional',
    desc: 'Boost your productivity at work with AI tools for tasks, emails, meetings, and more.',
    features: ['Task Manager', 'Meeting Notes', 'Email Drafter', 'Time Tracker'],
  },
];

export default function OnboardingPage() {
  const { updateRole, user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [name, setName] = useState((user as any)?.user_metadata?.display_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!selected) return;
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setLoading(true);
    setError('');
    try {
      await updateRole(selected, name.trim());
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      // Even if DB fails (no Supabase configured), redirect anyway
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <motion.div
        className="onboarding-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="onboarding-header">
          <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
          <h1>Welcome to EduPro Hub!</h1>
          <p>Tell us about yourself so we can personalise your experience.</p>
        </div>

        {/* Name Input */}
        <div className="form-group mb-6">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="What should we call you?"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ maxWidth: 400, margin: '0 auto', display: 'block' }}
          />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 600 }}>
          I am a…
        </p>

        <div className="role-picker">
          {ROLES.map((role, i) => (
            <motion.div
