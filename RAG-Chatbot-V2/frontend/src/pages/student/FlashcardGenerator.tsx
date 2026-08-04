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

