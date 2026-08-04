import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import { apiLogin, apiRegister } from './api';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await apiRegister(email, password);
        const data = await apiLogin(email, password);
        login(data.access_token);
      } else {
        const data = await apiLogin(email, password);
        login(data.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setPassword(''); setConfirm(''); };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="auth-card"
      >
        {/* Logo */}
        <div className="auth-logo-wrap">
          <div className="auth-logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3C8.477 3 4 7.477 4 13c0 2.136.67 4.116 1.806 5.737L4 24l5.557-1.74A9.953 9.953 0 0014 23c5.523 0 10-4.477 10-10S19.523 3 14 3z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="auth-sub">
            {mode === 'login' ? 'Sign in to your NovaMind account' : 'Start chatting with AI for free'}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 12 }}
            >
              <div className="auth-error">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" style={{flexShrink:0, marginTop:1}}>
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zM8 11a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label className="auth-label" htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading && <span className="spinner" />}
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Continue' : 'Create account')}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={switchMode}>Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={switchMode}>Sign in</button></>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 24 }}>
          By continuing, you agree to the Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
