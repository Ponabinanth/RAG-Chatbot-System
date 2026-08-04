import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, isMockMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name.trim());
        navigate('/onboarding');
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirm('');
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="auth-card"
      >
        {/* Mock Mode Banner */}
        {isMockMode && (
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: 12,
