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

  const sorted = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(6,182,212,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⏰</div>
        <div>
          <div className="tool-page-title">Exam Countdown</div>
          <div className="tool-page-desc">Track all your upcoming exams and never be caught off guard</div>
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(s => !s)}>
          + Add Exam
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 24 }}
          >
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div className="form-group">
                <label className="form-label">Exam Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Final Exam" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics" />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <button className="btn btn-primary" onClick={addExam}>Add</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sorted.length === 0 ? (
          <div className="empty-state"><span className="empty-state-emoji">📅</span><div className="empty-state-text">No exams added yet. Click "Add Exam" to get started!</div></div>
        ) : (
          sorted.map((exam, i) => {
            const time = getTimeLeft(exam.date);
            const isPast = !time;
            const color = time ? getUrgencyColor(time.days) : 'var(--text-muted)';
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="exam-item"
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{exam.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {exam.subject && <span>{exam.subject} · </span>}
                    {new Date(exam.date).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                {isPast ? (
                  <span className="badge" style={{ background: 'rgba(107,114,128,0.15)', color: 'var(--text-muted)' }}>Passed</span>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    <div className="exam-countdown" style={{ color }}>
                      {time!.days}d {time!.hours}h {time!.minutes}m
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>remaining</div>
                  </div>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => setExams(prev => prev.filter(e => e.id !== exam.id))} style={{ color: 'var(--text-muted)' }}>✕</button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

