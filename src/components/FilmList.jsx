import React, { useState, useMemo } from 'react';
import {
  Flame, Zap, Smile, BookOpen, Ghost, Heart,
  Rocket, Sparkles, AlertTriangle, FileText, Compass,
  Swords, Wand2, HelpCircle, Sword, SlidersHorizontal, ListFilter
} from 'lucide-react';
import FilmCard from './FilmCard';

const GENRE_ICONS = {
  All:          <Flame className="w-4 h-4" />,
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
  Crime:        <Swords className="w-4 h-4" />,
  Fantasy:      <Wand2 className="w-4 h-4" />,
  Mystery:      <HelpCircle className="w-4 h-4" />,
  War:          <Sword className="w-4 h-4" />,
};

const FilmList = ({ movies, onWatched, onRate, onFavorite, onMovieSelect, onOpenListModal }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filter, setFilter] = useState('all');

  const categories = useMemo(() => {
    const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))].sort();
    return ['All', ...genres];
  }, [movies]);

  const resolvedCategory = categories.includes(activeCategory) ? activeCategory : 'All';

  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      const matchesCategory = resolvedCategory === 'All' || m.genre === resolvedCategory;
      const matchesWatch =
        filter === 'all' ||
        (filter === 'watched'   && m.watched) ||
        (filter === 'unwatched' && !m.watched);
      return matchesCategory && matchesWatch;
    });
  }, [movies, resolvedCategory, filter]);

  return (
    <div className="pt-2">
      {/* ── Category tabs ─────────────────────────────────────────── */}
      <div className="flex gap-2 px-6 lg:px-10 pb-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {categories.map(name => {
          const isActive = resolvedCategory === name;
          return (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-200 flex-shrink-0"
              style={isActive
                ? { backgroundColor: '#9C8181', color: '#fff', boxShadow: '0 1px 4px rgba(156,129,129,0.35)' }
                : { backgroundColor: 'rgba(255,255,255,0.65)', color: '#1A1A24' }}
            >
              {GENRE_ICONS[name] ?? <Sparkles className="w-4 h-4" />}
              {name}
            </button>
          );
        })}
      </div>

      {/* ── Header + filter buttons ───────────────────────────────── */}
      <div className="flex items-center justify-between px-6 lg:px-10 mb-5">
        <h2 className="text-lg font-bold" style={{ color: '#1A1A24' }}>
          {resolvedCategory === 'All' ? 'All Films' : resolvedCategory}
          <span className="ml-2 text-sm font-normal text-gray-400">({filteredMovies.length})</span>
        </h2>

        <div className="flex gap-2">
          {/* Unwatched filter */}
          <button
            onClick={() => setFilter(f => f === 'unwatched' ? 'all' : 'unwatched')}
            title="Unwatched only"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={filter === 'unwatched'
              ? { backgroundColor: '#819C9C', color: '#fff' }
              : { backgroundColor: 'rgba(255,255,255,0.7)', color: '#1A1A24' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Watched filter */}
          <button
            onClick={() => setFilter(f => f === 'watched' ? 'all' : 'watched')}
            title="Watched only"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={filter === 'watched'
              ? { backgroundColor: '#819C81', color: '#fff' }
              : { backgroundColor: 'rgba(255,255,255,0.7)', color: '#1A1A24' }}
          >
            <ListFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Cards ─────────────────────────────────────────────────── */}
      <div className="flex gap-5 px-6 lg:px-10 pb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <FilmCard
              key={movie.movie_id}
              movie={movie}
              onWatched={onWatched}
              onRate={onRate}
              onFavorite={onFavorite}
              onMovieSelect={onMovieSelect}
              onOpenListModal={onOpenListModal}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center py-16">
            <p className="text-sm" style={{ color: '#9C8181' }}>No films in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmList;
