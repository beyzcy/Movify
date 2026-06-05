import React, { useState } from 'react';
import { Search, LogOut } from 'lucide-react';
import LadybugIcon from './LadybugIcon';

const Navbar = ({ activePage, onPageChange, currentUser, onLogout }) => {
  const [showLogout, setShowLogout] = useState(false);

  const tabBase = 'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200';
  const active  = `${tabBase} text-white shadow-sm`;
  const inactive = `${tabBase} hover:opacity-75`;

  const initials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className="flex items-center justify-between px-8 py-5">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <LadybugIcon size={30} color="#1A1A24" />
        <h1 className="text-[1.4rem] font-black tracking-tight" style={{ color: '#1A1A24' }}>
          MOVIFY
        </h1>
      </div>

      {/* Nav tabs */}
      <div
        className="flex items-center rounded-full px-1.5 py-1.5 gap-0.5 shadow-sm"
        style={{ backgroundColor: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => onPageChange('home')}
          className={activePage === 'home' ? active : inactive}
          style={activePage === 'home' ? { backgroundColor: '#9C8181', color: '#fff' } : { color: '#1A1A24' }}
        >
          Home
        </button>

        <button
          onClick={() => onPageChange('search')}
          className={`flex items-center gap-1.5 ${activePage === 'search' ? active : inactive}`}
          style={activePage === 'search' ? { backgroundColor: '#9C8181', color: '#fff' } : { color: '#1A1A24' }}
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>

        <button
          onClick={() => onPageChange('profile')}
          className={activePage === 'profile' ? active : inactive}
          style={activePage === 'profile' ? { backgroundColor: '#9C8181', color: '#fff' } : { color: '#1A1A24' }}
        >
          Profile
        </button>
      </div>

      {/* User + logout */}
      <div className="relative">
        <button
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setShowLogout(p => !p)}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1A1A24' }}
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="leading-none hidden sm:block">
            <p className="text-sm font-semibold" style={{ color: '#1A1A24' }}>
              {currentUser?.username ?? 'User'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{currentUser?.email ?? ''}</p>
          </div>
        </button>

        {/* Dropdown */}
        {showLogout && (
          <div
            className="absolute right-0 top-full mt-2 rounded-2xl shadow-lg overflow-hidden z-50 min-w-[160px] animate-fadeIn"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(156,129,129,0.15)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(156,129,129,0.1)' }}>
              <p className="text-xs font-semibold" style={{ color: '#1A1A24' }}>{currentUser?.username}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">{currentUser?.email}</p>
            </div>
            <button
              onClick={() => { setShowLogout(false); onLogout(); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors text-left"
              style={{ color: '#c0605a' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(192,96,90,0.08)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
