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
            ...(form.type === 'book' ? [{ key: 'publisher', label: 'Publisher', placeholder: 'Publisher name' }] : []),
            ...(form.type === 'website' ? [{ key: 'url', label: 'URL', placeholder: 'https://...' }] : []),
            ...(form.type === 'journal' ? [
              { key: 'journal', label: 'Journal Name', placeholder: 'Journal of Science' },
              { key: 'volume', label: 'Volume', placeholder: '12' },
              { key: 'issue', label: 'Issue', placeholder: '3' },
              { key: 'pages', label: 'Pages', placeholder: '45–67' },
            ] : []),
          ].map(({ key, label, placeholder }) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input className="form-input" value={(form as any)[key]} onChange={e => update(key as any, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div className="section-title" style={{ margin: 0 }}>Generated Citation</div>
              <span className="badge badge-student">{style}</span>
            </div>
            <div className="citation-output">
              {citation.replace(/\*/g, '')}
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={copy}>
              {copied ? '✓ Copied!' : '📋 Copy Citation'}
            </button>
          </div>

          <div className="card" style={{ background: 'rgba(108,99,255,0.05)', borderColor: 'rgba(108,99,255,0.15)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>💡 Citation Tips:</strong>
              <br />• APA: Used in psychology, social sciences
              <br />• MLA: Used in humanities, literature
              <br />• Chicago: Used in history, fine arts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

