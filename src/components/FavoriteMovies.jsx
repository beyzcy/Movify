import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const POSTER_W = 88;
const POSTER_H = 132;
const STACKED_X = 24;  // overlap offset when collapsed
const SPREAD_X = 100;  // offset between posters when expanded

const FavoriteMovies = ({ movies }) => {
  const [containerHovered, setContainerHovered] = useState(false);
  const favorites = movies.filter(m => m.isFavorite).slice(0, 5);
  const n = favorites.length;

  const getTranslateX = (index) => {
    const center = (n - 1) / 2;
    return (index - center) * (containerHovered ? SPREAD_X : STACKED_X);
  };

  const getZIndex = (index) => {
    const center = (n - 1) / 2;
    return containerHovered
      ? index + 1
      : Math.round(n - Math.abs(index - center));
  };

  if (n === 0) {
    return (
      <div className="mx-8 mb-6 rounded-2xl overflow-hidden bg-gray-900">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-base font-bold text-white">Favori Filmlerim</span>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-gray-300 text-sm font-medium">Henüz favori film eklemediniz</p>
          <p className="text-gray-500 text-xs mt-1.5 max-w-xs">
            Film kartındaki kalp ikonuna tıklayarak favorilere ekleyebilirsiniz
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-8 mb-6 rounded-2xl overflow-hidden bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          <span className="text-base font-bold text-white">Favori Filmlerim</span>
        </div>
        <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">
          {n} / 5 film
        </span>
      </div>

      <div
        className="relative flex items-center justify-center"
        style={{ height: POSTER_H + 80 }}
        onMouseEnter={() => setContainerHovered(true)}
        onMouseLeave={() => setContainerHovered(false)}
      >
        {favorites.map((movie, index) => (
          <div
            key={movie.id}
            style={{
              position: 'absolute',
              width: POSTER_W,
              height: POSTER_H,
              transform: `translateX(${getTranslateX(index)}px)`,
              zIndex: getZIndex(index),
              transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Inner wrapper handles individual poster hover independently */}
            <div
              className="w-full h-full rounded-xl overflow-hidden shadow-2xl cursor-pointer relative group/poster"
              style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://placehold.co/${POSTER_W}x${POSTER_H}?text=?`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-bold truncate leading-snug">{movie.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{movie.year}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMovies;
