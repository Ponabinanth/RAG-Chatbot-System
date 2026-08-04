import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'todo' | 'in-progress' | 'done';
type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  due?: string;
}

const COLUMNS: { id: Status; label: string; emoji: string; color: string }[] = [
  { id: 'todo', label: 'To Do', emoji: '📋', color: '#94a3b8' },
  { id: 'in-progress', label: 'In Progress', emoji: '⚡', color: '#f59e0b' },
  { id: 'done', label: 'Done', emoji: '✅', color: '#10b981' },
];

const INIT: Task[] = [
  { id: '1', title: 'Review Q3 roadmap', status: 'todo', priority: 'high', due: '2026-08-10' },
  { id: '2', title: 'Prepare client presentation', status: 'in-progress', priority: 'high', due: '2026-08-08' },
  { id: '3', title: 'Update team documentation', status: 'todo', priority: 'medium' },
  { id: '4', title: 'Weekly standup notes', status: 'done', priority: 'low' },
];

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' as Priority, due: '' });

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      status: 'todo',
      priority: newTask.priority,
      due: newTask.due || undefined,
    }]);
    setNewTask({ title: '', priority: 'medium', due: '' });
    setShowAdd(false);
  };

  const moveTask = (id: string, status: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const priorityColors: Record<Priority, string> = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' };

  return (
    <div className="animate-fade-in">
      <div className="tool-page-header">
        <div style={{ background: 'rgba(139,92,246,0.1)', width: 52, height: 52, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📋</div>
        <div>
          <div className="tool-page-title">Task Manager</div>
          <div className="tool-page-desc">Visualize and manage your work with Kanban</div>
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(s => !s)}>
          + Add Task
        </button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 24 }}
          >
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'end' }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input className="form-input" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                  placeholder="What needs to be done?" onKeyDown={e => e.key === 'Enter' && addTask()} />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value as Priority }))}>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} />
              </div>
              <button className="btn btn-primary" onClick={addTask}>Add</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban Board */}
      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="kanban-col">
              <div className="kanban-col-title" style={{ color: col.color }}>
                {col.emoji} {col.label}
                <span className="kanban-col-count">{colTasks.length}</span>
              </div>
              <AnimatePresence>
                {colTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="kanban-item"
                  >
                    <div className="kanban-item-title">{task.title}</div>
                    <div className="kanban-item-meta">
                      <span className={`priority-badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                      {task.due && <span>📅 {new Date(task.due).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                    {/* Move Buttons */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      {COLUMNS.filter(c => c.id !== col.id).map(c => (
                        <button key={c.id} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '3px 8px', color: c.color }}
                          onClick={() => moveTask(task.id, c.id)}>
                          → {c.label}
                        </button>
                      ))}
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}
                        onClick={() => deleteTask(task.id)}>✕</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && (
                <div className="empty-state" style={{ padding: '24px 12px' }}>
                  <div style={{ fontSize: 24 }}>📭</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>No tasks</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="dashboard-stats" style={{ marginTop: 24 }}>
        {COLUMNS.map(col => (
          <div key={col.id} className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">{col.label}</div>
            <div className="stat-value" style={{ color: col.color }}>{tasks.filter(t => t.status === col.id).length}</div>
          </div>
        ))}
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-label">Total</div>
          <div className="stat-value">{tasks.length}</div>
        </div>
      </div>
    </div>
  );
}

