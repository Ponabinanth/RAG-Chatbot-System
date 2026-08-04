import { useState, useEffect, useRef } from 'react';

type Phase = 'focus' | 'break' | 'long-break';

const PHASES: Record<Phase, { label: string; duration: number; color: string }> = {
  focus: { label: 'Focus', duration: 25 * 60, color: '#6c63ff' },
  break: { label: 'Short Break', duration: 5 * 60, color: '#10b981' },
  'long-break': { label: 'Long Break', duration: 15 * 60, color: '#06b6d4' },
};

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>('focus');
  const [timeLeft, setTimeLeft] = useState(PHASES.focus.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocus, setTotalFocus] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalRef = useRef(PHASES[phase].duration);

  useEffect(() => {
    totalRef.current = PHASES[phase].duration;
    setTimeLeft(PHASES[phase].duration);
    setRunning(false);
  }, [phase]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false);
            if (phase === 'focus') {
              setSessions(s => s + 1);
              setTotalFocus(tf => tf + PHASES.focus.duration / 60);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase]);

