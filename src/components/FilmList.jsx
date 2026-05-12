import React, { useState, useMemo } from 'react';
import { Flame, Zap, Heart, Sparkles, Ghost, Star, Moon, SlidersHorizontal, ListFilter } from 'lucide-react';
import FilmCard from './FilmCard';

const CATEGORIES = [
  { name: 'Trending', icon: <Flame className="w-4 h-4" /> },
  { name: 'Action',   icon: <Zap className="w-4 h-4" /> },
  { name: 'Romance',  icon: <Heart className="w-4 h-4" /> },
  { name: 'Animation',icon: <Sparkles className="w-4 h-4" /> },
  { name: 'Horror',   icon: <Ghost className="w-4 h-4" /> },
  { name: 'Special',  icon: <Star className="w-4 h-4" /> },
  { name: 'Drakor',   icon: <Moon className="w-4 h-4" /> },
];

const FilmList = ({ movies, onWatched, onDelete, onEdit }) => {
  const [activeCategory, setActiveCategory] = useState('Animation');
  const [filter, setFilter] = useState('all');

  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      if (filter === 'watched') return m.watched;
      if (filter === 'unwatched') return !m.watched;
      return true;
    });
  }, [movies, filter]);

  return (
    <div>
      <div className="flex gap-3 px-8 pb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
              activeCategory === cat.name
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-8 mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Trending in {activeCategory}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter(f => f === 'unwatched' ? 'all' : 'unwatched')}
            title="Unwatched only"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              filter === 'unwatched' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFilter(f => f === 'watched' ? 'all' : 'watched')}
            title="Watched only"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              filter === 'watched' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <ListFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-5 px-8 pb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <FilmCard
              key={movie.id}
              movie={movie}
              onWatched={onWatched}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center py-12 text-gray-400">
            <p className="text-sm font-medium">No movies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmList;
