import React, { useRef, useState, useEffect } from 'react';

const COLORS = ['#000000', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#6c63ff', '#ec4899', '#ffffff', '#94a3b8'];
const SIZES = [2, 6, 12, 20];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#6c63ff');
  const [size, setSize] = useState(6);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { setDrawing(false); lastPos.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(236,72,153,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎨</div>
        <div>
          <div className="tool-page-title">Drawing Canvas</div>
          <div className="tool-page-desc">Express yourself with colors and creativity!</div>
        </div>
      </div>

      <div className="canvas-wrap">
        {/* Toolbar */}
        <div className="canvas-tools">
          {/* Colors */}
          {COLORS.map(c => (
            <div
              key={c}
              className={`color-swatch${color === c && tool === 'pen' ? ' active' : ''}`}
              style={{ background: c, border: c === '#ffffff' ? '2px solid var(--border-default)' : '3px solid transparent' }}
              onClick={() => { setColor(c); setTool('pen'); }}
            />
          ))}

          <div style={{ width: 1, height: 32, background: 'var(--border-subtle)', margin: '0 4px' }} />

          {/* Brush Sizes */}
          {SIZES.map(s => (
            <div
              key={s}
              onClick={() => setSize(s)}
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                border: `2px solid ${size === s ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                background: size === s ? 'var(--role-student-light)' : 'transparent',
              }}
            >
              <div style={{ width: s, height: s, borderRadius: '50%', background: color }} />
            </div>
          ))}

          <div style={{ width: 1, height: 32, background: 'var(--border-subtle)', margin: '0 4px' }} />

          {/* Tools */}
          <button className={`btn btn-sm ${tool === 'pen' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTool('pen')}>✏️ Pen</button>
          <button className={`btn btn-sm ${tool === 'eraser' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTool('eraser')}>⬜ Eraser</button>
          <button className="btn btn-secondary btn-sm" onClick={clearCanvas}>🗑️ Clear</button>
          <button className="btn btn-primary btn-sm" onClick={saveCanvas}>💾 Save</button>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="canvas-el"
          width={800}
          height={500}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{ touchAction: 'none' }}
        />
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          🖱️ Click and drag to draw · Use touch on mobile
        </div>
      </div>
    </div>
  );
}

