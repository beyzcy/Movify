import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import LadybugIcon from '../components/LadybugIcon';
import { signUpUser, storeUser } from '../lib/auth';

/* ── Reusable field ─────────────────────────────────────────────────── */
const Field = ({ label, icon, type, value, onChange, placeholder, required, rightSlot, hint }) => (
  <div>
    <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9C8181' }}>
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9C8181' }}>
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-10 py-3 rounded-xl text-sm focus:outline-none transition-all"
        style={{
          paddingRight: rightSlot ? '2.75rem' : '1rem',
          backgroundColor: '#EDE8E8',
          border: '1.5px solid rgba(156,129,129,0.2)',
          color: '#1A1A24',
        }}
        onFocus={e => e.target.style.borderColor = '#9C8181'}
        onBlur={e => e.target.style.borderColor = 'rgba(156,129,129,0.2)'}
      />
      {rightSlot && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
      )}
    </div>
    {hint && <p className="text-xs mt-1 text-gray-400">{hint}</p>}
  </div>
);

/* ── Password strength bar ──────────────────────────────────────────── */
const strengthLevel = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#c0605a', '#b08850', '#819C81', '#819C81'];

const PasswordStrength = ({ password }) => {
  const level = strengthLevel(password);
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= level ? strengthColor[level] : 'rgba(156,129,129,0.2)' }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: strengthColor[level] }}>{strengthLabel[level]}</p>
    </div>
  );
};

/* ── Sign Up ────────────────────────────────────────────────────────── */
const SignUp = ({ onLogin, onGoLogin }) => {
  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const passwordsMatch = confirm.length > 0 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    setError('');
    try {
      const user = await signUpUser(username, email, password);
      storeUser(user);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4 py-10">
      <div className="w-full max-w-sm animate-fadeIn">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <LadybugIcon size={32} color="#1A1A24" />
          <span className="text-2xl font-black tracking-tight" style={{ color: '#1A1A24' }}>MOVIFY</span>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.65)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A24' }}>Create account</h2>
          <p className="text-sm mb-7 text-gray-400">Track every film you watch</p>

          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: 'rgba(192,96,90,0.1)', color: '#c0605a' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Username"
              icon={<User className="w-4 h-4" />}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="cinephile42"
              required
            />

            <Field
              label="Email"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {/* Password with strength */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9C8181' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9C8181' }}>
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={{
                    backgroundColor: '#EDE8E8',
                    border: '1.5px solid rgba(156,129,129,0.2)',
                    color: '#1A1A24',
                  }}
                  onFocus={e => e.target.style.borderColor = '#9C8181'}
                  onBlur={e => e.target.style.borderColor = 'rgba(156,129,129,0.2)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: '#9C8181' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9C8181' }}>
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9C8181' }}>
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={{
                    backgroundColor: '#EDE8E8',
                    border: `1.5px solid ${confirm.length > 0 ? (passwordsMatch ? '#819C81' : '#c0605a') : 'rgba(156,129,129,0.2)'}`,
                    color: '#1A1A24',
                  }}
                  onFocus={e => { if (!confirm.length) e.target.style.borderColor = '#9C8181'; }}
                  onBlur={e => { if (!confirm.length) e.target.style.borderColor = 'rgba(156,129,129,0.2)'; }}
                />
                {passwordsMatch && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#819C81' }} />
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !email || !password || !confirm}
              className="w-full py-3 mt-2 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-40"
              style={{ backgroundColor: '#9C8181' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Switch to login */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onGoLogin}
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#9C8181' }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
