import React from 'react';
import { Search } from 'lucide-react';

const Navbar = ({ activePage, onPageChange }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Movify</h1>

      <div className="flex items-center bg-gray-100 rounded-full px-2 py-2 gap-1">
        <button
          onClick={() => onPageChange('home')}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
            activePage === 'home'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ana Sayfa
        </button>
        <button
          onClick={() => onPageChange('search')}
          className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
            activePage === 'search'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Ara
        </button>
        <button
          onClick={() => onPageChange('profile')}
          className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
            activePage === 'profile'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Profilim
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center ring-2 ring-gray-200 flex-shrink-0">
            <span className="text-white text-sm font-bold">BC</span>
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold text-gray-800">Beyza C</p>
            <p className="text-xs text-gray-400 mt-0.5">Premium</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
