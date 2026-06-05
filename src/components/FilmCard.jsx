import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Heart, Info } from 'lucide-react';

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
          <span className={`text-base ${(hovered > 0 ? hovered : userRating) >= star ? 'text-amber-400' : 'text-gray-200'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

const FilmCard = ({ movie, onWatched, onDelete, onEdit, onRate, onFavorite, onMovieSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-40 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-2xl overflow-hidden mb-2.5 shadow-sm" style={{ height: '210px' }}>
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
          onError={(e) => { e.target.src = 'https://placehold.co/160x210?text=No+Image'; }}
        />

        {/* Watched badge top-right */}
        {movie.watched && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow z-10">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Action overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 z-20">
            {onMovieSelect && (
              <button
                onClick={() => onMovieSelect(movie.id)}
                className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                <Info className="w-3 h-3" />
                Detay
              </button>
            )}
            {!movie.watched && (
              <button
                onClick={() => onWatched(movie.id)}
                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                <Eye className="w-3 h-3" />
                İzlendi
              </button>
            )}
            <button
              onClick={() => onEdit(movie)}
              className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Düzenle
            </button>
            <button
              onClick={() => onDelete(movie.id)}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Sil
            </button>
          </div>
        )}

        {/* Heart — rendered last so z-30 always wins over overlay z-20 */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(movie.id); }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/65 transition-colors z-30"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              movie.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 truncate leading-snug">{movie.title}</h3>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-amber-400 text-xs">★</span>
        <span className="text-xs font-medium text-gray-600">{movie.rating}</span>
        <span className="text-gray-300 text-xs">|</span>
        <span className="text-xs text-gray-400">{movie.year}</span>
      </div>
      <StarRating movieId={movie.id} userRating={movie.userRating || 0} onRate={onRate} />
    </div>
  );
};

export default FilmCard;
