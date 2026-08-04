import { useState } from 'react';
import { motion } from 'framer-motion';

const STORY_STARTERS = [
  { emoji: '🐉', theme: 'Dragon', starter: 'Once upon a time, in a land of magic and mystery, there lived a young dragon named Ember who had never learned to breathe fire…' },
  { emoji: '🚀', theme: 'Space', starter: 'Captain Lily zoomed through the stars in her tiny rocket ship when suddenly the engines sputtered and she spotted a glowing planet below…' },
  { emoji: '🌊', theme: 'Ocean', starter: 'Deep beneath the shimmering sea, a young mermaid named Pearl discovered a golden treasure chest covered in barnacles and seaweed…' },
  { emoji: '🏰', theme: 'Castle', starter: 'In the highest tower of the ancient castle, young Prince Finn found a magical book that, when opened, transported him to a world made entirely of sweets…' },
];

const CONTINUATIONS: Record<string, string[]> = {
  '🐉': [
    '…but one chilly morning, Ember discovered that instead of fire, she could breathe rainbow-colored bubbles! All the animals in the forest loved her bubbles, except for the grumpy old troll who lived under the bridge.',
    'The troll grumbled: "Those silly bubbles are no use to anyone!" But when a terrible snowstorm covered the forest, Ember had an idea. She blew the biggest, most magical bubble ever — and it floated above the forest like a giant rainbow dome, keeping everyone warm and cozy inside!',
    'All the animals cheered. Even the grumpy troll smiled (just a tiny bit). And from that day on, Ember the Bubble Dragon was the most beloved creature in all the land. THE END 🌟',
  ],
  '🚀': [
    '…Lily steered carefully toward the glowing planet and landed in a field of giant, bouncy mushrooms. "Hello!" called a tiny alien with four eyes and purple fur. "We\'ve been waiting for you, Captain Lily!"',
    '"Waiting for me?" she asked, surprised. The alien nodded. "You are the chosen one. Our planet\'s sun is shrinking, and only someone from Earth knows how to help!" Lily thought hard. Back home, she\'d learned about stars in science class.',
    '"We need to plant a Sunflower Seed from Earth!" she declared. Lucky for her, she always kept a handful of seeds in her pocket. They planted it together, and slowly, the planet\'s sun grew bright again. Lily returned home a hero! THE END 🌟',
  ],
  '🌊': [
    '…Pearl swam closer. The chest was locked with a puzzle: three riddles written in glowing letters. She solved them one by one, using everything she\'d learned at Ocean School.',
    'When the final lock clicked open, out floated thousands of tiny glowing fish — fish that had been trapped for a hundred years! They sang a beautiful song of thanks and gave Pearl a magical pearl necklace that let her breathe on land.',
    '"Now I can visit both worlds," Pearl whispered in wonder. She became the bridge between the ocean and the shore, and humans and sea creatures lived in harmony forever after. THE END 🌟',
  ],
  '🏰': [
    '…Finn tumbled through the pages and landed with a PLOP in a land where the roads were made of candy canes and the hills were giant scoops of ice cream!',
    '"Careful where you step!" warned a tiny cookie. "Our kingdom is melting! The Sugar Sun is too hot today!" Finn looked up and saw the problem — a giant magnifying glass was pointing sunlight right at the kingdom.',
    'Using his royal cape, Finn blocked the magnifying glass and saved the candy kingdom! The grateful cookie queen baked him a magic portal cake that took him safely back home. That night, he dreamed in colors he had never seen before. THE END 🌟',
  ],
};

export default function StoryCreator() {
  const [chosen, setChosen] = useState<typeof STORY_STARTERS[0] | null>(null);
  const [parts, setParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const start = (s: typeof STORY_STARTERS[0]) => {
    setChosen(s);
    setParts([s.starter]);
    setDone(false);
  };

  const continueStory = () => {
    if (!chosen || loading) return;
    setLoading(true);
    const continuations = CONTINUATIONS[chosen.emoji] || [];
    const nextIndex = parts.length - 1;
    setTimeout(() => {
      if (nextIndex < continuations.length) {
        setParts(p => [...p, continuations[nextIndex]]);
        if (nextIndex >= continuations.length - 1) setDone(true);
      }
      setLoading(false);
    }, 1500);
  };

  const reset = () => { setChosen(null); setParts([]); setDone(false); };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(139,92,246,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📚</div>
        <div>
          <div className="tool-page-title">Story Creator</div>
          <div className="tool-page-desc">Build magical stories — choose a theme and let the adventure begin!</div>
        </div>
        {chosen && <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={reset}>← New Story</button>}
      </div>

      {!chosen ? (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15 }}>✨ Choose a story theme to begin your adventure:</p>
          <div className="grid-2">
            {STORY_STARTERS.map((s, i) => (
              <motion.div
                key={s.theme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="tool-card"
                onClick={() => start(s)}
              >
                <div style={{ fontSize: 52, marginBottom: 8 }}>{s.emoji}</div>
                <div className="tool-card-title">{s.theme} Adventure</div>
                <div className="tool-card-desc" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {s.starter.slice(0, 80)}…
                </div>
                <div className="tool-card-badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                  Start Story →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 32 }}>{chosen.emoji}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
              {chosen.theme} Adventure
            </span>
          </div>

          <div className="story-output" style={{ marginBottom: 24 }}>
            {parts.map((part, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginBottom: i < parts.length - 1 ? 20 : 0 }}
              >
                {part}
              </motion.p>
            ))}
            {loading && (
              <div className="typing-dots" style={{ marginTop: 16 }}><span /><span /><span /></div>
            )}
          </div>

          {!done ? (
            <button className="btn btn-primary" onClick={continueStory} disabled={loading}>
              {loading ? <><span className="spinner" /> Writing…</> : '✨ Continue Story →'}
            </button>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="card" style={{ textAlign: 'center', background: 'rgba(245,158,11,0.1)', borderColor: '#f59e0b' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎊</div>
              <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: 18 }}>The End! Great story!</div>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={reset}>Create Another Story</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

