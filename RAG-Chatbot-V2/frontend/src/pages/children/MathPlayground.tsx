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
