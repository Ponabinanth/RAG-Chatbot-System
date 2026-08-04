import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALPHABET = [
  { letter: 'A', word: 'Apple', emoji: '🍎', sound: 'ah' },
  { letter: 'B', word: 'Ball', emoji: '⚽', sound: 'buh' },
  { letter: 'C', word: 'Cat', emoji: '🐱', sound: 'kuh' },
  { letter: 'D', word: 'Dog', emoji: '🐶', sound: 'duh' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', sound: 'eh' },
  { letter: 'F', word: 'Fish', emoji: '🐟', sound: 'fuh' },
  { letter: 'G', word: 'Grapes', emoji: '🍇', sound: 'guh' },
  { letter: 'H', word: 'House', emoji: '🏠', sound: 'huh' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', sound: 'ih' },
  { letter: 'J', word: 'Jellyfish', emoji: '🪼', sound: 'juh' },
  { letter: 'K', word: 'Kite', emoji: '🪁', sound: 'kuh' },
  { letter: 'L', word: 'Lion', emoji: '🦁', sound: 'luh' },
  { letter: 'M', word: 'Moon', emoji: '🌙', sound: 'muh' },
  { letter: 'N', word: 'Nest', emoji: '🪺', sound: 'nuh' },
  { letter: 'O', word: 'Orange', emoji: '🍊', sound: 'oh' },
  { letter: 'P', word: 'Pizza', emoji: '🍕', sound: 'puh' },
  { letter: 'Q', word: 'Queen', emoji: '👑', sound: 'kwuh' },
  { letter: 'R', word: 'Rainbow', emoji: '🌈', sound: 'ruh' },
  { letter: 'S', word: 'Sun', emoji: '☀️', sound: 'suh' },
  { letter: 'T', word: 'Tree', emoji: '🌳', sound: 'tuh' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', sound: 'uh' },
  { letter: 'V', word: 'Volcano', emoji: '🌋', sound: 'vuh' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉', sound: 'wuh' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', sound: 'zuh' },
  { letter: 'Y', word: 'Yacht', emoji: '⛵', sound: 'yuh' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', sound: 'zuh' },
];

type Mode = 'browse' | 'quiz';

export default function ABCLearning() {
  const [selected, setSelected] = useState(ALPHABET[0]);
  const [mode, setMode] = useState<Mode>('browse');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizInput, setQuizInput] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const quizItem = ALPHABET[quizIndex % ALPHABET.length];

  const checkQuiz = () => {
    if (!quizInput.trim()) return;
    const correct = quizInput.trim().toUpperCase() === quizItem.word.toUpperCase();
    setQuizResult(correct ? 'correct' : 'wrong');
    setQuizTotal(t => t + 1);
    if (correct) setQuizScore(s => s + 1);
  };

  const nextQuiz = () => {
    setQuizIndex(i => i + 1);
    setQuizInput('');
    setQuizResult(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(16,185,129,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🔤</div>
        <div>
          <div className="tool-page-title">ABC Learning</div>
          <div className="tool-page-desc">Learn letters, words, and sounds! 🌟</div>
        </div>
        <div className="tab-bar" style={{ marginLeft: 'auto' }}>
          <button className={`tab-item${mode === 'browse' ? ' active' : ''}`} onClick={() => setMode('browse')}>📚 Browse</button>
          <button className={`tab-item${mode === 'quiz' ? ' active' : ''}`} onClick={() => setMode('quiz')}>🎯 Quiz</button>
        </div>
      </div>

      {mode === 'browse' ? (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Letter Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))', gap: 8, maxWidth: 380 }}>
            {ALPHABET.map(item => (
              <motion.button
                key={item.letter}
                onClick={() => setSelected(item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 52, height: 52,
                  borderRadius: 10,
                  border: `2px solid ${selected.letter === item.letter ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  background: selected.letter === item.letter ? 'var(--role-student-light)' : 'var(--bg-card)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 800,
                  color: selected.letter === item.letter ? 'var(--brand-primary-light)' : 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                {item.letter}
              </motion.button>
            ))}
          </div>

          {/* Selected Letter Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.letter}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ flex: 1, minWidth: 260 }}
            >
              <div className="abc-card">
                <div className="abc-letter">{selected.letter}</div>
                <div style={{ fontSize: 64, marginBottom: 8 }}>{selected.emoji}</div>
                <div className="abc-word">{selected.word}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
                  Sound: "{selected.sound}"
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--text-muted)', fontSize: 13 }}>
                {selected.letter} is for {selected.word}! {selected.emoji}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 15, fontWeight: 700 }}>
            <span>Question {quizIndex + 1}</span>
            <span>⭐ {quizScore}/{quizTotal}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={quizIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: 'center', marginBottom: 32 }}
            >
              <div style={{ fontSize: 80, marginBottom: 8 }}>{quizItem.emoji}</div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>What word does this picture show?</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-primary-light)', marginTop: 8 }}>
                Starts with: {quizItem.letter}
              </div>
            </motion.div>
          </AnimatePresence>

          {!quizResult ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="form-input"
                value={quizInput}
                onChange={e => setQuizInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkQuiz()}
                placeholder="Type the word…"
                style={{ fontSize: 18, textAlign: 'center' }}
                autoFocus
              />
              <button className="btn btn-primary" onClick={checkQuiz}>Go! ✓</button>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="card" style={{ textAlign: 'center', background: quizResult === 'correct' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}>
              <div style={{ fontSize: 48 }}>{quizResult === 'correct' ? '🎉' : '😅'}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8, color: quizResult === 'correct' ? '#34d399' : '#f87171' }}>
                {quizResult === 'correct' ? 'Correct! 🌟' : `The answer is: ${quizItem.word}`}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={nextQuiz}>Next →</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

