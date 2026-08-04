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
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-label">🔥 Streak</div>
          <div className="math-score" style={{ fontSize: 32, color: streak >= 3 ? '#f59e0b' : 'var(--text-primary)' }}>{streak}</div>
        </div>
      </div>

      <div className="math-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${q.a}${q.op}${q.b}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className="math-question">
              {q.a} {q.op} {q.b} = ?
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="math-options">
          {q.options.map(opt => (
            <motion.button
              key={opt}
              className={`math-option${selected !== null ? (opt === q.answer ? ' correct' : selected === opt ? ' wrong' : '') : ''}`}
              onClick={() => answer(opt)}
              whileHover={selected === null ? { scale: 1.05 } : {}}
              whileTap={selected === null ? { scale: 0.95 } : {}}
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {streak >= 3 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: 24, textAlign: 'center', marginTop: 16 }}>
            🔥 {streak} in a row! Amazing!
          </motion.div>
        )}
      </div>
    </div>
  );
}

