import React from 'react';
import Navbar from '../components/Navbar';
import FavoriteMovies from '../components/FavoriteMovies';
import FilmCard from '../components/FilmCard';

const Profile = ({ movies, onWatched, onDelete, onEdit, onRate, onFavorite, activePage, onPageChange, onOpenForm, onMovieSelect }) => {
  const watchedMovies   = movies.filter(m => m.watched);
  const favoriteMovies  = movies.filter(m => m.isFavorite);
  const ratedMovies     = movies.filter(m => m.userRating > 0);
  const avgUserRating   = ratedMovies.length > 0
    ? (ratedMovies.reduce((sum, m) => sum + m.userRating, 0) / ratedMovies.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Navbar onOpenForm={onOpenForm} activePage={activePage} onPageChange={onPageChange} />

        <div className="px-8 pt-6 pb-4">
          {/* User info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center ring-4 ring-gray-100 flex-shrink-0">
              <span className="text-white text-xl font-bold">BC</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Beyza C</h2>
              <p className="text-sm text-gray-400">Premium Üye</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-gray-800">{movies.length}</p>
              <p className="text-sm text-gray-400 mt-1">Toplam Film</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-green-600">{watchedMovies.length}</p>
              <p className="text-sm text-gray-400 mt-1">İzlenen Film</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-red-500">{favoriteMovies.length}</p>
              <p className="text-sm text-gray-400 mt-1">Favori Film</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-amber-500">{avgUserRating}</p>
              <p className="text-sm text-gray-400 mt-1">Ort. Puanım</p>
            </div>
          </div>
        </div>

        {/* Favorites fan section */}
        <FavoriteMovies movies={movies} />

        {/* Watched list */}
        <div className="px-8 pb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5">
            İzlenen Filmler
            {watchedMovies.length > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-400">({watchedMovies.length})</span>
            )}
          </h3>

          {watchedMovies.length > 0 ? (
            <div className="flex gap-5 flex-wrap">
              {watchedMovies.map(movie => (
                <FilmCard
                  key={movie.id}
                  movie={movie}
                  onWatched={onWatched}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onRate={onRate}
                  onFavorite={onFavorite}
                  onMovieSelect={onMovieSelect}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium">Henüz hiç film izlemediniz</p>
              <p className="text-gray-400 text-sm mt-1">Film kartına hover yapıp "İzlendi" butonuna tıklayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
