import React, { useState, useMemo } from 'react';
import {
  Flame, Zap, Smile, BookOpen, Ghost, Heart,
  Rocket, Sparkles, AlertTriangle, FileText, Compass,
  SlidersHorizontal, ListFilter
} from 'lucide-react';
import FilmCard from './FilmCard';

const GENRE_ICONS = {
  Trending:     <Flame className="w-4 h-4" />,
  Action:       <Zap className="w-4 h-4" />,
  Comedy:       <Smile className="w-4 h-4" />,
  Drama:        <BookOpen className="w-4 h-4" />,
  Horror:       <Ghost className="w-4 h-4" />,
  Romance:      <Heart className="w-4 h-4" />,
  'Sci-Fi':     <Rocket className="w-4 h-4" />,
  Animation:    <Sparkles className="w-4 h-4" />,
  Thriller:     <AlertTriangle className="w-4 h-4" />,
  Documentary:  <FileText className="w-4 h-4" />,
  Adventure:    <Compass className="w-4 h-4" />,
};

const FilmList = ({ movies, onWatched, onDelete, onEdit, onRate, onFavorite }) => {
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [filter, setFilter] = useState('all');

  const categories = useMemo(() => {
    const genres = [...new Set(movies.map(m => m.genre))].sort();
    return ['Trending', ...genres];
  }, [movies]);

  const resolvedCategory = categories.includes(activeCategory) ? activeCategory : 'Trending';

  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      const matchesCategory = resolvedCategory === 'Trending' || m.genre === resolvedCategory;
      const matchesWatch =
        filter === 'all' ||
        (filter === 'watched' && m.watched) ||
        (filter === 'unwatched' && !m.watched);
      return matchesCategory && matchesWatch;
    });
  }, [movies, resolvedCategory, filter]);

  return (
    <div>
      <div className="flex gap-3 px-8 pb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {categories.map(name => (
          <button
            key={name}
            onClick={() => setActiveCategory(name)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
              resolvedCategory === name
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {GENRE_ICONS[name] ?? <Sparkles className="w-4 h-4" />}
            {name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-8 mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          {resolvedCategory === 'Trending' ? 'Tüm Filmler' : `${resolvedCategory} Filmleri`}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter(f => f === 'unwatched' ? 'all' : 'unwatched')}
            title="İzlenmeyenler"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              filter === 'unwatched' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFilter(f => f === 'watched' ? 'all' : 'watched')}
            title="İzlenenler"
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
              onRate={onRate}
              onFavorite={onFavorite}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <p className="text-sm text-gray-400">Bu kategoride film bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmList;
