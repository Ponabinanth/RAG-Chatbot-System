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
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            lineHeight: 1.5,
          }}>
            <span style={{ flexShrink: 0, fontSize: 14 }}>⚡</span>
            <div>
              <strong>Demo Mode</strong> — No Supabase credentials configured.
              Sign up or sign in with any email/password to explore all features locally.
            </div>
          </div>
        )}

        <div className="auth-logo-wrap">
          <div className="auth-logo-icon" style={{ fontSize: 28 }}>🧠</div>
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back!' : 'Join EduPro Hub'}
          </h1>
          <p className="auth-sub">
            {mode === 'login' ? 'Sign in to your EduPro account' : 'Create your free account today'}
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
              <div className="auth-error">⚠️ {error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google OAuth — only show if Supabase is configured */}
        {!isMockMode && (
          <>
            <button className="auth-google-btn" onClick={handleGoogle} type="button" style={{ marginBottom: 16 }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            <div className="auth-divider"><span>or</span></div>
          </>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: isMockMode ? 0 : 12 }}>
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label className="auth-label" htmlFor="displayName">Display Name</label>
                <input
                  id="displayName" type="text" value={name}
                  onChange={e => setName(e.target.value)}
                  className="auth-input" placeholder="Your name"
                  required={mode === 'signup'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input" placeholder="name@example.com"
              required autoComplete="email"
            />
          </div>

          <div>
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="auth-input" placeholder="Min. 6 characters" required
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
                <label className="auth-label" htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm" type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="auth-input" placeholder="••••••••"
                  required autoComplete="new-password"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading && <span className="spinner" />}
            {loading
              ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
              : (mode === 'login' ? '→ Sign In' : '→ Create Account')}
          </button>
        </form>

        <div className="auth-switch" style={{ marginTop: 20 }}>
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={switchMode}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={switchMode}>Sign in</button></>
          )}
        </div>

        {isMockMode && (
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.5 }}>
            🔒 All data is stored locally in your browser.
            <br/>Add Supabase credentials to enable cloud auth & sync.
          </p>
        )}
      </motion.div>
    </div>
  );
}

