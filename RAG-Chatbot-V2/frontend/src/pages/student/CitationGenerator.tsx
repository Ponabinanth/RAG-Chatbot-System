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
