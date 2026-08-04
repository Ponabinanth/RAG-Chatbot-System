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
