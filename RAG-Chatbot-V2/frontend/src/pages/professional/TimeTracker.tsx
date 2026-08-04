import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Log { id: string; project: string; duration: number; date: string; }

export default function TimeTracker() {
  const [project, setProject] = useState('');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<Log[]>([
    { id: '1', project: 'Client Website', duration: 95, date: new Date().toLocaleDateString() },
    { id: '2', project: 'Internal Meeting', duration: 45, date: new Date().toLocaleDateString() },
  ]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const toggle = () => {
    if (!project.trim()) { alert('Please enter a project name first!'); return; }
    setRunning(r => !r);
  };

  const stop = () => {
    if (elapsed < 5) { setRunning(false); setElapsed(0); return; }
    setLogs(prev => [{
      id: Date.now().toString(),
      project: project.trim() || 'Untitled',
      duration: Math.floor(elapsed / 60),
      date: new Date().toLocaleDateString(),
    }, ...prev]);
    setRunning(false);
    setElapsed(0);
    setProject('');
  };

  const totalMinutes = logs.reduce((sum, l) => sum + l.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  const projectGroups = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.project] = (acc[l.project] || 0) + l.duration;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(16,185,129,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⏱️</div>
        <div>
          <div className="tool-page-title">Time Tracker</div>
          <div className="tool-page-desc">Track billable hours across all your projects</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Timer */}
        <div className="card" style={{ textAlign: 'center' }}>
          <input
            className="form-input mb-4"
            value={project}
            onChange={e => setProject(e.target.value)}
            placeholder="Project name…"
            style={{ textAlign: 'center', fontSize: 16 }}
            disabled={running}
          />

          <div className="tracker-display" style={{ color: running ? '#34d399' : 'var(--text-primary)' }}>
            {hh}:{mm}:{ss}
          </div>

          {running && (
            <motion.div
              className="pulse"
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399', margin: '12px auto' }}
            />
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
            <button className={`btn btn-lg ${running ? 'btn-secondary' : 'btn-primary'}`} onClick={toggle} style={{ minWidth: 130 }}>
              {running ? '⏸ Pause' : '▶ Start'}
            </button>
            {(running || elapsed > 0) && (
              <button className="btn btn-secondary btn-lg" onClick={stop}>⏹ Stop & Save</button>
            )}
          </div>

          {/* Today Summary */}
          <div className="dashboard-stats" style={{ marginTop: 24 }}>
            <div className="stat-card">
              <div className="stat-label">Today Total</div>
              <div className="stat-value" style={{ fontSize: 24 }}>{hours}h {minutes}m</div>
            </div>
