import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import LadybugIcon from '../components/LadybugIcon';
import { loginUser, storeUser } from '../lib/auth';

/* ── Reusable field ─────────────────────────────────────────────────── */
const Field = ({ label, icon, type, value, onChange, placeholder, required, rightSlot }) => (
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
  </div>
);

/* ── Login ──────────────────────────────────────────────────────────── */
const Login = ({ onLogin, onGoSignUp }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await loginUser(email, password);
      storeUser(user);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm animate-fadeIn">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <LadybugIcon size={32} color="#1A1A24" />
          <span className="text-2xl font-black tracking-tight" style={{ color: '#1A1A24' }}>MOVIFY</span>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.65)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A24' }}>Welcome back</h2>
          <p className="text-sm mb-7 text-gray-400">Sign in to continue watching</p>

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
              label="Email"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Field
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="transition-opacity hover:opacity-70"
                  style={{ color: '#9C8181' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 mt-2 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-40"
              style={{ backgroundColor: '#9C8181' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Switch to sign up */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onGoSignUp}
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#9C8181' }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
