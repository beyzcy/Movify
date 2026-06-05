import { supabase } from './supabase';

const SESSION_KEY = 'movify_session';

/* ── PBKDF2 helpers (Web Crypto API — no external deps) ─────────────── */

const enc = new TextEncoder();

const pbkdf2 = async (password, salt) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
};

const toB64 = (buf) => btoa(String.fromCharCode(...buf));
const fromB64 = (str) => Uint8Array.from(atob(str), c => c.charCodeAt(0));

export const hashPassword = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt);
  return `${toB64(salt)}:${toB64(hash)}`;
};

export const verifyPassword = async (password, stored) => {
  const parts = stored?.split(':');
  if (!parts || parts.length !== 2) return false;
  const [saltB64, hashB64] = parts;
  const salt = fromB64(saltB64);
  const hash = await pbkdf2(password, salt);
  return toB64(hash) === hashB64;
};

/* ── Session helpers ────────────────────────────────────────────────── */

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeUser  = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
export const clearUser  = () => localStorage.removeItem(SESSION_KEY);

/* ── Auth service ───────────────────────────────────────────────────── */

export const loginUser = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, username, email, hashed_password')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !data) throw new Error('Invalid email or password');

  const match = await verifyPassword(password, data.hashed_password);
  if (!match) throw new Error('Invalid email or password');

  const { hashed_password: _pw, ...user } = data;
  return user; // { user_id, username, email }
};

export const signUpUser = async (username, email, password) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check duplicate email
  const { data: existing } = await supabase
    .from('users')
    .select('user_id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) throw new Error('This email is already registered');

  const hashed_password = await hashPassword(password);

  const { data, error } = await supabase
    .from('users')
    .insert({ username: username.trim(), email: normalizedEmail, hashed_password })
    .select('user_id, username, email')
    .single();

  if (error) throw new Error(error.message);
  return data;
};
