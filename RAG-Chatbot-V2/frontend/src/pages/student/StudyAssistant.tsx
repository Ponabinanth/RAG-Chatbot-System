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
          };
          const resp = responses[subject] || `*(⚠️ Demo Mode: Add Gemini API key to .env for real AI responses)*\n\nThat's a great question about **${subject}**! Here's my explanation of "${userMsg}":\n\nThis topic involves several key concepts. The main idea is to understand the underlying principles and how they apply to different situations.\n\n**Key points to remember:**\n• Start with the fundamentals\n• Practice with examples\n• Connect concepts together\n\nDo you have a specific aspect you'd like me to elaborate on?`;
          setMessages(prev => [...prev, { role: 'assistant', content: resp }]);
          setLoading(false);
        }, 1200);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ **Error connecting to AI:** ${err.message}` }]);
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div className="tool-card-icon" style={{ background: 'rgba(108,99,255,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🤖</div>
        <div>
          <div className="tool-page-title">AI Study Assistant</div>
          <div className="tool-page-desc">Ask anything — get clear, step-by-step explanations</div>
        </div>
        <select className="form-select" style={{ marginLeft: 'auto', width: 180 }} value={subject} onChange={e => setSubject(e.target.value)}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`chat-message ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="chat-avatar" style={{ background: msg.role === 'user' ? 'var(--gradient-brand)' : 'var(--bg-elevated)' }}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="chat-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <div className="chat-avatar" style={{ background: 'var(--bg-elevated)' }}>🤖</div>
              <div className="chat-bubble">
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <div className="chat-input-row">
            <textarea
              className="chat-input"
              placeholder={`Ask about ${subject}…`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

