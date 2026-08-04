import { useState } from 'react';
import { motion } from 'framer-motion';

const SAMPLE_NOTES = `Attendees: Sarah (PM), John (Dev), Maria (Design), Tom (Marketing)
Date: Monday 10am

Agenda:
- Q3 roadmap review
- New feature prioritization
- Budget allocation
- Launch timeline

Discussion:
- Sarah presented Q3 goals: launch mobile app, increase DAU by 30%
- John confirmed backend is ready, needs 2 more weeks for testing
- Maria showed new UI mockups, team agreed on direction
- Tom wants to delay launch by 1 week for marketing campaign prep

Decisions:
- Launch date set for September 15th
- Budget approved: $50k for marketing
- John to finish testing by August 30th
- Maria to deliver final assets by September 1st

Action Items:
- John: Complete backend testing by Aug 30
- Maria: Finalize assets by Sep 1
- Tom: Prepare marketing materials by Sep 8
- Sarah: Send launch checklist to all by end of week`;

function summarize(notes: string): string {
  const lines = notes.split('\n').filter(l => l.trim());
  const decisions = lines.filter(l => l.includes('decided') || l.includes('agreed') || l.includes('set') || l.includes('approved'));
  const actions = lines.filter(l => l.includes(':') && (l.includes('to ') || l.includes('will ')));

  return `## 📋 Meeting Summary

**Date Processed:** ${new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

---

### 🎯 Key Outcomes
${decisions.slice(0, 4).map(d => `• ${d.trim()}`).join('\n') || '• Meeting notes processed successfully'}
