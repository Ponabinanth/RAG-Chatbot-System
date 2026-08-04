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
