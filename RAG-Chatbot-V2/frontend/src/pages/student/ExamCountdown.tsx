import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Exam { id: string; name: string; date: string; subject: string; }

function getTimeLeft(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

function getUrgencyColor(days: number) {
  if (days <= 2) return '#f87171';
  if (days <= 7) return '#fbbf24';
  return '#34d399';
}

export default function ExamCountdown() {
  const [exams, setExams] = useState<Exam[]>([
    { id: '1', name: 'Calculus Final', date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], subject: 'Mathematics' },
    { id: '2', name: 'Physics Midterm', date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], subject: 'Physics' },
  ]);
  const [form, setForm] = useState({ name: '', date: '', subject: '' });
  const [showForm, setShowForm] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const addExam = () => {
    if (!form.name || !form.date) return;
    setExams(prev => [...prev, { ...form, id: Date.now().toString() }]);
    setForm({ name: '', date: '', subject: '' });
    setShowForm(false);
  };

