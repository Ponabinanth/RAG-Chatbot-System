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
