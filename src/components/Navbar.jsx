import React from 'react';
import { Bell, ChevronDown, Plus } from 'lucide-react';

const Navbar = ({ onOpenForm, activePage, onPageChange }) => {
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

      <div className="flex items-center gap-4">
        {onOpenForm && (
          <button
            onClick={onOpenForm}
            className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Film Ekle
          </button>
        )}

        <div className="relative">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {String(Math.min(99, 8))}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <img
            src="https://i.pravatar.cc/40?img=47"
            alt="Sarah J"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
          />
          <div className="leading-none">
            <p className="text-sm font-semibold text-gray-800">Sarah J</p>
            <p className="text-xs text-gray-400 mt-0.5">Premium</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
