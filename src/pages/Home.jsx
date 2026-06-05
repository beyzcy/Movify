import React, { useMemo } from 'react';
import { Flame, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import FilmList from '../components/FilmList';

/* ── Trending ──────────────────────────────────────────────────────── */
const TrendingSection = ({ movies, onMovieSelect }) => {
  const trending = useMemo(
    () => [...movies]
      .filter(m => m.average_rating)
      .sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0))
      .slice(0, 12),
    [movies]
  );

  if (trending.length === 0) return null;

  return (
    <div className="px-6 lg:px-10 pb-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-bold" style={{ color: '#1A1A24' }}>Trending</h2>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', color: '#9C8181' }}
        >
          Top Rated
        </span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
        {trending.map((movie, index) => (
          <button
            key={movie.movie_id}
            onClick={() => onMovieSelect?.(movie.movie_id)}
            className="flex-shrink-0 text-left group"
            style={{ width: 124 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ height: 178 }}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.src = 'https://placehold.co/124x178?text=?'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <span
                className="absolute bottom-2 left-3 text-white font-black leading-none drop-shadow-lg"
                style={{ fontSize: '2rem' }}
              >
                {index + 1}
              </span>

              {movie.average_rating && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-lg">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-white text-xs font-bold">{movie.average_rating}</span>
                </div>
              )}
            </div>

            <p className="text-xs font-semibold mt-2 truncate" style={{ color: '#1A1A24' }}>{movie.title}</p>
            <p className="text-xs text-gray-400">{movie.release_year}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Home ──────────────────────────────────────────────────────────── */
const Home = ({ movies, onWatched, onRate, onFavorite, onMovieSelect, onOpenListModal, activePage, onPageChange, currentUser, onLogout }) => {
  return (
    <div className="page-bg">
      <div className="max-w-6xl mx-auto">
        <Navbar activePage={activePage} onPageChange={onPageChange} currentUser={currentUser} onLogout={onLogout} />

        <div className="pt-2 pb-12">
          <TrendingSection movies={movies} onMovieSelect={onMovieSelect} />

          {/* FilmList directly on background — no white card */}
          <FilmList
            movies={movies}
            onWatched={onWatched}
            onRate={onRate}
            onFavorite={onFavorite}
            onMovieSelect={onMovieSelect}
            onOpenListModal={onOpenListModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
