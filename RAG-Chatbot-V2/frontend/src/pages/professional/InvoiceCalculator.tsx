import { useState } from 'react';
import { motion } from 'framer-motion';

interface LineItem { description: string; qty: string; rate: string; }

export default function InvoiceCalculator() {
  const [client, setClient] = useState('Acme Corporation');
  const [invoiceNo, setInvoiceNo] = useState(`INV-${new Date().getFullYear()}-001`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('10');
  const [items, setItems] = useState<LineItem[]>([
    { description: 'Web Development', qty: '40', rate: '75' },
    { description: 'UI/UX Design', qty: '20', rate: '65' },
  ]);
  const [notes, setNotes] = useState('Payment due within 30 days. Thank you for your business!');


  const addItem = () => setItems(prev => [...prev, { description: '', qty: '1', rate: '0' }]);
  const updateItem = (i: number, k: keyof LineItem, v: string) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);
  const tax = subtotal * (parseFloat(taxRate) / 100 || 0);
  const total = subtotal + tax;

  const fmt = (n: number) => new Intl.NumberFormat('en', { style: 'currency', currency }).format(n);

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(239,68,68,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💰</div>
        <div>
          <div className="tool-page-title">Invoice Calculator</div>
          <div className="tool-page-desc">Build professional invoices and compute totals instantly</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
            <option value="INR">🇮🇳 INR</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
        </div>
      </div>

      <div className="grid-2">
        {/* Invoice Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-title mb-4">📄 Invoice Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Invoice #</label>
                <input className="form-input" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Client Name</label>
