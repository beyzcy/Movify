import React, { useState } from 'react';
import { Eye, Heart, Info, ListPlus, CheckCircle2 } from 'lucide-react';

const StarRating = ({ movieId, userRating = 0, onRate }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5 mt-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={(e) => { e.stopPropagation(); onRate(movieId, star === userRating ? 0 : star); }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="leading-none focus:outline-none"
        >
          <span className="text-base transition-colors" style={{
            color: (hovered > 0 ? hovered : userRating) >= star ? '#f59e0b' : '#d1c4c4'
          }}>★</span>
        </button>
      ))}
    </div>
  );
};

const FilmCard = ({ movie, onWatched, onRate, onFavorite, onMovieSelect, onOpenListModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-40 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-2xl overflow-hidden mb-2.5 shadow-sm" style={{ height: '210px' }}>
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
          onError={(e) => { e.target.src = 'https://placehold.co/160x210?text=No+Image'; }}
        />

        {/* ── Watch status badge ─────────────────────────────────── */}
        {movie.watched ? (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10 whitespace-nowrap transition-colors duration-200"
            style={{ backgroundColor: '#819C81' }}
          >
            <CheckCircle2 className="w-3 h-3" />
            Watched
          </div>
        ) : (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
            <Eye className="w-3 h-3 text-white/60" />
          </div>
        )}

        {/* ── Hover overlay ──────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20 transition-opacity duration-200"
          style={{ backgroundColor: 'rgba(26,26,36,0.62)', opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          {onMovieSelect && (
            <button
              onClick={() => onMovieSelect(movie.movie_id)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.82)', color: '#1A1A24' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.97)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.82)'}
            >
              <Info className="w-3 h-3" />
              Details
            </button>
          )}

          {!movie.watched && (
            <button
              onClick={() => onWatched(movie.movie_id)}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
              style={{ backgroundColor: '#819C81' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <Eye className="w-3 h-3" />
              Mark Watched
            </button>
          )}

          {onOpenListModal && (
            <button
              onClick={() => onOpenListModal(movie.movie_id)}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
              style={{ backgroundColor: '#819C9C' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <ListPlus className="w-3 h-3" />
              Add to List
            </button>
          )}
        </div>

        {/* ── Heart — always on top ──────────────────────────────── */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(movie.movie_id); }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/65 transition-colors z-30"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${movie.isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} />
        </button>
      </div>

      <h3 className="text-sm font-semibold truncate leading-snug" style={{ color: '#1A1A24' }}>{movie.title}</h3>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-amber-400 text-xs">★</span>
        <span className="text-xs font-medium" style={{ color: '#1A1A24' }}>{movie.average_rating ?? '—'}</span>
        <span className="text-xs" style={{ color: '#c4b8b8' }}>|</span>
        <span className="text-xs text-gray-400">{movie.release_year}</span>
      </div>
      <StarRating movieId={movie.movie_id} userRating={movie.userRating || 0} onRate={onRate} />
    </div>
  );
};

export default FilmCard;
