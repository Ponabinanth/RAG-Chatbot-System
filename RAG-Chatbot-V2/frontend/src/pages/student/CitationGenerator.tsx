import { useState } from 'react';

type Style = 'APA' | 'MLA' | 'Chicago';

interface CitationForm {
  type: 'book' | 'website' | 'journal';
  author: string;
  title: string;
  year: string;
  publisher: string;
  url: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
}

function generateCitation(form: CitationForm, style: Style): string {
  const { author, title, year, publisher, url, journal, volume, issue, pages } = form;
  const authorLast = author.includes(',') ? author : author.split(' ').reverse().join(', ');

  if (style === 'APA') {
    if (form.type === 'book') return `${authorLast} (${year}). *${title}*. ${publisher}.`;
    if (form.type === 'website') return `${authorLast} (${year}). ${title}. Retrieved from ${url}`;
    return `${authorLast} (${year}). ${title}. *${journal}*, *${volume}*(${issue}), ${pages}.`;
  }
  if (style === 'MLA') {
    if (form.type === 'book') return `${author}. *${title}*. ${publisher}, ${year}.`;
    if (form.type === 'website') return `${author}. "${title}." *Web*, ${year}, ${url}.`;
    return `${author}. "${title}." *${journal}* ${volume}.${issue} (${year}): ${pages}.`;
  }
  // Chicago
  if (form.type === 'book') return `${author}. *${title}*. ${publisher}, ${year}.`;
  if (form.type === 'website') return `${author}. "${title}." Accessed ${new Date().toLocaleDateString()}. ${url}.`;
  return `${author}. "${title}." *${journal}* ${volume}, no. ${issue} (${year}): ${pages}.`;
}

export default function CitationGenerator() {
  const [style, setStyle] = useState<Style>('APA');
  const [form, setForm] = useState<CitationForm>({
    type: 'book', author: 'Smith, John', title: 'Introduction to Science', year: '2023',
    publisher: 'Academic Press', url: '', journal: '', volume: '', issue: '', pages: '',
  });
  const [copied, setCopied] = useState(false);

  const update = (k: keyof CitationForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const citation = generateCitation(form, style);

  const copy = () => {
    navigator.clipboard.writeText(citation.replace(/\*/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(245,158,11,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📖</div>
        <div>
          <div className="tool-page-title">Citation Generator</div>
          <div className="tool-page-desc">Generate APA, MLA, and Chicago citations instantly</div>
        </div>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Style Selector */}
          <div className="tab-bar">
            {(['APA', 'MLA', 'Chicago'] as Style[]).map(s => (
              <button key={s} className={`tab-item${style === s ? ' active' : ''}`} onClick={() => setStyle(s)}>{s}</button>
            ))}
          </div>

          {/* Source Type */}
          <div className="form-group">
            <label className="form-label">Source Type</label>
            <select className="form-select" value={form.type} onChange={e => update('type', e.target.value as any)}>
              <option value="book">📚 Book</option>
              <option value="website">🌐 Website</option>
              <option value="journal">📄 Journal Article</option>
            </select>
          </div>

          {/* Fields */}
          {[
            { key: 'author', label: 'Author(s)', placeholder: 'Last, First (or First Last)' },
            { key: 'title', label: 'Title', placeholder: 'Title of the work' },
            { key: 'year', label: 'Year', placeholder: '2023' },
