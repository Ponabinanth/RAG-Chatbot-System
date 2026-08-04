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

  const reset = () => { setRunning(false); setTimeLeft(PHASES[phase].duration); };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const progress = 1 - timeLeft / PHASES[phase].duration;
  const circumference = 2 * Math.PI * 88;
  const phaseColor = PHASES[phase].color;

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(239,68,68,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⏱️</div>
        <div>
          <div className="tool-page-title">Pomodoro Timer</div>
          <div className="tool-page-desc">25-minute focus sessions for maximum productivity</div>
        </div>
      </div>

      {/* Phase Selector */}
      <div className="tab-bar mb-6" style={{ maxWidth: 400 }}>
        {(Object.keys(PHASES) as Phase[]).map(p => (
          <button key={p} className={`tab-item${phase === p ? ' active' : ''}`} onClick={() => setPhase(p)}>
            {PHASES[p].label}
          </button>
        ))}
      </div>

      <div className="pomodoro-wrap">
        {/* Timer Ring */}
        <div className="pomodoro-ring-wrap">
          <svg className="pomodoro-ring-svg" width="220" height="220" viewBox="0 0 220 220">
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={phaseColor} />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle className="pomodoro-ring-bg" cx="110" cy="110" r="88" />
            <circle
              className="pomodoro-ring-progress"
              cx="110" cy="110" r="88"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <div className="pomodoro-time">
            <div className="pomodoro-time-display">{mm}:{ss}</div>
            <div className="pomodoro-time-label">{PHASES[phase].label}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="pomodoro-controls">
          <button className="btn btn-secondary" onClick={reset}>↺ Reset</button>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setRunning(r => !r)}
            style={{ minWidth: 120 }}
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="btn btn-secondary" onClick={() => setPhase(p => p === 'focus' ? 'break' : 'focus')}>
            ⏭ Skip
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-stats" style={{ maxWidth: 500, width: '100%' }}>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Sessions Today</div>
            <div className="stat-value">{sessions}</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Focus Time (min)</div>
            <div className="stat-value">{totalFocus}</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Next Break</div>
            <div className="stat-value" style={{ fontSize: 16 }}>{sessions > 0 && sessions % 4 === 0 ? 'Long' : 'Short'}</div>
          </div>
        </div>

        {/* Tips */}
        <div className="card" style={{ maxWidth: 500, width: '100%', textAlign: 'center', background: 'rgba(108,99,255,0.05)', borderColor: 'rgba(108,99,255,0.15)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            💡 <strong>Pomodoro Technique:</strong> Work for 25 min, break for 5 min. After 4 sessions, take a 15-minute long break.
          </div>
        </div>
      </div>
    </div>
  );
}

