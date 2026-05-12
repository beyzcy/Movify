import React from 'react';
import { Search, Bell, ChevronDown, Plus } from 'lucide-react';

const Navbar = ({ onOpenForm }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Flix.id</h1>

      <div className="flex items-center bg-gray-900 rounded-full px-2 py-2 gap-1">
        <button className="bg-white text-gray-900 px-5 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          Movie
        </button>
        <button className="text-gray-400 px-5 py-1.5 rounded-full text-sm font-medium hover:text-white transition-colors">
          Series
        </button>
        <button className="text-gray-400 px-5 py-1.5 rounded-full text-sm font-medium hover:text-white transition-colors">
          Originals
        </button>
        <button className="text-gray-400 px-3 py-1.5 rounded-full hover:text-white transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onOpenForm}
          className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Movie
        </button>

        <div className="relative">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            8
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
