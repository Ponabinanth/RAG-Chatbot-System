import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isRealAiAvailable, generateAiResponse } from '../../ai';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science', 'Economics'];

export default function StudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hi! I\'m your AI Study Assistant. Ask me anything about any subject — I\'ll explain it clearly and help you understand.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      if (isRealAiAvailable) {
        const sysPrompt = `You are a helpful AI Study Assistant specializing in ${subject}. The user is asking a question. Please explain it clearly and step-by-step.`;
        const aiResponse = await generateAiResponse(sysPrompt, userMsg);
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setLoading(false);
      } else {
        // Fallback simulate AI response
        setTimeout(() => {
          const responses: Record<string, string> = {
            Mathematics: `*(⚠️ Demo Mode: Add Gemini API key to .env for real AI responses)*\n\nGreat question! Let me break this down step by step:\n\n**${userMsg}**\n\nIn mathematics, this concept relates to fundamental principles. Here's how to approach it:\n\n1. First, identify the key variables\n2. Apply the relevant formulas\n3. Verify your answer\n\nWould you like me to explain with a specific example?`,
            Physics: `*(⚠️ Demo Mode: Add Gemini API key to .env for real AI responses)*\n\nExcellent physics question! The concept of "${userMsg}" is fundamental to understanding physical phenomena.\n\nKey principles involved:\n• Newton's laws often apply here\n• Energy conservation is crucial\n• Consider the system boundaries\n\nLet me know if you need a worked example!`,
