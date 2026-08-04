import { useState } from 'react';
import { motion } from 'framer-motion';

type Tone = 'formal' | 'friendly' | 'assertive' | 'apologetic';
type Purpose = 'follow-up' | 'introduction' | 'proposal' | 'complaint' | 'thank-you' | 'request';

function generateEmail(to: string, _subject: string, tone: Tone, purpose: Purpose, context: string): string {
  const greeting = tone === 'formal' ? 'Dear' : 'Hi';
  const name = to.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const close = tone === 'formal' ? 'Kind regards,' : tone === 'friendly' ? 'Best,' : 'Regards,';

  const bodies: Record<Purpose, string> = {
    'follow-up': `I hope this message finds you well. I am writing to follow up on our previous discussion regarding ${context || 'the matter we discussed'}.\n\nI wanted to check in on the progress and see if there is anything I can assist with to move things forward. Please let me know if you need any additional information from my end.\n\nI look forward to hearing from you at your earliest convenience.`,
    'introduction': `My name is [Your Name], and I am reaching out to introduce myself and explore potential opportunities for collaboration regarding ${context || 'mutual interests'}.\n\nI believe there is significant value in connecting, as our goals appear well-aligned. I would welcome the opportunity to schedule a brief call to discuss further.\n\nWould you be available for a 30-minute call this week?`,
    'proposal': `I am writing to present a proposal that I believe will be of significant interest to you and your team.\n\nFollowing our recent discussions, I have developed a detailed plan addressing ${context || 'the requirements discussed'}. The proposal outlines clear objectives, timelines, and expected outcomes.\n\nI have attached the full proposal for your review and would appreciate your feedback at your earliest convenience.`,
    'complaint': `I am writing to bring to your attention an issue I have experienced regarding ${context || 'a recent service interaction'}.\n\nDespite my previous attempts to resolve this matter, the issue remains unresolved. I believe a swift resolution is in both our interests, and I trust that your team will address this promptly.\n\nI look forward to your response and a satisfactory resolution within the next 48 hours.`,
    'thank-you': `I wanted to take a moment to express my sincere gratitude for ${context || 'your continued support and assistance'}.\n\nYour dedication and professionalism have made a significant positive impact, and it has not gone unnoticed. It is a pleasure working with someone of your caliber.\n\nThank you once again for everything you do.`,
    'request': `I hope this email finds you well. I am writing to kindly request your assistance with ${context || 'an important matter'}.\n\nI understand you are busy, and I greatly appreciate your time. If possible, I would appreciate a response by [Date] so we can proceed accordingly.\n\nPlease do not hesitate to reach out if you need any additional information.`,
  };

  return `${greeting} ${name},\n\n${bodies[purpose]}\n\n${close}\n[Your Name]\n[Your Title] | [Your Company]\n[Your Phone] | [Your Email]`;
}

export default function EmailDrafter() {
  const [to, setTo] = useState('colleague@example.com');
  const [subject, setSubject] = useState('');
  const [tone, setTone] = useState<Tone>('formal');
  const [purpose, setPurpose] = useState<Purpose>('follow-up');
  const [context, setContext] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setDraft(generateEmail(to, subject, tone, purpose, context));
      setLoading(false);
    }, 1200);
  };

  const copy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(245,158,11,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✉️</div>
        <div>
          <div className="tool-page-title">Email Drafter</div>
          <div className="tool-page-desc">AI-powered professional email generator</div>
        </div>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">To (Recipient)</label>
            <input className="form-input" value={to} onChange={e => setTo(e.target.value)} placeholder="recipient@example.com" />
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject" />
          </div>

          <div className="form-group">
            <label className="form-label">Purpose</label>
            <select className="form-select" value={purpose} onChange={e => setPurpose(e.target.value as Purpose)}>
              <option value="follow-up">📩 Follow-up</option>
              <option value="introduction">👋 Introduction</option>
              <option value="proposal">📊 Proposal</option>
              <option value="complaint">😤 Complaint</option>
              <option value="thank-you">🙏 Thank You</option>
              <option value="request">🙋 Request</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tone</label>
            <div className="tab-bar">
              {(['formal', 'friendly', 'assertive', 'apologetic'] as Tone[]).map(t => (
                <button key={t} className={`tab-item${tone === t ? ' active' : ''}`} onClick={() => setTone(t)} style={{ fontSize: 12, textTransform: 'capitalize' }}>
                  {t === 'formal' ? '👔' : t === 'friendly' ? '😊' : t === 'assertive' ? '💪' : '🙏'} {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Context (optional)</label>
            <textarea className="form-textarea" value={context} onChange={e => setContext(e.target.value)}
              placeholder="Provide context: project name, specific details, deadlines…" rows={4} />
          </div>

          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><span className="spinner" /> Drafting…</> : '✨ Generate Email Draft'}
          </button>
        </div>

        <div>
          {draft ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <div className="section-title" style={{ margin: 0 }}>📧 Email Draft</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={copy}>
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>To: {to}</div>
                {subject && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Subject: {subject}</div>}
              </div>
              <div className="email-preview">{draft}</div>
            </motion.div>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>
                Fill in the details on the left and generate your perfect email
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

