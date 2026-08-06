import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, type UserRole, type Profile } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';
import { apiRegister, apiLogin, apiGetMe } from './api';

// ─── Mock Auth Types ──────────────────────────────────────────────────────────
interface MockUser {
  id: string;
  email: string;
}

const MOCK_STORAGE_KEY = 'edupro_mock_user';
const MOCK_PROFILE_KEY = 'edupro_mock_profile';

function loadMockUser(): MockUser | null {
  try { return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || 'null'); }
  catch { return null; }
}
function saveMockUser(u: MockUser | null) {
  if (u) localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(u));
  else localStorage.removeItem(MOCK_STORAGE_KEY);
}
function loadMockProfile(): Profile | null {
  try { return JSON.parse(localStorage.getItem(MOCK_PROFILE_KEY) || 'null'); }
  catch { return null; }
}
function saveMockProfile(p: Profile | null) {
  if (p) localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(p));
  else localStorage.removeItem(MOCK_PROFILE_KEY);
}

// Simple password storage (NOT production-safe — mock only)
function getMockAccounts(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('edupro_accounts') || '{}'); }
  catch { return {}; }
}
function saveMockAccounts(a: Record<string, string>) {
  localStorage.setItem('edupro_accounts', JSON.stringify(a));
}

// ─── Context Types ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | MockUser | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isMockMode: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateRole: (role: UserRole, displayName: string) => Promise<void>;
  // Legacy compat
  token: string | null;
  userEmail: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [legacyToken] = useState<string | null>(localStorage.getItem('token'));

  // ── Initialize auth ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // MOCK MODE: load from localStorage
      const mockUser = loadMockUser();
      const mockProfile = loadMockProfile();
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    // REAL SUPABASE MODE
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data as Profile);
    } catch { /* Profile may not exist yet */ }
  }

  // ── Mock auth methods ────────────────────────────────────────────────────
  async function mockSignUp(email: string, password: string, displayName: string) {
    await apiRegister(email, password);
    // Auto-login after registration
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.access_token);
    
    // Fetch user details
    const userData = await apiGetMe(data.access_token);
    const mockUser: MockUser = { id: userData.id.toString(), email: userData.email };
    saveMockUser(mockUser);
    setUser(mockUser);
    
    // Set default role if needed
    const p: Profile = {
      id: mockUser.id,
      role: 'student',
      display_name: displayName,
      created_at: new Date().toISOString(),
    };
    saveMockProfile(p);
    setProfile(p);
  }

  async function mockSignIn(email: string, password: string) {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.access_token);
    
    // Fetch user details
    const userData = await apiGetMe(data.access_token);
    const mockUser: MockUser = { id: userData.id.toString(), email: userData.email };
    saveMockUser(mockUser);
    setUser(mockUser);
    
    // Restore profile if exists
    const p = loadMockProfile();
    if (p) setProfile(p);
  }

  async function mockSignOut() {
    localStorage.removeItem('token');
    saveMockUser(null);
    setUser(null);
    setProfile(null);
  }

  async function mockUpdateRole(role: UserRole, displayName: string) {
    const u = loadMockUser();
    if (!u) throw new Error('Not authenticated');
    const p: Profile = {
      id: u.id,
      role,
      display_name: displayName,
      created_at: new Date().toISOString(),
    };
    saveMockProfile(p);
    setProfile(p);
  }

  // ── Real Supabase methods ────────────────────────────────────────────────
  async function realSignUp(email: string, password: string, displayName: string) {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw new Error(error.message);
  }

  async function realSignIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }

  async function realSignInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/onboarding' },
    });
    if (error) throw new Error(error.message);
  }

  async function realSignOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  async function realUpdateRole(role: UserRole, displayName: string) {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: (user as User).id, role, display_name: displayName })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setProfile(data as Profile);
  }

  // ── Exposed methods (route to mock or real) ──────────────────────────────
  const signUp = isSupabaseConfigured ? realSignUp : mockSignUp;
  const signIn = isSupabaseConfigured ? realSignIn : mockSignIn;
  const signInWithGoogle = isSupabaseConfigured
    ? realSignInWithGoogle
    : async () => { throw new Error('Google sign-in requires Supabase credentials. Please use email/password instead.'); };
  const signOut = isSupabaseConfigured ? realSignOut : mockSignOut;
  const updateRole = isSupabaseConfigured ? realUpdateRole : mockUpdateRole;

  // Legacy compat
  const login = (token: string) => localStorage.setItem('token', token);
  const logout = () => signOut();

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      isMockMode: !isSupabaseConfigured,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateRole,
      token: legacyToken,
      userEmail: (user as any)?.email ?? null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
