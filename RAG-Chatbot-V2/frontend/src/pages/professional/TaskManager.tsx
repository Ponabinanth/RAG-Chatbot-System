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
