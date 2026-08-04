import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Op = '+' | '-' | '×' | '÷';
type Level = 'easy' | 'medium' | 'hard';

function generateQuestion(op: Op, level: Level) {
  const max = level === 'easy' ? 10 : level === 'medium' ? 25 : 50;
  let a = Math.floor(Math.random() * max) + 1;
  let b = Math.floor(Math.random() * max) + 1;
  let answer: number;

  if (op === '-') { if (a < b) [a, b] = [b, a]; answer = a - b; }
  else if (op === '×') { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
  else if (op === '÷') {
    b = Math.floor(Math.random() * 9) + 1;
    a = b * (Math.floor(Math.random() * 10) + 1);
    answer = a / b;
  } else { answer = a + b; }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const wrong = answer + (Math.floor(Math.random() * 10) - 5);
    if (wrong !== answer && wrong >= 0) options.add(wrong);
  }
  return { a, b, op, answer, options: [...options].sort(() => Math.random() - 0.5) };
}

export default function MathPlayground() {
  const [level, setLevel] = useState<Level>('easy');
  const [op, setOp] = useState<Op>('+');
  const [q, setQ] = useState(() => generateQuestion('+', 'easy'));
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);

  const next = useCallback(() => {
    setQ(generateQuestion(op, level));
    setSelected(null);
  }, [op, level]);

  const answer = (opt: number) => {
    if (selected !== null) return;
    setSelected(opt);
    setTotal(t => t + 1);
    if (opt === q.answer) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(next, 1200);
  };

  useEffect(() => { setQ(generateQuestion(op, level)); setSelected(null); }, [op, level]);

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(245,158,11,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🔢</div>
        <div>
          <div className="tool-page-title">Math Playground</div>
          <div className="tool-page-desc">Fun math challenges for young minds!</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <select className="form-select" value={level} onChange={e => setLevel(e.target.value as Level)}>
            <option value="easy">😊 Easy</option>
            <option value="medium">🤔 Medium</option>
            <option value="hard">🔥 Hard</option>
          </select>
        </div>
      </div>

      {/* Operation Selector */}
      <div className="tab-bar mb-6" style={{ maxWidth: 400 }}>
        {(['+', '-', '×', '÷'] as Op[]).map(o => (
          <button key={o} className={`tab-item${op === o ? ' active' : ''}`} onClick={() => setOp(o)} style={{ fontSize: 18 }}>{o}</button>
        ))}
      </div>

      {/* Score */}
      <div className="dashboard-stats mb-6" style={{ maxWidth: 500 }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Score</div>
          <div className="math-score" style={{ fontSize: 32 }}>{score}</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Total</div>
          <div className="math-score" style={{ fontSize: 32 }}>{total}</div>
