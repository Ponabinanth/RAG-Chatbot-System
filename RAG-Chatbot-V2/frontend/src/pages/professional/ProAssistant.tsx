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
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setLoading(false);
      } else {
        setTimeout(() => {
          const resp = SAMPLE_RESPONSES[context] || SAMPLE_RESPONSES.General;
          setMessages(prev => [...prev, { role: 'assistant', content: `*(⚠️ Demo Mode: Add Gemini API key to .env for real AI responses)*\n\n${resp}` }]);
          setLoading(false);
        }, 1400);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ **Error connecting to AI:** ${err.message}` }]);
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = ['Summarize key points', 'Write an executive summary', 'Identify risks', 'Suggest next steps'];

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(108,99,255,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🤖</div>
        <div>
          <div className="tool-page-title">Professional AI Assistant</div>
          <div className="tool-page-desc">Your intelligent work companion for every challenge</div>
        </div>
        <select className="form-select" style={{ marginLeft: 'auto', width: 160 }} value={context} onChange={e => setContext(e.target.value)}>
          {CONTEXTS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {QUICK_PROMPTS.map(p => (
          <button key={p} className="btn btn-secondary btn-sm" onClick={() => { setInput(p); }}>
            {p}
