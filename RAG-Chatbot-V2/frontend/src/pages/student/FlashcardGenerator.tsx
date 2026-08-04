import { useState } from 'react';
import { motion } from 'framer-motion';

interface Card { question: string; answer: string; }

const SAMPLE_NOTES = `The mitochondria is the powerhouse of the cell. It produces ATP through cellular respiration.
Photosynthesis converts sunlight, water, and CO2 into glucose and oxygen.
DNA is a double helix structure made of nucleotide bases: Adenine, Thymine, Guanine, Cytosine.
The cell membrane is selectively permeable, controlling what enters and exits the cell.`;

function generateCards(notes: string): Card[] {
  const lines = notes.split('\n').filter(l => l.trim().length > 20);
  return lines.slice(0, 8).map(line => {
    const words = line.trim().split(' ');
    const keyPart = words.slice(0, Math.floor(words.length / 2)).join(' ');
    return { question: `What is ${keyPart}?`, answer: line.trim() };
  });
}

export default function FlashcardGenerator() {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    const generated = generateCards(notes);
    if (generated.length === 0) return;
    setCards(generated);
    setCurrent(0);
    setFlipped(false);
    setKnown(new Set());
    setGenerated(true);
  };

  const next = (markKnown = false) => {
    if (markKnown) setKnown(prev => new Set([...prev, current]));
    setFlipped(false);
    setTimeout(() => setCurrent(c => (c + 1) % cards.length), 100);
  };

  const progress = cards.length > 0 ? (known.size / cards.length) * 100 : 0;

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(139,92,246,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🃏</div>
        <div>
          <div className="tool-page-title">Flashcard Generator</div>
          <div className="tool-page-desc">Paste your notes and get smart Q&A cards instantly</div>
        </div>
      </div>

      {!generated ? (
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="form-group mb-4">
            <label className="form-label">Paste your study notes</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={10}
              placeholder="Paste your notes here… Each sentence/paragraph becomes a flashcard."
            />
          </div>
          <button className="btn btn-primary" onClick={generate}>
            ✨ Generate Flashcards ({notes.split('\n').filter(l => l.trim().length > 20).length} cards)
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          {/* Progress */}
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div className="flex justify-between mb-2" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              <span>Card {current + 1} of {cards.length}</span>
              <span>✅ {known.size} known</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Card */}
          <div
            className={`flashcard${flipped ? ' flipped' : ''}`}
            onClick={() => setFlipped(f => !f)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face">
                <div className="flashcard-label">Question — Click to reveal</div>
                <div className="flashcard-content">{cards[current]?.question}</div>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-label" style={{ color: 'var(--brand-primary-light)' }}>Answer</div>
                <div className="flashcard-content" style={{ fontSize: 16 }}>{cards[current]?.answer}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-danger" onClick={() => next(false)}>
              ✗ Still learning
            </button>
            <button className="btn btn-primary" onClick={() => next(true)}>
              ✓ Got it!
            </button>
          </div>

          <button className="btn btn-ghost btn-sm" onClick={() => setGenerated(false)}>
            ← Back to notes
          </button>

          {known.size === cards.length && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="card"
              style={{ textAlign: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', maxWidth: 400 }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 700, color: '#34d399' }}>You've mastered all cards!</div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => { setKnown(new Set()); setCurrent(0); }}>
                Review again
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

