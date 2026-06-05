import React from 'react';

const LadybugIcon = ({ size = 28, color = '#1A1A24' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* ── Antennas ──────────────────────────────────────────── */}
    <path d="M 44 27 Q 36 14 29 5" stroke={color} strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <circle cx="28.5" cy="4" r="2.8" fill={color}/>

    <path d="M 56 27 Q 64 14 71 5" stroke={color} strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <circle cx="71.5" cy="4" r="2.8" fill={color}/>

    {/* ── Head ──────────────────────────────────────────────── */}
    <ellipse cx="50" cy="30" rx="20" ry="13" fill={color}/>

    {/* White collar separating head from body */}
    <path d="M 30 38 Q 50 34 70 38" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>

    {/* ── Body ──────────────────────────────────────────────── */}
    <circle cx="50" cy="74" r="36" fill={color}/>

    {/* ── Center divider: simple thin straight line ────────── */}
    <rect x="48.5" y="40" width="3" height="66" rx="1.5" fill="white"/>

    {/* ── 4 Spots — all in lower half ───────────────────────── */}
    <circle cx="34"   cy="70" r="10.5" fill="white"/>
    <circle cx="66"   cy="70" r="10.5" fill="white"/>
    <circle cx="34"   cy="90" r="10.5" fill="white"/>
    <circle cx="66"   cy="90" r="10.5" fill="white"/>

    {/* ── Leg stubs — 3 each side ───────────────────────────── */}
    {/* Left */}
    <line x1="14" y1="65" x2="22" y2="69" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
    <line x1="13" y1="76" x2="21" y2="78" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
    <line x1="14" y1="87" x2="22" y2="84" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
    {/* Right */}
    <line x1="86" y1="65" x2="78" y2="69" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
    <line x1="87" y1="76" x2="79" y2="78" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
    <line x1="86" y1="87" x2="78" y2="84" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>
  </svg>
);

export default LadybugIcon;
