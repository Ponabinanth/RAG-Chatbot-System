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
                <input className="form-input" value={client} onChange={e => setClient(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <input className="form-input" type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} min="0" max="100" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <div className="section-title" style={{ margin: 0 }}>📋 Line Items</div>
              <button className="btn btn-secondary btn-sm" onClick={addItem}>+ Add Row</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Description', 'Qty/Hrs', 'Rate', 'Total', ''].map(h => (
                    <th key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const lineTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
                  return (
                    <tr key={i}>
                      <td style={{ padding: '8px 4px' }}>
                        <input className="form-input" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description" style={{ fontSize: 13, padding: '6px 8px' }} />
                      </td>
                      <td style={{ padding: '8px 4px', width: 70 }}>
                        <input className="form-input" type="number" value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} style={{ fontSize: 13, padding: '6px 8px', width: 70 }} />
                      </td>
                      <td style={{ padding: '8px 4px', width: 90 }}>
                        <input className="form-input" type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} style={{ fontSize: 13, padding: '6px 8px', width: 90 }} />
                      </td>
                      <td style={{ padding: '8px 4px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(lineTotal)}</td>
                      <td style={{ padding: '8px 4px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => removeItem(i)} style={{ color: 'var(--text-muted)', padding: '4px 8px' }}>✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div>
          <div className="card" style={{ background: 'white', color: '#111', padding: 32 }}>
