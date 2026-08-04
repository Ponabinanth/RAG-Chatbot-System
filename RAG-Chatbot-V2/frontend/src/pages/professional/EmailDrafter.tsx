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
