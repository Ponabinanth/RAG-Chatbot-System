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
