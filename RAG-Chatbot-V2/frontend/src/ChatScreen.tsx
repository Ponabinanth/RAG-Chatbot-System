import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from './AuthContext';
import {
  apiCreateSession, apiListSessions, apiGetSession, apiDeleteSession,
  apiStreamChat, apiUploadDocument, apiListDocuments, apiDeleteDocument,
  type Session, type ChatMessage, type Document,
} from './api';

// ─── SVG Icons ─────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const UploadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const StopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="3" />
  </svg>
);
const ChatIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const AILogo = () => (
  <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
    <path d="M14 3C8.477 3 4 7.477 4 13c0 2.136.67 4.116 1.806 5.737L4 24l5.557-1.74A9.953 9.953 0 0014 23c5.523 0 10-4.477 10-10S19.523 3 14 3z" fill="white" fillOpacity="0.95"/>
  </svg>
);
const DBIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
  </svg>
);
// SettingsIcon removed (unused)
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Copy Button ──────────────────────────────────────────────────────────

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  if (small) {
    return (
      <button onClick={handle} className="code-copy-btn">
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Copied!' : 'Copy code'}
      </button>
    );
  }
  return (
    <button onClick={handle} className="msg-action-btn">
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── Markdown Renderer ─────────────────────────────────────────────────────

function MessageContent({ content }: { content: string }) {
  return (
    <div className="prose-ai">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children }: any) {
            const match = /language-(\w+)/.exec(className || '');
            if (!match) {
              return (
                <code style={{ background: 'var(--color-surface-hover)', color: '#e2b96e', fontFamily: 'var(--font-family-mono)', fontSize: '0.875em', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--color-border)' }}>
                  {children}
                </code>
              );
            }
            return (
              <div style={{ margin: '1em 0', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <div className="code-header">
                  <span className="code-lang">{match[1]}</span>
                  <CopyButton text={String(children).replace(/\n$/, '')} small />
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 0, padding: '1rem 1.25rem', fontSize: '13.5px', background: '#1e1e1e', fontFamily: 'var(--font-family-mono)' }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ─── Welcome Screen ────────────────────────────────────────────────────────

function WelcomeScreen({ onSuggestion }: { onSuggestion: (t: string) => void }) {
  const cards = [
    { icon: '✍️', label: 'Write', text: 'Write a professional email declining a meeting politely' },
    { icon: '💻', label: 'Code', text: 'Build a REST API in Python with FastAPI and SQLite' },
    { icon: '🔬', label: 'Explain', text: 'Explain how neural networks learn, step by step' },
    { icon: '📊', label: 'Analyze', text: 'What are the pros and cons of microservices vs monolith?' },
    { icon: '🧮', label: 'Solve', text: 'Solve: integrate x²·ln(x) dx step by step' },
    { icon: '🌍', label: 'Explore', text: 'What are the biggest challenges in climate science today?' },
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-logo">
        <AILogo />
      </div>
      <h2 className="welcome-title">What can I help with?</h2>
      <p className="welcome-sub">Ask anything — I can write, code, analyze, explain, and more.</p>
      <div className="suggestion-grid">
        {cards.map((c, i) => (
          <motion.button
            key={i}
            className="suggestion-card"
            onClick={() => onSuggestion(c.text)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="suggestion-icon">{c.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</span>
            <span className="suggestion-text">{c.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Message Row ───────────────────────────────────────────────────────────

function MessageRow({ msg, userInitial }: { msg: ChatMessage; userInitial: string; isLast?: boolean }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      className={`msg-row ${isUser ? 'user-row' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={`msg-avatar ${isUser ? 'user-avatar-msg' : 'ai-avatar'}`}>
        {isUser ? userInitial : <AILogo />}
      </div>
      <div className="msg-content-wrap">
        <div className="msg-name">{isUser ? 'You' : 'NovaMind AI'}</div>
        {isUser ? (
          <div className="msg-bubble-user">{msg.content}</div>
        ) : (
          <MessageContent content={msg.content} />
        )}
        <div className="msg-actions">
          <CopyButton text={msg.content} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ──────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="typing-dots">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ChatScreen() {
  const { token, userEmail, logout } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [useRag, setUseRag] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sidebarSection, setSidebarSection] = useState<'chats' | 'docs'>('chats');
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [_showModelMenu, _setShowModelMenu] = useState(false);

  // Load data
  useEffect(() => {
    if (!token) return;
    apiListSessions(token).then(d => { setSessions(d); setSessionsLoaded(true); }).catch(console.error);
    apiListDocuments(token).then(setDocuments).catch(console.error);
  }, [token]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  // Create new session
  const createNewSession = useCallback(async () => {
    if (!token) return null;
    const session = await apiCreateSession(token);
    setSessions(prev => [session, ...prev]);
    setActiveSessionId(session.id);
    setMessages([]);
    setStreamingContent('');
    return session.id;
  }, [token]);

  // Switch session
  const switchSession = useCallback(async (id: number) => {
    if (!token || id === activeSessionId) return;
    setActiveSessionId(id);
    setStreamingContent('');
    try {
      const data = await apiGetSession(token, id);
      setMessages(data.messages);
    } catch { setMessages([]); }
  }, [token, activeSessionId]);

  // Delete session
  const deleteSession = useCallback(async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    await apiDeleteSession(token, id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) { setActiveSessionId(null); setMessages([]); }
  }, [token, activeSessionId]);

  // Send message
  const handleSend = useCallback(async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isStreaming) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = await createNewSession();
      if (!sessionId) return;
    }

    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    const tempMsg: ChatMessage = { id: Date.now(), role: 'user', content: message, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);

    const ctrl = apiStreamChat(
      token!, sessionId, message, useRag,
      chunk => setStreamingContent(prev => prev + chunk),
      () => {
        apiGetSession(token!, sessionId!).then(data => {
          setMessages(data.messages);
          setSessions(prev =>
            prev.map(s => s.id === sessionId
              ? { ...s, title: data.messages[0]?.content.slice(0, 55) || s.title, updated_at: new Date().toISOString() }
              : s
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          );
        });
        setStreamingContent('');
        setIsStreaming(false);
      },
      err => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `⚠️ **Error:** ${err}`, created_at: new Date().toISOString() }]);
        setStreamingContent('');
        setIsStreaming(false);
      },
    );
    abortRef.current = ctrl;
  }, [input, isStreaming, activeSessionId, token, useRag, createNewSession]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    if (streamingContent) {
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: streamingContent, created_at: new Date().toISOString() }]);
      setStreamingContent('');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingDoc(true);
    try {
      const doc = await apiUploadDocument(token, file);
      setDocuments(prev => [doc, ...prev]);
      setSidebarSection('docs');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDoc = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    await apiDeleteDocument(token, id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';
  const hasMessages = messages.length > 0 || isStreaming;

  return (
    <div className="app-shell">
      {/* ─── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon"><AILogo /></div>
            <span className="sidebar-logo-text">NovaMind</span>
          </div>
          <button
            onClick={createNewSession}
            title="New chat"
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '6px', borderRadius: 8, display: 'flex', transition: 'background 0.12s, color 0.12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
          >
            <PlusIcon />
          </button>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8, padding: '0 2px' }}>
          {(['chats', 'docs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSidebarSection(tab)}
              style={{
                flex: 1, padding: '6px', borderRadius: 8, border: 'none', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
                background: sidebarSection === tab ? 'var(--color-surface)' : 'transparent',
                color: sidebarSection === tab ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
            >
              {tab === 'chats' ? 'Chats' : `Docs${documents.length > 0 ? ` (${documents.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="sidebar-list">
          {sidebarSection === 'chats' ? (
            <>
              {!sessionsLoaded ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                  <div style={{ width: 18, height: 18, border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                </div>
              ) : sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 12px', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  <div style={{ marginBottom: 8, fontSize: 24 }}>💬</div>
                  No conversations yet
                  <br />
                  <span style={{ fontSize: 12 }}>Start by typing a message</span>
                </div>
              ) : (
                <>
                  <div className="sidebar-section-label">Recent</div>
                  {sessions.map(s => (
                    <div
                      key={s.id}
                      className={`chat-item ${s.id === activeSessionId ? 'active' : ''}`}
                      onClick={() => switchSession(s.id)}
                    >
                      <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}><ChatIcon /></span>
                      <span className="chat-item-text">{s.title}</span>
                      <button
                        className="chat-item-delete"
                        onClick={e => deleteSession(s.id, e)}
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              <label className="upload-zone">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                  disabled={uploadingDoc}
                />
                {uploadingDoc ? (
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(16,163,127,0.3)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                ) : (
                  <UploadIcon />
                )}
                <span>{uploadingDoc ? 'Uploading…' : 'Upload PDF / DOCX / TXT'}</span>
              </label>
              {documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 12px', color: 'var(--color-text-muted)', fontSize: 12.5 }}>
                  Upload documents to enable RAG search
                </div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="doc-item">
                    <span style={{ color: 'var(--color-primary-light)', flexShrink: 0 }}><FileIcon /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.filename}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{doc.chunk_count} chunks</div>
                    </div>
                    <span className="doc-badge">RAG</span>
                    <button
                      className="chat-item-delete"
                      style={{ opacity: 0 }}
                      onClick={e => handleDeleteDoc(doc.id, e)}
                      title="Remove"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* RAG toggle */}
          <button
            className={`rag-toggle ${useRag ? 'on' : ''}`}
            onClick={() => setUseRag(r => !r)}
          >
            <DBIcon />
            <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>Document Search</span>
            <div className={`toggle-track ${useRag ? 'on' : ''}`}>
              <div className={`toggle-thumb ${useRag ? 'on' : ''}`} />
            </div>
          </button>

          {/* User row */}
          <button className="sidebar-footer-btn" onClick={logout}>
            <div className="user-avatar">{userInitial}</div>
            <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
              {userEmail}
            </span>
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* ─── Main ──────────────────────────────────────────────────────── */}
      <main className="main-area">
        {/* Top bar */}
        <div className="topbar">
          <div className="model-pill">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
            Gemini 1.5 Pro
            <ChevronIcon />
          </div>
        </div>

        {/* Messages */}
        <div className="messages-scroll">
          <div className="messages-container">
            {!hasMessages ? (
              <WelcomeScreen onSuggestion={text => handleSend(text)} />
            ) : (
              <>
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <MessageRow
                      key={msg.id}
                      msg={msg}
                      userInitial={userInitial}
                      isLast={i === messages.length - 1}
                    />
                  ))}
                </AnimatePresence>

                {/* Streaming */}
                {isStreaming && (
                  <div className="msg-row">
                    <div className="msg-avatar ai-avatar"><AILogo /></div>
                    <div className="msg-content-wrap">
                      <div className="msg-name">NovaMind AI</div>
                      {streamingContent ? (
                        <div className="msg-ai-content">
                          <MessageContent content={streamingContent} />
                          <span className="cursor-blink" />
                        </div>
                      ) : (
                        <TypingDots />
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} style={{ height: 16 }} />
              </>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrap">
            <div className="input-box">
              {/* Upload button */}
              <label className="input-tool-btn upload-btn" title="Upload file">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                  disabled={uploadingDoc}
                />
                {uploadingDoc
                  ? <div style={{ width: 15, height: 15, border: '2px solid rgba(16,163,127,0.3)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <UploadIcon />
                }
              </label>

              <textarea
                ref={textareaRef}
                id="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message NovaMind AI"
                rows={1}
                disabled={isStreaming}
                className="chat-textarea"
              />

              {isStreaming ? (
                <button className="stop-btn" onClick={stopStreaming} title="Stop generating">
                  <StopIcon />
                </button>
              ) : (
                <button
                  id="send-btn"
                  className="send-btn"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </button>
              )}
            </div>
            <div className="input-footer">
              NovaMind AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
