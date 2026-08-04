import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = [
  { word: 'APPLE', hint: '🍎 A red or green fruit', level: 'easy' },
  { word: 'ELEPHANT', hint: '🐘 The largest land animal', level: 'medium' },
  { word: 'UMBRELLA', hint: '☂️ Used in the rain', level: 'medium' },
  { word: 'BUTTERFLY', hint: '🦋 A beautiful flying insect', level: 'hard' },
  { word: 'RAINBOW', hint: '🌈 Appears after rain', level: 'easy' },
  { word: 'DINOSAUR', hint: '🦕 Extinct giant reptile', level: 'hard' },
  { word: 'SUNSHINE', hint: '☀️ Light from the sun', level: 'easy' },
  { word: 'CHOCOLATE', hint: '🍫 A sweet brown treat', level: 'medium' },
  { word: 'ADVENTURE', hint: '🗺️ An exciting journey', level: 'hard' },
  { word: 'GIRAFFE', hint: '🦒 Tallest animal in the world', level: 'medium' },
];

function shuffle(arr: typeof WORDS) { return [...arr].sort(() => Math.random() - 0.5); }

export default function SpellingBee() {
  const [wordList] = useState(() => shuffle(WORDS));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [total, setTotal] = useState(0);

  const current = wordList[index % wordList.length];

  const check = () => {
    if (!input.trim()) return;
    const correct = input.trim().toUpperCase() === current.word;
    setResult(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    setIndex(i => i + 1);
    setInput('');
    setResult(null);
    setShowHint(false);
  };

  const levelColor: Record<string, string> = {
    easy: '#34d399', medium: '#f59e0b', hard: '#f87171',
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(249,115,22,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🐝</div>
        <div>
          <div className="tool-page-title">Spelling Bee</div>
          <div className="tool-page-desc">Spell the word correctly to win! 🏆</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>⭐ {score}/{total}</span>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Level badge */}
        <div style={{ textAlign: 'center' }}>
          <span className="badge" style={{ background: `${levelColor[current.level]}22`, color: levelColor[current.level], fontSize: 12 }}>
            {current.level.toUpperCase()} LEVEL
          </span>
        </div>

        {/* Word display (blanks) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {current.word.split('').map((letter, i) => {
            const userLetter = input.toUpperCase()[i];
            const isCorrect = result === 'correct';
            const isWrong = result === 'wrong' && userLetter !== letter;
            return (
              <motion.div
                key={i}
                style={{
                  width: 44, height: 52,
                  border: `2px solid ${isCorrect ? '#34d399' : isWrong ? '#f87171' : userLetter ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 800,
                  background: isCorrect ? 'rgba(52,211,153,0.1)' : isWrong ? 'rgba(248,113,113,0.1)' : 'var(--bg-card)',
                  color: isCorrect ? '#34d399' : isWrong ? '#f87171' : 'var(--text-primary)',
                }}
                animate={result === 'correct' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ delay: i * 0.05 }}
              >
                {result ? letter : userLetter || ''}
              </motion.div>
            );
          })}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', fontSize: 18, color: 'var(--text-secondary)' }}
            >
              {current.hint}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        {!result && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="Type your answer…"
              maxLength={current.word.length}
              style={{ fontSize: 18, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              autoFocus
            />
            <button className="btn btn-primary" onClick={check}>Check ✓</button>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card"
              style={{ textAlign: 'center', background: result === 'correct' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', borderColor: result === 'correct' ? '#34d399' : '#f87171' }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>{result === 'correct' ? '🎉' : '😅'}</div>
              <div style={{ fontWeight: 700, color: result === 'correct' ? '#34d399' : '#f87171', fontSize: 18 }}>
                {result === 'correct' ? 'Correct! Well done!' : `It's spelled: ${current.word}`}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={next}>
                Next Word →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {!result && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowHint(h => !h)}>
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={next}>Skip →</button>
          </div>
        )}
      </div>
    </div>
  );
}

