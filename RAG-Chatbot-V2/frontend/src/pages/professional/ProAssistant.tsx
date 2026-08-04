import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isRealAiAvailable, generateAiResponse } from '../../ai';

interface Message { role: 'user' | 'assistant'; content: string; }

const CONTEXTS = ['General', 'Legal', 'Finance', 'Marketing', 'HR', 'Tech', 'Strategy'];

const SAMPLE_RESPONSES: Record<string, string> = {
  General: `Thank you for your question. Here's a professional analysis:\n\n**Key Insights:**\n1. The situation requires careful consideration of multiple factors\n2. Industry best practices suggest a structured approach\n3. Implementation should be phased for maximum effectiveness\n\n**Recommended Action:**\nStart with a stakeholder analysis, define clear KPIs, and establish a feedback loop for continuous improvement.\n\nWould you like me to elaborate on any specific aspect?`,
  Finance: `From a financial perspective, here's my analysis:\n\n**Financial Considerations:**\n• ROI projection: 18-24 month payback period\n• Risk-adjusted return: 12-15% IRR\n• Cash flow impact: Positive by Q3\n\n**Recommendation:** Proceed with phased investment, starting with a pilot in Q1 to validate assumptions before full deployment.`,
  Marketing: `Excellent marketing question! Here's my strategic take:\n\n**Market Analysis:**\n• Target demographic: well-defined and reachable\n• Competitive landscape: moderate competition\n• Growth opportunity: significant white space\n\n**Strategy:** Focus on content-led growth combined with targeted paid acquisition. A 70/30 split between organic and paid should optimize CAC while building long-term brand equity.`,
};

export default function ProAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '💼 Hello! I\'m your Professional AI Assistant. I can help with strategy, analysis, writing, problem-solving, and professional advice. What\'s on your agenda today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('General');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      if (isRealAiAvailable) {
        const sysPrompt = `You are a highly capable Professional AI Assistant acting as an expert consultant in ${context}. The user needs your advice or help. Be professional, concise, and insightful.`;
        const aiResponse = await generateAiResponse(sysPrompt, msg);
