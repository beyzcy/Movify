import React from 'react';
import { List, Film } from 'lucide-react';
import Navbar from '../components/Navbar';
import FavoriteMovies from '../components/FavoriteMovies';
import FilmCard from '../components/FilmCard';

const Profile = ({
  movies, userLists,
  onWatched, onRate, onFavorite, onMovieSelect, onOpenListModal,
  activePage, onPageChange,
}) => {
  const watchedMovies  = movies.filter(m => m.watched);
  const favoriteMovies = movies.filter(m => m.isFavorite);
  const ratedMovies    = movies.filter(m => m.userRating > 0);
  const avgUserRating  = ratedMovies.length > 0
    ? (ratedMovies.reduce((sum, m) => sum + m.userRating, 0) / ratedMovies.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Navbar activePage={activePage} onPageChange={onPageChange} />

        <div className="px-8 pt-6 pb-4">
          {/* Kullanıcı */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center ring-4 ring-gray-100 flex-shrink-0">
              <span className="text-white text-xl font-bold">BC</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Beyza C</h2>
              <p className="text-sm text-gray-400">Premium Üye</p>
            </div>
          </div>

          {/* İstatistikler */}
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

        {/* Favori fan animasyonu */}
        <FavoriteMovies movies={movies} />

        {/* Listelerim */}
        <div className="px-8 pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Listelerim
            {userLists.length > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-400">({userLists.length})</span>
            )}
          </h3>

          {userLists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userLists.map(list => (
                <div key={list.list_id} className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <List className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{list.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{list.movieIds.size} film</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <List className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-500 text-sm font-medium">Henüz liste oluşturmadınız</p>
              <p className="text-gray-400 text-xs mt-1">Film kartına hover yapıp "Listeye Ekle"ye tıklayın</p>
            </div>
          )}
        </div>

        {/* İzlenen filmler */}
        <div className="border-t border-gray-50 px-8 pb-8 pt-6">
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
                  key={movie.movie_id}
                  movie={movie}
                  onWatched={onWatched}
                  onRate={onRate}
                  onFavorite={onFavorite}
                  onMovieSelect={onMovieSelect}
                  onOpenListModal={onOpenListModal}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Film className="w-14 h-14 text-gray-200 mb-4" />
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
